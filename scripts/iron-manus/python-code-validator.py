#!/usr/bin/env python3
"""
Python Code Validator
This script validates Python code using an Abstract Syntax Tree (AST) to ensure
it only contains safe operations. It is used as a security measure to prevent
code injection attacks.
"""

import ast
import sys

# Allowlist of safe AST nodes
ALLOWED_NODES = {
    'Module', 'Expr', 'Load', 'Str', 'Num', 'Name', 'Attribute', 'Call',
    'keyword', 'Assign', 'AugAssign', 'Store', 'BinOp', 'Add', 'Sub', 'Mult',
    'Div', 'Mod', 'Pow', 'LShift', 'RShift', 'BitOr', 'BitXor', 'BitAnd',
    'FloorDiv', 'Invert', 'Not', 'UAdd', 'USub', 'Compare', 'Eq', 'NotEq',
    'Lt', 'LtE', 'Gt', 'GtE', 'Is', 'IsNot', 'In', 'NotIn', 'BoolOp', 'And',
    'Or', 'UnaryOp', 'Lambda', 'IfExp', 'Dict', 'Set', 'ListComp', 'SetComp',
    'DictComp', 'GeneratorExp', 'Await', 'Yield', 'YieldFrom', 'Subscript',
    'Index', 'Slice', 'ExtSlice', 'List', 'Tuple', 'Pass', 'Continue', 'Break',
    'For', 'While', 'If', 'With', 'Raise', 'Try', 'Assert', 'Delete', 'Global',
    'Nonlocal', 'Return', 'Import', 'ImportFrom', 'alias'
}

# Allowlist of safe built-in functions
ALLOWED_BUILTINS = {
    'print', 'len', 'range', 'int', 'float', 'str', 'bool', 'abs', 'all',
    'any', 'ascii', 'bin', 'callable', 'chr', 'classmethod', 'complex',
    'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'filter', 'format',
    'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex',
    'id', 'isinstance', 'issubclass', 'iter', 'list', 'locals', 'map',
    'max', 'min', 'next', 'object', 'oct', 'ord', 'pow', 'property',
    'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted',
    'staticmethod', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
}

# Allowlist of safe modules
ALLOWED_MODULES = {
    'math', 'random', 'datetime', 'time', 'json', 're', 'collections',
    'functools', 'itertools', 'operator', 'string', 'os.path'
}

def validate_node(node):
    """Recursively validate an AST node."""
    node_type = type(node).__name__
    if node_type not in ALLOWED_NODES:
        raise SecurityViolation(f"Disallowed AST node: {node_type}")

    if isinstance(node, ast.Call):
        if isinstance(node.func, ast.Name) and node.func.id not in ALLOWED_BUILTINS:
            raise SecurityViolation(f"Disallowed built-in function: {node.func.id}")

    if isinstance(node, (ast.Import, ast.ImportFrom)):
        for alias in node.names:
            if alias.name not in ALLOWED_MODULES:
                raise SecurityViolation(f"Disallowed module import: {alias.name}")

    if isinstance(node, ast.Attribute):
        # This is a simplification. A more robust solution would track the types
        # of variables to ensure that only allowed methods are called.
        pass


    for child_node in ast.iter_child_nodes(node):
        validate_node(child_node)

class SecurityViolation(Exception):
    """Custom exception for security violations."""
    pass

def main():
    """Main validation logic."""
    code = sys.stdin.read()
    try:
        tree = ast.parse(code)
        validate_node(tree)
        sys.exit(0)
    except (SyntaxError, SecurityViolation) as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
