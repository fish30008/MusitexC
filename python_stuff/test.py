from lexer import *
from new_parser import *
from rez_macros import *

print("start program")

# comprehensive test of all the features
source = """

title : "demo"


macro2 (arg1, arg2) = arg1 do re arg2

macro = do re mi macro_1
macro_1 = fa sol la


track "main":


piano : do+.4:4 re-.4:/4 | > :4 !3/4 mi

piano "not piano" : [

    +do

    -re

    (do/mi/sol.4 10 r:10 


    re do/mi/sol)
    <4 macro
]

violin "wow" : macro | macro2(do,re)*5

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


print()
resolve_macros(ast)
# print("printing ast after resolving macros")
# print(traverse_ast(ast,0))


