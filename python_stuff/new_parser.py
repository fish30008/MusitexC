from ai_ast import *

NOTES = [TokenType.do,TokenType.re,TokenType.mi,TokenType.fa,TokenType.sol,TokenType.la,TokenType.si, TokenType.KW_R]
END_STATEMENT = [TokenType.NL, TokenType.SEMICOLON]

class ParseState:

    MOVEMENT = "MOVEMENT"
    MACRO = "MACRO"
    
    EXPR = "EXPR"


class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0
        self.stack = []
        self.tracks = []
        self.macros = []
        self.metadata = []
        self.idents = {}

    def advance(self):
        self.pos += 1
        if self.pos < len(self.tokens):
            return self.tokens[self.pos - 1]
        return self.tokens[-1]  # Return EOF token

    def peek(self, offset):
        pos = self.pos + offset
        if pos < len(self.tokens):
            return self.tokens[pos]
        return self.tokens[-1]  # Return EOF token

    def match(self, token_type):
        curr = self.peek(0).type
        if curr == token_type:
            return True
        else :
            return False

    def expect(self, token_type):
        if self.peek(0).type == token_type:
            return self.advance()
        else:
            return None


    def parse(self):
        # Create program node (root of AST)
        #update metadata if you want to add for example

        if TokenType.KW_TRACK not in self.tokens:
            self.tracks.append(Track("global",[],self.peek(0)))
            pass

        # Skip initial newlines
        self.skip_whitespace()
        
        # Continue parsing until we reach EOF
        while self.peek(0).type != TokenType.EOF:
            # Handle metadata
            if self.peek(0).type == TokenType.KW_TITLE:
                self.advance() # consume title token
                self.skip_space()

                if self.expect(TokenType.COLON) is None:
                    raise SyntaxError(f"Expected colon after keyword title, got token {self.peek(0)}")
                else:
                    self.skip_space()
                    name = self.expect(TokenType.STRING)

                    if name is not None:
                        self.metadata.append(Metadata(name.value,name))

                    else:
                        raise SyntaxError(f"Expected string after title definiton, got token {name} instead")


            # Handle macro definition or movement
            elif self.peek(0).type == TokenType.ALPHANUM:
                ident = self.advance()
                

                self.skip_space()
                # parse macros
                if self.peek(0).type in [TokenType.EQUAL,TokenType.OPEN_PAREN]:
                    
                    # if it's a macro, it needs to be added to ident list
                    if ident.value in self.idents.keys():
                        raise SyntaxError(f"Identifier {ident.value} is already used here:{self.idents[ident.value]}, redefinitions are not allowed")
                    self.idents[ident.value] = ident

                    self.stack.append(ParseState.MACRO)
                    macro = self.parse_macro(ident)
                    self.macros.append(macro)
                    
                    self.idents[ident.value] = len(self.macros)

                    top = self.stack.pop()
                    if top != ParseState.MACRO:
                        raise ValueError(f"Expected Macro state on top of the stack, got {top} intead")

                # parse movements
                elif self.peek(0).type in [TokenType.STRING , TokenType.COLON]:
                    self.stack.append(ParseState.MOVEMENT)
                    movement = self.parse_movement(ident)
                    # append to the last defined track
                    self.tracks[-1].movements.append(movement)

                    # add the identifier for the movement to the list
                    m_ident = f"{movement.instrument.value}{movement.tag if movement.tag == "" else movement.tag.value}"
                    if (m_ident not in self.idents.keys()  # if the movement isn't defined already
                        or self.idents[m_ident][0] != len(self.tracks) # or if defined, doesn't belong to the same track
                    ):
                        self.idents[m_ident] = (len(self.tracks), len(self.tracks[-1].movements))


                    top = self.stack.pop()
                    if top != ParseState.MOVEMENT:
                        raise ValueError(f"Expected Movement state on top of the stack, got {top} intead")

                else:
                    raise SyntaxError(f"Unexpected token after alphanum: {self.peek(0)}")

            elif self.peek(0).type == TokenType.KW_TRACK:
                source = self.advance()
                name = "main"
                self.skip_space()
                
                if self.match(TokenType.STRING):
                    name = self.advance()
                    self.skip_space()

                if self.match(TokenType.COLON):
                    self.advance()
                    self.skip_whitespace()

                else :
                    raise SyntaxError(f"Syntax error: Expected colon or string after \"track\" , got token {self.peek(1)} instead")


            # Skip newlines between statements
            elif self.peek(0).type == TokenType.NL:
                self.advance()
            # Handle unexpected tokens 
            else:
                raise SyntaxError(
                    f"Parse error: Unexpected token {self.peek(0)} at line {self.peek(0).line}, column {self.peek(0).column}")

        return Program(self.metadata,self.macros,self.tracks, self.tokens[self.pos],self.idents)

    def parse_movement(self,instr):
        
        tag = ""
        body = []

        if self.match(TokenType.STRING):
            tag = self.advance()


            self.skip_space()

        if self.expect(TokenType.COLON) is None:
            raise SyntaxError(f"Expected colon after movement {instr}",self.log_tk())

        while self.peek(0).type not in END_STATEMENT:
            self.skip_space()
            body.append(self.parse_expr())
            self.skip_space()


        return Movement(instr,tag,body)

    def parse_macro(self, name):
        parameters = []
        body = []
        # Parse parameters
        if self.peek(0).type == TokenType.OPEN_PAREN:
            self.advance() # consume open paren token
            self.skip_space()

            while True:
                if self.match(TokenType.CLOSE_PAREN):
                    self.advance()
                    break

                # got some parameters
                elif self.match(TokenType.ALPHANUM):
                    param = self.advance()
                    parameters.append(param) 
                    self.idents[param.value] = param

                    self.skip_space()

                    # Parse additional parameters separated by commas
                    if self.match(TokenType.COMMA):
                        self.advance()  # Skip comma
                        self.skip_space()

                        if self.peek(0).type == TokenType.ALPHANUM:
                            continue

                        elif self.peek(0).type == TokenType.CLOSE_PAREN:
                            raise SyntaxError(f"Trailing comma in macro definition arguments: {self.peek(0)}")
                        else:
                            raise SyntaxError(
                                f"Expected parameter name, got {self.peek(0).type} at line {self.peek(0).line}, column {self.peek(0).column}")
                    # if no comma, has to be close paren
                    elif self.match(TokenType.CLOSE_PAREN):
                        self.advance()
                        break
                    else:
                        raise SyntaxError(f"Macro parameter must be fallowed by comma or closed parenthesi, got toke {self.peek(0)} instead")
                else:
                    raise SyntaxError(f"Expected identifier in arguments body, got token {self.peek(0) } instead")

        # end of parsing parameters

        self.skip_space()
            
        if not self.match(TokenType.EQUAL):
            raise SyntaxError(f"Expected equals sign after macro name or arguments",self.log_tk())

        self.advance() # skip equal token
        self.skip_space

        # Parse macro body

        while self.peek(0).type not in END_STATEMENT:
            self.skip_space()
            body.append(self.parse_expr())


        # End of parsing macro body
        
        self.advance()

        macro =  Macro(name, parameters, body)
       
        traverse_ast(macro,0)

        return macro 


    def parse_expr(self):
        self.stack.append(ParseState.EXPR)
        expression = None

        if False:
            todo("remove this branch later")


