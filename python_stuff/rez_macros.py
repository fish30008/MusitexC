from new_parser import Parser
from ai_ast import *

def resolve_macros(program):
    
    # iterate through movements in the ast and find macros
    for t_id,track in enumerate(program.tracks):
        for m_id,mov in enumerate(track.movements):
            for e_id,expr in enumerate(mov.expressions):
                if isinstance(expr,Ident):
                    print("found identifier: ",expr)
                    maps = program.ident_dic[expr.source.value]
                    try:

                        macro_b = program.macros[maps-1]
                        print("\ntraversing macro")
                        print(macro_b)
                        traverse_ast(macro_b,1)
                        print()
                    except:
                        raise ValueError(f"Unknown idenfitier: {expr}")


                    continue
                if isinstance(expr,MacroCall):
                    print("found macro call specifically:", expr)

    pass

def resolve_macro_body(macro):

    return macro.body

def inline_macro_body(macro):

    return macro.body
