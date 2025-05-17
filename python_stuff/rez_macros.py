from new_parser import Parser
from ai_ast import *
from lexer import *
import copy


def flatten_expr_group(program):
    for m_id,macro in enumerate(program.macros):
        for e_id,expr in enumerate(macro.body):
            if isinstance(expr, ExprGroup):
                macro.body = macro.body[:e_id] + expr.exprs + macro.body[e_id+1:]

    # resolve repeats in movements
    for t_id,track in enumerate(program.tracks):
        for m_id,mov in enumerate(track.movements):
            for e_id,expr in enumerate(mov.expressions):
                if isinstance(expr,ExprGroup):
                    mov.expressions = mov.expressions[:e_id-1] + expr.exprs + mov.expressions[e_id+1:]
    

def resolve_repeats(program):
    # resolve repeats in macros
    for m_id,macro in enumerate(program.macros):
        for e_id,expr in enumerate(macro.body):
            if isinstance(expr, Repetition):
                if e_id == 0:
                    raise SyntaxError(f"Repetition must fallow an expression {expr}")


                last_expr = macro.body[e_id-1]
                macro.body = macro.body[:e_id-1] + [last_expr]*(expr.times) + macro.body[e_id+1:]

    # resolve repeats in movements
    for t_id,track in enumerate(program.tracks):
        for m_id,mov in enumerate(track.movements):
            for e_id,expr in enumerate(mov.expressions):
                if isinstance(expr,Repetition):
                    if e_id == 0 :
                        raise SyntaxError(f"Repetition must fallow an expression {expr}")

                    last_expr = mov.expressions[e_id-1]
                    mov.expressions = mov.expressions[:e_id-1] + [last_expr]*expr.times + mov.expressions[e_id+1:]



    pass

def resolve_macros(program):
    
    # iterate through movements in the ast and find macros
    for t_id,track in enumerate(program.tracks):
        for m_id,mov in enumerate(track.movements):
            while True: # iterate until no more modifications were made
                mov_body = copy.copy(mov.expressions) #make a shallow copy of the expr list
                was_modified = False

                for e_id,expr in enumerate(mov_body):
                    if isinstance(expr,Ident):
                        maps = program.ident_dic[expr.source.value]
                        macro = None

                        try:
                            macro = program.macros[maps-1]
                        except:
                            raise ValueError(f"Unknown idenfitier: {expr}")

                        mov_body = mov_body[:e_id] + inline_macro_body(macro,program) + mov_body[e_id+1:]
                        was_modified = True
                        break


                    if isinstance(expr,MacroCall):
                        maps = program.ident_dic[expr.name.value]
                        macro = None
                        try:
                            macro = program.macros[maps-1]
                        except:
                            raise ValueError(f"Unknown macro: {expr}")

                        new_macro = apply_macro(macro,expr.arguments,program)
                        mov_body = mov_body[:e_id] + inline_macro_body(new_macro,program) + mov_body[e_id+1:]
                        was_modified = True
                        break

                mov.expressions = mov_body
                if not was_modified:
                    break

    pass

def apply_macro(macro,args,program):
    arg_map = {}
    new_macro = copy.deepcopy(macro)

    if len(macro.parameters) != len(args):
        raise ValueError(f"Expected {len(macro.parameters)} arguments, got only {len(args)}")

    for i,param in enumerate(macro.parameters):
        arg_map[param.value] = args[i]

    arg_keys = arg_map.keys()
    for e_id,expr in enumerate(macro.body):
        if expr.source.value in arg_keys:
            new_macro.body = new_macro.body[:e_id] + [arg_map[expr.source.value]] + new_macro.body[e_id+1:]



    print(f"\nmacro after applying param:{traverse_ast(new_macro,2)}\n")
    return new_macro

def inline_macro_body(macro,program):

    macro_body = copy.copy(macro.body)

    for e_id,expr in enumerate(macro.body):
        if isinstance(expr,Ident):
            maps = program.ident_dic[expr.source.value]
            new_macro = None

            try:
                new_macro = program.macros[maps-1]
            except:
                raise ValueError(f"Unknown idenfitier: {expr}")
            
            macro_body = macro.body[:e_id] + inline_macro_body(new_macro,program) + macro.body[e_id+1:]
            continue

        if isinstance(expr,MacroCall):
            maps = program.ident_dic[expr.name]
            new_macro = None

            try:
                new_macro = program.macros[maps-1]
            except:
                raise ValueError(f"Unknown macro: {expr}") 

            another_macro = apply_macro(macro,program)
            macro_body = macro.body[:e_id] + inline_macro_body(another_macro,program) + macro.body[e_id+1:]

    print(f"macro body to be inlined:{macro_body}")
    return macro_body