# simple expressions

        # Parse SetTone
        elif self.match(TokenType.PLUS):
            source = self.advance()
            if self.peek(0).type in NOTES:
                note = self.advance()
                expression = SetTone(1,note,source)
            else:
                raise SyntaxError(f"Expected note literal after plus{self.log_tk()}")

        elif self.match(TokenType.DASH):
            source = self.advance()
            if self.peek(0).type in NOTES:
                note = self.advance()
                expression = SetTone(-1,note,source)
            else:
                raise SyntaxError(f"Expected note literal after dash{self.log_tk}")

        # Parse SetOctave
        elif self.match(TokenType.GREATER_THAN):
            source = self.advance()
            oct = 0
            if self.match(TokenType.NUM):
                oct = int(self.advance().value)

            expression =SetOctave(1,oct,source)

        # Parse SetOctave        
        elif self.match(TokenType.LESS_THAN):
            source = self.advance()
            oct = 0
            if self.match(TokenType.NUM):
                oct = int(self.advance().value)

            expression = SetOctave(-1,oct,source)

        # Parse SetDuration
        elif self.match(TokenType.COLON):
            source = self.advance()
            
            if self.match(TokenType.NUM):
                expression = SetDuration(int(self.advance().value),source)
            else:
                raise SyntaxError(f"After colon expression expected number",self.log_tk())

        # Parse SetTempo
        elif self.match(TokenType.BANG):
            source = self.advance()

            if self.match(TokenType.NUM):
                x = int(self.advance().value)
                over = None
                if self.expect(TokenType.SLASH) is not None:
                    if self.match(TokenType.NUM):
                        over = int(self.advance().value)
                    else:
                        raise SyntaxError(f"Expected number after slash",self.log_tk())

                tempo = Fraction(x,over) if over is not None else x
                expression =SetTempo(tempo,source)

        # Parse Bar
        elif self.match(TokenType.PIPE):
            expression =Bar(self.advance())

        # Parse SetInterval
        elif self.match(TokenType.NUM):
            # it's a duration
            expression =SetInterval(self.advance())


