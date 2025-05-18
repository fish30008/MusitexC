from new_parser import Parser
from lexer import Tokenizer
from simplify import * 
from ai_ast import traverse_ast
from midigen import *
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
    # print(traverse_ast(ast,0))
    flatten_expr_group(ast)
    # print(traverse_ast(ast,0))
    resolve_macros(ast)
    # print(traverse_ast(ast,0))
    
    output = ""
    try:
        output = sys.argv[2]
    except:
        output = file_name.split(".")[1][1:] + ".midi"
        # files are in the form ./twinkle.midi , after splitting /twinkle, skip / with [1:]
    gen_midi(ast,output)



    pass

if __name__ == "__main__":
    main()
