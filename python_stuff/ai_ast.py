# AST Node classes
from lexer import *
class ASTNode:
    def __init__(self, source):
        self.source = source
        pass

    def __repr__(self):
        return self.__str__()

    def source(self):
        return self.source


class Program(ASTNode):
    def __init__(self, metadata, macros, tracks, source):
        super().__init__(source)
        self.metadata = metadata
        self.macros = macros
        self.tracks = tracks

    def __str__(self):
        return f"Program(metadata={self.metadata}, macros={self.macros},tracks={self.tracks})"


class Metadata(ASTNode):
    def __init__(self, title,source):
        super().__init__(source)
        self.title = title 

    def __str__(self):
        return f"Metadata(title={self.title})"

### Statements:

class Macro(ASTNode):
    def __init__(self, name, parameters, body,source):
        super().__init__(source)
        self.name = name
        self.parameters = parameters
        self.body = body

    def __str__(self):
        return f"Macro(name={self.name}, parameters={self.parameters}, body={self.body})"


class Track(ASTNode):
    def __init__(self, name, movements,source):
        super().__init__(source)
        self.name = name
        self.elements = movements

    def __str__(self):
        return f"Track(name={self.name}, movements={self.elements})"

class Movement(ASTNode):
    def __init__(self, tag, expressions,source):
        super().__init__(source)
        self.tag = tag
        self.expressions = expressions

    def __str__(self):
        return f"Movement(tag={self.tag}, expressions={self.expressions})"


### Expressions

class Note(ASTNode):
    def __init__(self, value,octave,duration,source):
        super().__init__(source)
        self.value = value
        self.octave = octave
        self.duration = duration


    def __str__(self):
        return f"Note({self.value}, octave={self.octave}, duration={self.duration})"


class MacroCall(ASTNode):
    def __init__(self, name, arguments,source):
        super().__init__(source)
        self.name = name
        self.arguments = arguments
    def __str__(self):
        return f"MacroCall(name={self.name}, arguments={self.arguments or []})"

class Repetition(ASTNode):
    def __init__(self, expr, times, source):
        super().__init__(source)
        self.expr = expr
        self.times = times
        self.source = source
    
    def __str__(self):
        return f"Repeat({self.expr}*{self.times})"

class SetOctave(ASTNode):
    def __init__(self,dir, n,source):
        super().__init__(source)
        self.dir = dir
        self.n = n

    def __str__(self):
        return f"set(Shift {'<' if self.dir else '>'} by {self.n})"

class SetDuration(ASTNode):
    def __init__(self,dur,source):
        super().__init__(source)
        self.dur = dur

    def __str__(self):
        return f"set(Duration={self.dur})"

class SetTempo(ASTNode):
    def __init__(self,n):
        super().__init__(source)
        self.n = n

    def __str__(self):
        return f"set(Tempo={self.n})"

class SetTone(ASTNode):
    def __init__(self,n,note,source):
        super().__init__(source)
        self.n = n
        self.note = note
    
    def __str__(self):
        return f"set(Semitone for {self.note} = {self.n})"

class bar(ASTNode):
    def __init__(self,source):
        super().__init__(source)
    
    def __str__(self):
        return f" bar "

class setInterval(ASTNode):
    def __init__(self,time,source):
        super().__init__(source)
        self.time = time
    
    def __str__(self):
        return f"set(Interval={self.time})"

class temp(ASTNode):
    def __init__(self,source):
        super().__init__(source)
    
    def __str__(self):
        return f"temp"

## Collections/groups
class exprGroup(ASTNode):
    def __init__(self,exprs,source):
        super().__init__(source)
        self.exprs = exprs
    
    def __str__(self):
        return f"exprGroup{{ {self.expr} }}"

### errors

class errExpr(ASTNode):





def traverse_ast(node, indent=0):
    prefix = "  " * indent
    result = []

    if isinstance(node, Program):
        result.append(f"{prefix}Program:")
        result.append(traverse_ast(node.metadata, indent + 1))

        if node.macros:
            result.append(f"{prefix}Macros:")
            for macro in node.macros:
                result.append(traverse_ast(macro, indent + 1))

        if node.tracks:
            result.append(f"{prefix}Tracks:")
            for track in node.tracks:
                result.append(traverse_ast(track, indent + 1))

    elif isinstance(node, Metadata):
        result.append(f"{prefix}Metadata:")
        if node.title:
            result.append(f"{prefix}  Title: {node.title}")

    elif isinstance(node, Macro):
        result.append(f"{prefix}Macro '{node.name}':")
        result.append(f"{prefix}  Parameters: {node.parameters}")
        result.append(f"{prefix}  Body:")
        for element in node.body:
            result.append(traverse_ast(element, indent + 2))

    elif isinstance(node, Track):
        result.append(f"{prefix}Track '{node.name}':")
        result.append(f"{prefix}  Movements:")
        for element in node.movements:
            result.append(traverse_ast(element, indent + 2))

    elif isinstance(node, Repetition):
        result.append(f"{prefix}Repeat*{node.times}:")
        for expr in node.expr:
            result.append(traverse_ast(expr, indent+2))

    elif isinstance(node, SetOctave) or isinstance(node,SetDuration) or isinstance(node, SetTone) or isinstance(node, MacroCall) or isinstance(node, Note):
        return f"{prefix}{node}"

    todo: finish this

        

    return "\n".join(result) if isinstance(result, list) else result

