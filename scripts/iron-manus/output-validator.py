#!/usr/bin/env python3
"""
Iron Manus Output Validator Hook
PostToolUse hook for critical tools (Write, Task, Edit) that performs deterministic output validation.
Provides structured feedback to Claude for intelligent rollback decisions in the VERIFY phase.
"""

import json
import sys
import re
import os
from pathlib import Path
from typing import Dict, Any, List, Optional

# Validation rules for different file types and tools
VALIDATION_RULES = {
    'code_quality': [
        {
            'pattern': r'\bTODO:?\s',
            'message': 'Code contains unresolved TODO items',
            'severity': 'warning',
            'suggestion': 'Complete or remove TODO items before finalizing'
        },
        {
            'pattern': r'\bFIXME:?\s',
            'message': 'Code contains FIXME comments',
            'severity': 'error',
            'suggestion': 'Address FIXME issues before proceeding'
        },
        {
            'pattern': r'\bXXX:?\s',
            'message': 'Code contains XXX markers',
            'severity': 'error',
            'suggestion': 'Resolve XXX markers indicating problematic code'
        },
        {
            'pattern': r'console\.log\(',
            'message': 'Debug console.log statements found',
            'severity': 'warning',
            'suggestion': 'Remove debug logging before production'
        },
        {
            'pattern': r'debugger;',
            'message': 'Debugger statements found',
            'severity': 'error',
            'suggestion': 'Remove debugger statements'
        }
    ],
    'typescript_quality': [
        {
            'pattern': r':\s*any\b',
            'message': 'TypeScript any types detected',
            'severity': 'warning',
            'suggestion': 'Use specific types instead of any for better type safety'
        },
        {
            'pattern': r'@ts-ignore',
            'message': 'TypeScript ignore comments found',
            'severity': 'warning',
            'suggestion': 'Address TypeScript errors instead of ignoring them'
        },
        {
            'pattern': r'function\s+\w+\([^)]*\)\s*\{[^}]*\}',
            'message': 'Empty function detected',
            'severity': 'info',
            'suggestion': 'Implement function body or add TODO comment'
        }
    ],
    'json_quality': [
        {
            'pattern': r',\s*[}\]]',
            'message': 'Trailing commas in JSON',
            'severity': 'error',
            'suggestion': 'Remove trailing commas for valid JSON'
        }
    ],
    'security': [
        {
            'pattern': r'password\s*=\s*["\'][^"\']+["\']',
            'message': 'Hardcoded password detected',
            'severity': 'error',
            'suggestion': 'Use environment variables for sensitive data'
        },
        {
            'pattern': r'api[_-]?key\s*=\s*["\'][^"\']+["\']',
            'message': 'Hardcoded API key detected',
            'severity': 'error',
            'suggestion': 'Use environment variables for API keys'
        },
        {
            'pattern': r'token\s*=\s*["\'][^"\']+["\']',
            'message': 'Hardcoded token detected',
            'severity': 'error',
            'suggestion': 'Use secure token management'
        }
    ]
}

def get_file_extension(file_path: str) -> str:
    """Get file extension from path."""
    return Path(file_path).suffix.lower()

