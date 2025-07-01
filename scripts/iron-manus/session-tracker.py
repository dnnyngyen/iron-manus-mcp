#!/usr/bin/env python3
"""
Iron Manus Session Tracker Hook
PostToolUse hook for mcp__iron-manus-mcp__JARVIS that logs FSM progression and performance metrics.
Provides comprehensive observability for the 8-phase FSM workflow.
"""

import json
import sys
import datetime
import os
from pathlib import Path
from typing import Dict, Any, Optional

# Log file location
LOG_FILE = Path.home() / '.claude' / 'iron-manus-log.txt'

def ensure_log_directory():
    """Ensure the log directory exists."""
    LOG_FILE.parent.mkdir(exist_ok=True)

def extract_session_metrics(tool_input: Dict[str, Any], tool_response: Dict[str, Any]) -> Dict[str, Any]:
    """Extract relevant metrics from JARVIS tool input/output."""
    metrics = {
        'session_id': tool_input.get('session_id', 'unknown'),
        'phase_completed': tool_input.get('phase_completed'),
        'initial_objective': tool_input.get('initial_objective'),
        'payload_keys': list(tool_input.get('payload', {}).keys()) if tool_input.get('payload') else [],
    }
    
    # Parse tool response to extract FSM state information
    try:
        if isinstance(tool_response.get('content'), list) and tool_response['content']:
            response_text = tool_response['content'][0].get('text', '')
            if response_text:
                response_data = json.loads(response_text)
                metrics.update({
                    'next_phase': response_data.get('next_phase'),
                    'status': response_data.get('status'),
                    'allowed_tools': response_data.get('allowed_next_tools', []),
                    'reasoning_effectiveness': response_data.get('payload', {}).get('reasoning_effectiveness'),
                })
    except (json.JSONDecodeError, KeyError, IndexError):
        # Response parsing failed - still log what we can
        pass
    
    return metrics

def format_log_entry(metrics: Dict[str, Any], timestamp: str) -> str:
    """Format a log entry for the session tracker."""
    session_id = metrics['session_id']
    phase_info = ""
    
    if metrics.get('phase_completed'):
        phase_info = f"[{metrics['phase_completed']} → {metrics.get('next_phase', '?')}]"
    elif metrics.get('next_phase'):
        phase_info = f"[INIT → {metrics['next_phase']}]"
    
    status = metrics.get('status', 'UNKNOWN')
    
    # Build log line
    log_parts = [
        timestamp,
        f"Session: {session_id[:8]}...",
        phase_info,
        f"Status: {status}",
    ]
    
    # Add reasoning effectiveness if available
    if metrics.get('reasoning_effectiveness'):
        effectiveness = metrics['reasoning_effectiveness']
        log_parts.append(f"Effectiveness: {effectiveness:.2f}")
    
    # Add objective for new sessions
    if metrics.get('initial_objective'):
        objective = metrics['initial_objective'][:50] + '...' if len(metrics['initial_objective']) > 50 else metrics['initial_objective']
        log_parts.append(f"Objective: {objective}")
    
    # Add allowed tools count
    if metrics.get('allowed_tools'):
        tool_count = len(metrics['allowed_tools'])
        log_parts.append(f"Tools: {tool_count}")
    
    return " | ".join(log_parts)

def log_session_activity(metrics: Dict[str, Any]):
    """Log session activity to the tracking file."""
    ensure_log_directory()
    
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = format_log_entry(metrics, timestamp)
    
    try:
        with open(LOG_FILE, 'a', encoding='utf-8') as f:
            f.write(log_entry + '\n')
    except IOError as e:
        print(f"Warning: Failed to write to log file: {e}", file=sys.stderr)

def analyze_session_pattern(session_id: str) -> Optional[Dict[str, Any]]:
    """Analyze session patterns for insights (basic implementation)."""
    if not LOG_FILE.exists():
        return None
    
    try:
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        session_lines = [line for line in lines if session_id[:8] in line]
        
        if len(session_lines) >= 2:
            return {
                'session_length': len(session_lines),
                'start_time': session_lines[0].split(' | ')[0],
                'last_activity': session_lines[-1].split(' | ')[0],
                'phases_seen': len([line for line in session_lines if '→' in line])
            }
    except IOError:
        pass
    
    return None

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
    
    # Only process JARVIS tool calls
    if "JARVIS" not in tool_name:
        sys.exit(0)
    
    # Extract metrics from the tool interaction
    metrics = extract_session_metrics(tool_input, tool_response)
    
    # Log the session activity
    log_session_activity(metrics)
    
    # Optional: Analyze session patterns for longer sessions
    session_id = metrics.get('session_id', '')
    if session_id and session_id != 'unknown':
        pattern_analysis = analyze_session_pattern(session_id)
        if pattern_analysis and pattern_analysis['session_length'] > 5:
            print(f"📊 Session insight: {pattern_analysis['phases_seen']} phase transitions in {pattern_analysis['session_length']} interactions")
    
    # Success - continue with normal flow
    sys.exit(0)

if __name__ == "__main__":
    main()