# compound expressions

        # Parse Repetition
        elif self.match(TokenType.ASTERISK):
            source = self.advance()
            n = int(self.advance().value)
            if self.stack[-1] == ParseState.EXPR:
                expression = Repetition(n,source)
            else:
                raiseSyntaxError("Repetition postfix operator can only be used after an expression",self.log_tk())
        # Parse ReleaseNote
        elif self.match(TokenType.CLOSE_PAREN):
            source = self.advance()
            if self.stack[-1] == ParseState.EXPR:
                expression = ReleaseNote(source)
            else:
                raise SyntaxError("Close paren postfix operator can only be used after an expression",self.log_tk())

        # Parse HoldNote
        elif self.match(TokenType.OPEN_PAREN):
            #parse hold
            source = self.advance()
            note = self.parse_expr()
            if isinstance(note,Note) or isinstance(note,Chord) or isinstance(note,Ident):
                expression =HoldNote(note,source)
            else:
                raise SyntaxError(f"Expected note or identifier after open parenthesis",self.log_tk())

        # Parse ExprGroup
        elif self.match(TokenType.OPEN_BRACKET):

            source = self.advance()
            self.skip_whitespace()
            exprs = []
            # gotta parse a expr group
            while not self.match(TokenType.CLOSE_BRACKET):
                exprs.append(self.parse_expr())
                self.skip_whitespace() #whitespace doesn't matter within a expr group
            
            self.advance() # skip close bracket

            # space doesn't matter after parsing an expr
            self.skip_space()
            
            expression =ExprGroup(exprs,source)


        # Parse ident or chord
        elif self.match(TokenType.ALPHANUM):
            ident = self.advance()

            if ident.value not in self.idents.keys():
                self.idents[ident.value] = ident

            if self.match(TokenType.SLASH):
                # parsing chord
                self.advance()
                curr_ident = Ident(ident)
                notes = [curr_note]
                while self.peek(0).type not in [TokenType.NL, TokenType.SPACE]:
                    ident = self.parse_expr()
                    if isinstance(ident,Note):
                        notes.append(ident)
                        self.stack.pop()
                        return Chord(notes,ident)
                    
                    if isinstance(ident,Chord):
                        notes.extend(ident.notes)
                        self.stack.pop()
                        return Chord(notes,ident)

                    if isinstance(ident,Ident):
                        notes.append(ident)
                        self.stack.pop()
                        return Chord(notes,ident)


                    raise SyntaxError(f"Chords can only be formed from notes,using {ident} is not valid")
            
            # parse Macro appl
            elif self.match(TokenType.OPEN_PAREN):
                self.advance()
                self.skip_space()
                args = []
                while True:
                    args.append(self.parse_expr())
                    
                    self.skip_whitespace()

                    if self.expect(TokenType.CLOSE_PAREN):
                        break
                    
                    if self.expect(TokenType.COMMA):
                        continue
                    else:
                        raise SyntaxError(f"Expected comma or close parenthesis after expression in argument list",self.log_tk())

                self.stack.pop()

                return MacroCall(ident,args)



            expression =Ident(ident)
        
        # Parse Note or chord
        elif self.peek(0).type in NOTES:
            # parse notes
            note_p = self.advance()

            semitone = 0
            octave = -1 # placeholder for default value
            duration = -1 # placeholder for default value
            # parse semitones 
            while True:
                if self.match(TokenType.PLUS):
                    semitone +=1
                    self.advance()
                elif self.match(TokenType.DASH):
                    semitone -=1
                    self.advance()
                else:
                    break


            if self.match(TokenType.DOT):
                self.advance()
                if self.match(TokenType.NUM):
                    octave = self.advance()

            if self.match(TokenType.SLASH):
                # parsing chord
                self.advance() #consume slash
                curr_note = Note(note_p,semitone,octave,duration)
                notes = [curr_note]
                while self.peek(0).type not in [TokenType.NL, TokenType.SPACE]:
                    note = self.parse_expr()
                    if isinstance(note,Note):
                        notes.append(note)
                        self.stack.pop()
                        return Chord(notes,note_p)
                    
                    elif isinstance(note,Chord):
                        notes.extend(note.notes)
                        self.stack.pop()
                        return Chord(notes,note_p)

                    elif isinstance(note,Ident):
                        notes.append(note)
                        self.stack.pop()
                        return Chord(notes,note_p)

                    else:
                        raise SyntaxError(f"Chords can only be formed from notes,using {note} is not valid, notes= {notes}, curr{self.peek(0)}")
                        

            if self.match(TokenType.COLON):
                self.advance()

                if self.match(TokenType.NUM):
                    duration = float(self.advance().value)
                elif self.match(TokenType.SLASH):
                    self.advance() #consume slash token

                    if self.match(TokenType.NUM):
                        duration = Fraction(1,int(self.advance().value))
                    else:
                        raise SyntaxError(f"After slash expected a number",self.log_tk())

                else :
                        raise SyntaxError(f"After colon in note definition expected a number",self.log_tk())
            
            expression =Note(note_p,semitone,octave,duration)

        else:
            raise SyntaxError(f"Unexpected token while parsing expressions: {self.peek(0)}")

        top = self.stack.pop()
        if top != ParseState.EXPR:
            raise ValueError(f"Expected expr on top of the stack, got {top} instead")

        if expression is None:
            raise ValueError(f"Expression must not be none",self.log_tk())

        return expression


# helper parser functions
    def skip_space(self):
        while self.peek(0).type == TokenType.SPACE:
            self.advance()

    def skip_whitespace(self):
        while self.peek(0).type == TokenType.SPACE or self.peek(0).type == TokenType.NL:
            self.advance()

    def skip_newlines(self):
        """Skip any newline tokens"""
        while self.peek(0).type == TokenType.NL:
            self.advance()

    def log_tk(self):
        return f", got token {self.peek(0)} instead\nstack:{self.stack}"
