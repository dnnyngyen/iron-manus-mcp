#!/usr/bin/env python3
"""
Iron Manus API Validator Hook
PreToolUse and PostToolUse hook for MultiAPIFetch that enforces rate limits and scores responses.
Integrates with the existing Iron Manus rate limiting and API registry system.
"""

import json
import sys
import time
import hashlib
import os
import tempfile
from pathlib import Path
from typing import Dict, Any, List, Optional
from urllib.parse import urlparse

# Rate limiter state tracking (mimics Iron Manus RateLimiter)
class SimpleRateLimiter:
    def __init__(self):
        self.api_states: Dict[str, Dict[str, Any]] = {}
    
    def can_make_request(self, api_name: str, max_requests: int = 100, time_window_ms: int = 60000) -> bool:
        """Check if a request can be made to the specified API."""
        now = int(time.time() * 1000)  # Current time in milliseconds
        
        if api_name not in self.api_states:
            self.api_states[api_name] = {
                'tokens': max_requests,
                'last_refill': now,
                'request_count': 0
            }
        
        state = self.api_states[api_name]
        
        # Refill tokens based on time passed
        time_elapsed = now - state['last_refill']
        tokens_to_add = (time_elapsed // time_window_ms) * max_requests
        
        if tokens_to_add > 0:
            state['tokens'] = min(max_requests, state['tokens'] + tokens_to_add)
            state['last_refill'] = now
            state['request_count'] = 0
        
        # Check if we can make the request
        if state['tokens'] > 0:
            state['tokens'] -= 1
            state['request_count'] += 1
            return True
        
        return False
    
    def get_rate_limit_status(self, api_name: str) -> Dict[str, Any]:
        """Get current rate limit status for an API."""
        state = self.api_states.get(api_name)
        if not state:
            return {'tokens': 0, 'request_count': 0, 'last_refill': 0}
        return state.copy()

# Global rate limiter instance
rate_limiter = SimpleRateLimiter()

def parse_time_window(time_window: str) -> int:
    """Parse time window string to milliseconds (e.g., '1h', '30m', '1d')."""
    import re
    match = re.match(r'^(\d+)([smhd])$', time_window.lower())
    if not match:
        return 60000  # Default to 1 minute
    
    amount, unit = match.groups()
    num = int(amount)
    
    if unit == 's':
        return num * 1000
    elif unit == 'm':
        return num * 60 * 1000
    elif unit == 'h':
        return num * 60 * 60 * 1000
    elif unit == 'd':
        return num * 24 * 60 * 60 * 1000
    else:
        return 60000

def get_api_name_from_url(url: str) -> str:
    """Extract API name from URL for rate limiting."""
    try:
        parsed = urlparse(url)
        # Use hostname as API name for rate limiting
        return parsed.hostname or 'unknown'
    except:
        return 'unknown'

def validate_rate_limits(api_endpoints: List[str]) -> List[str]:
    """Validate rate limits for API endpoints."""
    violations = []
    
    for url in api_endpoints:
        api_name = get_api_name_from_url(url)
        
        # Default rate limits (can be customized per API)
        max_requests = 100
        time_window_ms = 60000  # 1 minute
        
        # Check if API has custom rate limits (simplified lookup)
        # In a full implementation, this would look up the API registry
        if 'catfact.ninja' in url:
            max_requests = 100
            time_window_ms = parse_time_window('1h')
        elif 'dog.ceo' in url:
            max_requests = 1000
            time_window_ms = parse_time_window('1h')
        
        if not rate_limiter.can_make_request(api_name, max_requests, time_window_ms):
            status = rate_limiter.get_rate_limit_status(api_name)
            violations.append(f"Rate limit exceeded for {api_name}: {status['request_count']} requests, {status['tokens']} tokens remaining")
    
    return violations

def score_api_response(response_data: Dict[str, Any]) -> Dict[str, Any]:
    """Score API response quality based on various criteria."""
    score = {
        'overall_score': 0.5,  # Base score
        'completeness': 0.0,
        'response_time': 0.0,
        'data_quality': 0.0,
        'error_rate': 1.0,  # 1.0 = no errors, 0.0 = all errors
        'content_size': 0,
        'timestamp': int(time.time())
    }
    
    if not response_data:
        return score
    
    # Check for successful responses
    successful_responses = 0
    total_responses = 0
    total_content_size = 0
    total_response_time = 0
    
    # Parse response content if available
    content = response_data.get('content', [])
    if content and isinstance(content, list):
        try:
            response_text = content[0].get('text', '')
            if response_text:
                parsed_response = json.loads(response_text)
                
                # Extract metrics from parsed response
                if isinstance(parsed_response, dict):
                    results = parsed_response.get('results', [])
                    if results:
                        total_responses = len(results)
                        for result in results:
                            if result.get('success', False):
                                successful_responses += 1
                                total_content_size += len(str(result.get('data', '')))
                                total_response_time += result.get('response_time', 0)
                            
        except (json.JSONDecodeError, KeyError, TypeError):
            pass
    
    # Calculate scores
    if total_responses > 0:
        score['error_rate'] = successful_responses / total_responses
        score['completeness'] = min(1.0, successful_responses / max(1, total_responses))
        
        if successful_responses > 0:
            avg_response_time = total_response_time / successful_responses
            # Score response time (faster = better, cap at 5000ms)
            score['response_time'] = max(0.0, 1.0 - (avg_response_time / 5000))
            
            # Score data quality based on content size
            avg_content_size = total_content_size / successful_responses
            score['content_size'] = avg_content_size
            score['data_quality'] = min(1.0, avg_content_size / 100)  # 100+ chars = good quality
    
    # Calculate overall score
    score['overall_score'] = (
        score['completeness'] * 0.3 +
        score['response_time'] * 0.2 +
        score['data_quality'] * 0.3 +
        score['error_rate'] * 0.2
    )
    
    return score

def save_session_score(session_id: str, score_data: Dict[str, Any]):
    """Save API score data to session-specific temporary file."""
    if not session_id or session_id == 'unknown':
        return
    
    # Create session-specific temp file
    temp_dir = Path(tempfile.gettempdir()) / 'iron-manus-sessions'
    temp_dir.mkdir(exist_ok=True)
    
    session_file = temp_dir / f"{session_id[:8]}_api_scores.json"
    
    # Load existing scores
    scores = []
    if session_file.exists():
        try:
            with open(session_file, 'r') as f:
                scores = json.load(f)
        except (json.JSONDecodeError, IOError):
            scores = []
    
    # Append new score
    scores.append(score_data)
    
    # Keep only last 50 scores to prevent unbounded growth
    scores = scores[-50:]
    
    # Save updated scores
    try:
        with open(session_file, 'w') as f:
            json.dump(scores, f, indent=2)
    except IOError as e:
        print(f"Warning: Failed to save session scores: {e}", file=sys.stderr)

def main():
    """Main hook execution."""
    try:
        # Read JSON input from stdin
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    
    tool_name = input_data.get("tool_name", "")
    tool_input = input_data.get("tool_input", {})
    tool_response = input_data.get("tool_response", {})
    session_id = input_data.get("session_id", "unknown")
    
    # Only process MultiAPIFetch tool calls
    if "MultiAPIFetch" not in tool_name:
        sys.exit(0)
    
    violations = []
    
    # PreToolUse: Rate limit validation
    if not tool_response:  # This is a PreToolUse call
        api_endpoints = tool_input.get("api_endpoints", [])
        if api_endpoints:
            violations.extend(validate_rate_limits(api_endpoints))
        
        # If violations found, block with exit code 2
        if violations:
            print("API rate limit validation failed:", file=sys.stderr)
            for violation in violations:
                print(f"• {violation}", file=sys.stderr)
            print("\nPlease wait before making additional API requests.", file=sys.stderr)
            sys.exit(2)
    
    # PostToolUse: Response scoring
    else:
        api_endpoints = tool_input.get("api_endpoints", [])
        score_data = score_api_response(tool_response)
        score_data['api_count'] = len(api_endpoints)
        score_data['session_id'] = session_id
        
        # Save score to session file
        save_session_score(session_id, score_data)
        
        # Print score summary for user
        print(f"📊 API Response Score: {score_data['overall_score']:.2f} (completeness: {score_data['completeness']:.2f}, speed: {score_data['response_time']:.2f}, quality: {score_data['data_quality']:.2f})")
    
    # Success - continue with normal flow
    sys.exit(0)

if __name__ == "__main__":
    main()