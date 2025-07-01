#!/usr/bin/env python3
"""
Iron Manus Security Validator Hook
PreToolUse hook that enhances security by validating Bash commands and API URLs.
Exit code 2 blocks the tool call and provides feedback to Claude.
"""

import json
import re
import sys
import urllib.parse
import ipaddress
from typing import List, Dict, Any

# Dangerous command patterns to block
DANGEROUS_BASH_PATTERNS = [
    r'\brm\s+-rf\b',                    # rm -rf
    r'\bsudo\s+rm\b',                   # sudo rm
    r'\bmv\s+.*\s+/dev/null\b',         # move to /dev/null
    r'\b>\s*/dev/s[a-z]+\b',            # redirect to /dev/sd*
    r'\bdd\s+if=.*of=/dev/\b',          # dd to disk devices
    r'\bformat\s+[A-Z]:\b',             # Windows format command
    r'\bdel\s+/[SFQ]\b',                # Windows recursive delete
    r'\bchmod\s+777\b',                 # overly permissive permissions
    r'\bchown\s+.*:.*\s+/\b',           # chown on root directory
    r'\bnc\s+.*-e\b',                   # netcat with execute
    r'\bcurl\s+.*\|\s*sh\b',            # pipe curl to shell
    r'\bwget\s+.*\|\s*sh\b',            # pipe wget to shell
    r'\beval\s+\$\(',                   # eval with command substitution
    r'\bexport\s+PATH=.*:.*\$PATH\b',   # PATH manipulation
]

# Private IP ranges (IPv4)
PRIVATE_IP_RANGES = [
    ipaddress.ip_network('10.0.0.0/8'),
    ipaddress.ip_network('172.16.0.0/12'),
    ipaddress.ip_network('192.168.0.0/16'),
    ipaddress.ip_network('127.0.0.0/8'),
    ipaddress.ip_network('169.254.0.0/16'),
    ipaddress.ip_network('0.0.0.0/8'),
]

# Localhost variants
LOCALHOST_VARIANTS = ['localhost', '0.0.0.0', '127.0.0.1', '::1', '::']

def is_private_ip(hostname: str) -> bool:
    """Check if hostname is a private IP address."""
    try:
        ip = ipaddress.ip_address(hostname)
        return any(ip in network for network in PRIVATE_IP_RANGES)
    except ValueError:
        return False

def is_localhost(hostname: str) -> bool:
    """Check if hostname is a localhost variant."""
    return hostname.lower() in LOCALHOST_VARIANTS

def validate_url(url: str, allowed_hosts: List[str] = None) -> bool:
    """
    Validate URL for SSRF protection.
    Based on Iron Manus existing SSRF guard logic.
    """
    try:
        parsed = urllib.parse.urlparse(url)
        
        # Block non-HTTP(S) protocols
        if parsed.scheme not in ['http', 'https']:
            return False
            
        hostname = parsed.hostname
        if not hostname:
            return False
            
        # Block private IPs
        if is_private_ip(hostname):
            return False
            
        # Block localhost variants
        if is_localhost(hostname):
            return False
            
        # If allowed hosts specified, check against them
        if allowed_hosts:
            allowed = False
            for allowed_host in allowed_hosts:
                if allowed_host.startswith('*.'):
                    # Wildcard subdomain support
                    domain = allowed_host[2:]
                    if hostname == domain or hostname.endswith('.' + domain):
                        allowed = True
                        break
                elif hostname == allowed_host:
                    allowed = True
                    break
            return allowed
            
        # If no allowed hosts, allow all public hosts
        return True
        
    except Exception:
        return False

def validate_bash_command(command: str) -> List[str]:
    """Validate bash command for dangerous patterns."""
    violations = []
    
    for pattern in DANGEROUS_BASH_PATTERNS:
        if re.search(pattern, command, re.IGNORECASE):
            violations.append(f"Dangerous command pattern detected: {pattern}")
            
    return violations

def validate_api_urls(api_endpoints: List[str]) -> List[str]:
    """Validate API endpoints for SSRF protection."""
    violations = []
    
    # Get allowed hosts from environment (mimicking Iron Manus config)
    import os
    allowed_hosts_env = os.environ.get('ALLOWED_HOSTS', '')
    allowed_hosts = [host.strip() for host in allowed_hosts_env.split(',') if host.strip()]
    
    for url in api_endpoints:
        if not validate_url(url, allowed_hosts):
            violations.append(f"URL blocked by SSRF protection: {url}")
            
    return violations

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
    
    violations = []
    
    # Validate Bash commands
    if tool_name == "Bash":
        command = tool_input.get("command", "")
        if command:
            violations.extend(validate_bash_command(command))
    
    # Validate MultiAPIFetch URLs
    elif "MultiAPIFetch" in tool_name:
        api_endpoints = tool_input.get("api_endpoints", [])
        if api_endpoints:
            violations.extend(validate_api_urls(api_endpoints))
    
    # If violations found, block with exit code 2
    if violations:
        print("Security validation failed:", file=sys.stderr)
        for violation in violations:
            print(f"• {violation}", file=sys.stderr)
        print("\nThis action has been blocked for security reasons.", file=sys.stderr)
        sys.exit(2)
    
    # No violations - allow tool execution
    sys.exit(0)

if __name__ == "__main__":
    main()