def validate_file_content(file_path: str, content: str) -> List[Dict[str, Any]]:
    """Validate file content based on file type and general quality rules."""
    issues = []
    extension = get_file_extension(file_path)
    
    # Apply security rules to all files
    for rule in VALIDATION_RULES['security']:
        matches = re.finditer(rule['pattern'], content, re.IGNORECASE | re.MULTILINE)
        for match in matches:
            line_num = content[:match.start()].count('\n') + 1
            issues.append({
                'type': 'security',
                'severity': rule['severity'],
                'message': rule['message'],
                'suggestion': rule['suggestion'],
                'line': line_num,
                'pattern': rule['pattern']
            })
    
    # Apply code quality rules to code files
    if extension in ['.ts', '.js', '.tsx', '.jsx', '.py', '.go', '.java', '.cpp', '.c', '.h']:
        for rule in VALIDATION_RULES['code_quality']:
            matches = re.finditer(rule['pattern'], content, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                issues.append({
                    'type': 'code_quality',
                    'severity': rule['severity'],
                    'message': rule['message'],
                    'suggestion': rule['suggestion'],
                    'line': line_num,
                    'pattern': rule['pattern']
                })
    
    # Apply TypeScript-specific rules
    if extension in ['.ts', '.tsx']:
        for rule in VALIDATION_RULES['typescript_quality']:
            matches = re.finditer(rule['pattern'], content, re.MULTILINE)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                issues.append({
                    'type': 'typescript_quality',
                    'severity': rule['severity'],
                    'message': rule['message'],
                    'suggestion': rule['suggestion'],
                    'line': line_num,
                    'pattern': rule['pattern']
                })
    
    # Apply JSON-specific rules
    if extension == '.json':
        for rule in VALIDATION_RULES['json_quality']:
            matches = re.finditer(rule['pattern'], content)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                issues.append({
                    'type': 'json_quality',
                    'severity': rule['severity'],
                    'message': rule['message'],
                    'suggestion': rule['suggestion'],
                    'line': line_num,
                    'pattern': rule['pattern']
                })
    
    return issues

def validate_write_tool_output(tool_input: Dict[str, Any], tool_response: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Validate Write tool output."""
    issues = []
    file_path = tool_input.get('file_path', '')
    content = tool_input.get('content', '')
    
    if not file_path or not content:
        return issues
    
    # Validate file content
    issues.extend(validate_file_content(file_path, content))
    
    # Check if file was actually created/modified
    if file_path and os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                actual_content = f.read()
                if actual_content != content:
                    issues.append({
                        'type': 'file_integrity',
                        'severity': 'warning',
                        'message': 'File content differs from intended content',
                        'suggestion': 'Verify file was written correctly',
                        'line': 0
                    })
        except (IOError, UnicodeDecodeError):
            issues.append({
                'type': 'file_access',
                'severity': 'error',
                'message': 'Cannot read written file',
                'suggestion': 'Check file permissions and encoding',
                'line': 0
            })
    else:
        issues.append({
            'type': 'file_creation',
            'severity': 'error',
            'message': 'File was not created successfully',
            'suggestion': 'Check file path and permissions',
            'line': 0
        })
    
    return issues

def validate_task_tool_output(tool_input: Dict[str, Any], tool_response: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Validate Task tool output for meta-prompt execution."""
    issues = []
    
    # Check if Task tool was successful
    if tool_response.get('isError', False):
        issues.append({
            'type': 'task_execution',
            'severity': 'error',
            'message': 'Task tool execution failed',
            'suggestion': 'Review task parameters and try again',
            'line': 0
        })
    
    # Check for incomplete task responses
    content = tool_response.get('content', [])
    if content and isinstance(content, list):
        response_text = content[0].get('text', '') if content else ''
        
        # Look for incomplete or placeholder responses
        if len(response_text.strip()) < 10:
            issues.append({
                'type': 'task_completion',
                'severity': 'warning',
                'message': 'Task response appears incomplete',
                'suggestion': 'Ensure task agent provided substantial output',
                'line': 0
            })
        
        # Check for error indicators in response
        error_indicators = ['error:', 'failed:', 'cannot', 'unable to', 'not found']
        for indicator in error_indicators:
            if indicator.lower() in response_text.lower():
                issues.append({
                    'type': 'task_error',
                    'severity': 'warning',
                    'message': f'Task response indicates potential error: {indicator}',
                    'suggestion': 'Review task execution for errors',
                    'line': 0
                })
                break
    
    return issues

def should_block_execution(issues: List[Dict[str, Any]]) -> bool:
    """Determine if execution should be blocked based on validation issues."""
    # Block on any error-level issues
    error_count = sum(1 for issue in issues if issue['severity'] == 'error')
    
    # Block on security issues regardless of severity
    security_issues = sum(1 for issue in issues if issue['type'] == 'security')
    
    # Block on multiple warnings (threshold approach)
    warning_count = sum(1 for issue in issues if issue['severity'] == 'warning')
    
    return error_count > 0 or security_issues > 0 or warning_count >= 3

def format_validation_feedback(issues: List[Dict[str, Any]]) -> str:
    """Format validation issues into readable feedback for Claude."""
    if not issues:
        return "Output validation passed successfully."
    
    feedback_lines = ["Output validation found the following issues:"]
    
    # Group issues by severity
    errors = [i for i in issues if i['severity'] == 'error']
    warnings = [i for i in issues if i['severity'] == 'warning']
    info = [i for i in issues if i['severity'] == 'info']
    
    if errors:
        feedback_lines.append("\n🚫 ERRORS (must be fixed):")
        for issue in errors:
            line_info = f" (line {issue['line']})" if issue['line'] > 0 else ""
            feedback_lines.append(f"  • {issue['message']}{line_info}")
            feedback_lines.append(f"    → {issue['suggestion']}")
    
    if warnings:
        feedback_lines.append("\n⚠️  WARNINGS (should be addressed):")
        for issue in warnings:
            line_info = f" (line {issue['line']})" if issue['line'] > 0 else ""
            feedback_lines.append(f"  • {issue['message']}{line_info}")
            feedback_lines.append(f"    → {issue['suggestion']}")
    
    if info:
        feedback_lines.append("\nℹ️  INFO (consider addressing):")
        for issue in info:
            line_info = f" (line {issue['line']})" if issue['line'] > 0 else ""
            feedback_lines.append(f"  • {issue['message']}{line_info}")
    
    return "\n".join(feedback_lines)

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
    
    # Only process critical tools
    if not any(critical_tool in tool_name for critical_tool in ["Write", "Task", "Edit"]):
        sys.exit(0)
    
    # Perform validation based on tool type
    issues = []
    
    if "Write" in tool_name:
        issues.extend(validate_write_tool_output(tool_input, tool_response))
    elif "Task" in tool_name:
        issues.extend(validate_task_tool_output(tool_input, tool_response))
    elif "Edit" in tool_name:
        # For Edit tools, validate the file content if available
        file_path = tool_input.get('file_path', '')
        if file_path and os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    issues.extend(validate_file_content(file_path, content))
            except (IOError, UnicodeDecodeError):
                pass
    
    # Determine if execution should be blocked
    should_block = should_block_execution(issues)
    
    if should_block:
        # Return structured JSON to block execution and provide feedback
        feedback = format_validation_feedback(issues)
        result = {
            "decision": "block",
            "reason": feedback
        }
        print(json.dumps(result))
        sys.exit(0)
    
    # Output passed validation or only has minor issues
    if issues:
        feedback = format_validation_feedback(issues)
        print(f"⚠️  Output validation completed with minor issues:\n{feedback}")
    else:
        print("✅ Output validation passed successfully")
    
    sys.exit(0)

if __name__ == "__main__":
    main()