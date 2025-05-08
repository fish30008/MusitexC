from tokens import Tokenizer,TokenType  # Your lexer class

from parser import *


def print_tokens(input_str):
    tk = Tokenizer(input_str)
    tokens = tk.tokenize()
    type(tokens)
    for token in tokens:
        if token.type is TokenType.NL:
            print("<NL: \\n>")
            continue
        print(f"<{token.type}: {token.str}>")

# Test string
test_string = """
title: "My Song"
tempo = 120
piano: do re mi
"""


# Run it
print_tokens(test_string)
