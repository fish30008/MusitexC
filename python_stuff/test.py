from lexer import *
from new_parser import *
print("start program")

# comprehensive test of all the features
source = """

title : "demo"

macro2 (arg1, arg2) = arg1 do re arg2
macro = do re mi


track "main":


piano : do+.4:4 re-.4:/4 | > :4 !3/4 mi

piano "not piano" : [



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

print("printing ast")
print(traverse_ast(ast, 0))


