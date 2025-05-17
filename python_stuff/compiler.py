from new_parser import Parser
from lexer import Tokenizer
from simplify import * 
from ai_ast import traverse_ast
import sys

def main():
    file_name = sys.argv[1]

    with open(file_name) as f:
        source = f.read()

    tokenizer = Tokenizer(source)
    tokens = tokenizer.tokenize()

    parser = Parser(tokens)
    ast = parser.parse()

    resolve_repeats(ast)
    print(traverse_ast(ast,0))
    flatten_expr_group(ast)
    print(traverse_ast(ast,0))
    resolve_macros(ast)
    print(traverse_ast(ast,0))




    pass

if __name__ == "__main__":
    main()
