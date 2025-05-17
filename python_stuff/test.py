from lexer import *
from new_parser import *
from simplify import *

print("start program")

# comprehensive test of all the features
source = """

title : "demo"


macro2 (arg1, arg2) = arg1 do re arg2

macro = do re mi macro_1
macro_1 = fa sol la


track "main":


piano : do+.4:4 re-.4:/4 | > :4 ^120 mi

piano "not piano" : [

    !4/3

    +do

    -re

    (do/mi/sol.4 10 r:10 


    re do/mi/sol)
    <4 macro
]

violin "wow" : macro2(do,re)*2

"""

tk = Tokenizer(source)

tk.tokenize()


print(tk.tokens)

parser = Parser(tk.tokens)
print(parser)

ast = parser.parse()

print("printing ast, before resolving macros")
print(traverse_ast(ast, 0))
print(ast.ident_dic)

print("printing ast, after resolving repeats")
resolve_repeats(ast)
print(traverse_ast(ast,0))

print("printing ast, after flattening expr groups")
flatten_expr_group(ast)
print(traverse_ast(ast,0))

print()
resolve_macros(ast)
print("printing ast after resolving macros")
print(traverse_ast(ast,0))


