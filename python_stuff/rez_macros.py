from new_parser import Parser
from ai_ast import *
from lexer import *

def resolve_macros(program):
    
    # iterate through movements in the ast and find macros
    for t_id,track in enumerate(program.tracks):
        for m_id,mov in enumerate(track.movements):
            while True: # iterate until no more modifications were made
                mov_body = mov.expressions
                was_modified = False

                for e_id,expr in enumerate(mov_body):
                    if isinstance(expr,Ident):
                        print("found identifier: ",expr)
                        maps = program.ident_dic[expr.source.value]
                        try:

                            macro = program.macros[maps-1]
                            mov_body = mov_body[:e_id] + inline_macro_body(macro,program) + mov_body[e_id+1:]
                        except:
                            raise ValueError(f"Unknown idenfitier: {expr}")
                        
                        was_modified = True

                        continue
                    if isinstance(expr,MacroCall):
                        print("found macro call specifically:", expr)

                mov.expressions = mov_body
                print(traverse_ast(mov,0))
                if not was_modified:
                    break

    pass

def apply_macro(macro,program):

    return macro.body

def inline_macro_body(macro,program):

    macro_body = macro.body

    for e_id,expr in enumerate(macro.body):
        if isinstance(expr,Ident):
            maps = program.ident_dic[expr.source.value]
            try:

                new_macro = program.macros[maps-1]
                macro.body = macro.body[:e_id] + inline_macro_body(new_macro,program) + macro.body[e_id+1:]
            except:
                raise ValueError(f"Unknown idenfitier: {expr}")
            continue

        if isinstance(expr,MacroCall):
            print("found macro call specifically:", expr)
            

    return macro.body
