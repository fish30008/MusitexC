package parser

import "core:fmt"

import "core:io"
import bio"core:bufio"
import "core:os"

import str"core:strings"
import "core:bytes"
//import small"core:container/small_array"

import "core:log"
import "core:testing"
when ODIN_DEBUG {print :: fmt.println
		printf :: fmt.printf
} else when ODIN_TEST {
	print  :: log.info
	printf :: log.infof
} else {printf :: proc(fmt: string, args: ..any, flush := true) {}
	print :: proc(args: ..any, sep := " ", flush := true) {}}

buffer:[]byte


main :: proc(){
	parse_test(nil)
}

@(test)
parse_test :: proc(t:^testing.T){
	source:= 
`
#comment
title:"testing parse"
---
# now the header ended

# defining a simple macro
macro = do re mi fa |

# defining a macro with arguments
macro2 with(arg1,arg2) = arg1 re mi arg2

# using an instrument to play
piano : macro | macro2(do b b, mi)
`

	buffer = make([]byte,len(source))
	bbuffer:bytes.Buffer
	bytes.buffer_init(&bbuffer,transmute([]u8)source)
	bstream := bytes.buffer_to_stream(&bbuffer)

	// get a buffered io reader
	fstream :bio.Reader
	bio.reader_init_with_buf(&fstream, bstream,buffer)

	for start := 0 ; true ; {
		switch pop(&tk_stack) {
		case .NONE	: start = tk_none(&fstream); continue 
		case .IDENTIFIER: start = tk_iden(&fstream)
		case .DELIMITER	: start = tk_delm(&fstream)
		case .NUMERIC	: start = tk_numr(&fstream)
		case .STRING	: start = tk_strl(&fstream)
		case .COMMENT	: start = tk_comm(&fstream)
		case .EOF	: break
		}

		if fstream.r == 0 {print("end of file"); break}

	}

	append(&token_stream, Token{
		"eof",curr_line+1,0, .EOF
	})

	print_tokens(false)
}


//@parse

pop :: proc(stack:^[dynamic]Tokenize_state)->Tokenize_state{
	if state,ok:=pop_safe(stack); ok{
		return state
	}
	return .NONE
}

//@tk

tk_stack : [dynamic]Tokenize_state
token_stream :[dynamic]Token
curr_n :int
curr_line:int

tk :: proc(stream:^bio.Reader)->(ts:[]Token){
	tk_stack = make([dynamic]Tokenize_state)
	defer delete(tk_stack)

	for start := 0 ; true ; {
		switch pop(&tk_stack) {
		case .NONE	: start = tk_none(stream); continue 
		case .IDENTIFIER: start = tk_iden(stream)
		case .DELIMITER	: start = tk_delm(stream)
		case .NUMERIC	: start = tk_numr(stream)
		case .STRING	: start = tk_strl(stream)
		case .COMMENT	: start = tk_comm(stream)
		case .EOF	: break
		}

		if stream.r == 0 {print("end of file"); break}

	}

	append(&token_stream, Token{
		"eof",curr_line+1,0, .EOF
	})

	print_tokens(true)
	

	return token_stream[:]
}



Tokenize_state :: enum {
	NONE,
	COMMENT,
	EOF,
	// symbols
	IDENTIFIER,
	DELIMITER,
	NUMERIC,

	// literal
	STRING,
}

Token :: struct{
	str: string, 
	line: int,
	n:int,
	type: Token_type,
}

tk_comm :: #force_inline proc(stream:^bio.Reader)->(start:int){
	print("Tokenizing possible comments\n")
	defer {print("End of tokenizing possible comments\n")}
	start = stream.r
	_byte,err := bio.reader_read_byte(stream)
	for _byte != '\n'{
		if err != nil{break}
		_byte,err = bio.reader_read_byte(stream)
	}
	if err == .EOF {
		append(&tk_stack, Tokenize_state.EOF)
		return 
	} else if err !=nil {
		fmt.printf("unexpected error while parsing comments :%v\n",err)
		os.exit(1)
	}

	curr_line+=1; curr_n = 0
	return
}

tk_delm :: #force_inline proc(stream:^bio.Reader)->int{
	print("Tokenizing possible delimiter\n")
	defer {print("End of tokenizing possible delimiter\n")}token_type:Token_type
	local_state:= Tokenize_state.NONE

	switch string(stream.buf[stream.r-1:stream.r]){
	case "{" : token_type = .OPEN_BRACE
	case "}" : token_type = .CLOSE_BRACE
	case "(" : token_type = .OPEN_PAREN
	case ")" : token_type = .CLOSE_PAREN
	case "[" : token_type = .OPEN_BRACKET
	case "]" : token_type = .CLOSE_BRACKET
	case ":" : token_type = .COLON
	case "\"": token_type = .DOUBLE_QUOTE//; local_state = .STRING
	case "," : token_type = .COMMA
	case "|" : token_type = .PIPE
	case "/" : token_type = .SLASH
	case "=" : token_type = .EQUAL
	case "'" : token_type = .SINGLE_QUOTE
	case "." : token_type = .DOT
	case "-" : token_type = .DASH
	case ">" : token_type = .GREATER_THAN
	case "<" : token_type = .LESS_THAN
	case "*" : token_type = .ASTERISK
	case ";" : token_type = .SEMICOLON
	case "+" : token_type = .PLUS
	case "#" : 
		append(&tk_stack,Tokenize_state.COMMENT)
		return stream.r
	case     : 
		fmt.printf(
			"unknown symbol: %v, at pos:%v", 
			string(stream.buf[stream.r-1:stream.r]),
			curr_line,
		)
	}


	append(&token_stream, Token{
		str = string(stream.buf[stream.r-1:stream.r]),
		line= curr_line,
		n   = curr_n,
		type= token_type,
	})
	print(token_stream[len(token_stream) -1])

	append(&tk_stack,local_state)
	return stream.r
}

tk_strl :: #force_inline proc(stream:^bio.Reader)->(start:int){
	print("Tokenizing possible string literal\n")
	defer {print("End of tokenizing possible string literal\n")}
	start = stream.r
	str_len := 1
	local_state := Tokenize_state.NONE
	escaped := false

	loop: for {
		curr,n,_ := bio.reader_read_rune(stream)
		curr_n   +=1

		switch curr {
		case '\n' : curr_line+=1; curr_n = 0
		case '\\' : escaped = true
		case '"'  : 
			if escaped{
				escaped = false
				break
			}
			break loop
		}

		if n == 0 {local_state= .EOF; break loop}
		str_len+=1
	}
	append(&token_stream, Token{
		str = string(stream.buf[start-1:start+str_len]),
		line= curr_line,
		n   = curr_n,
		type= .STRING,
	})

	print(token_stream[len(token_stream) -1])

	append(&tk_stack,local_state)
	return

}

tk_numr :: #force_inline proc(stream:^bio.Reader)->(start:int){
	print("Tokenizing possible number\n")
	defer {print("End of tokenizing possible number\n")}
	start = stream.r
	num_len := 1
	local_state := Tokenize_state.NONE
	
	found_nl := false
	prev_n :=0

	loop: for {
		curr,n,_ := bio.reader_read_rune(stream)
		curr_n   +=1

		switch curr {
		case '\n' : 
			print("should push nl token")
			curr_line+=1; 
			prev_n = curr_n; 
			curr_n = 0; 
			found_nl = true; 
			break loop
		case ' ','\t', '\r': num_len-=1; break loop
		case '0'..='9': continue
		case 'm' : 
			if string(stream.buf[stream.r-1:stream.r+n]) == "ms"{
				stream.r+=1
			}
			panic("Improper use of integers, did you mean ms instead of m?\n")
		}
		
		if is_delim(string(stream.buf[stream.r-1:stream.r+n-1])){
			local_state= .DELIMITER
			num_len-=1
			break loop
		}

		if n == 0 {local_state= .EOF; break loop}
		num_len+=1
	}
	append(&token_stream, Token{
		str = string(stream.buf[start-1:start+num_len]),
		line= curr_line,
		n   = curr_n,
		type= .NUM,
	})

	print(token_stream[len(token_stream) -1])

	if  found_nl {
		append(&token_stream,Token{
			str = string(stream.buf[start+num_len-1:start+num_len]),
			line= curr_line,
			n   = prev_n,
			type= .NL,
		})

		print(token_stream[len(token_stream) -1])
	}
	append(&tk_stack, local_state)
	return
}

tk_iden :: #force_inline proc(stream:^bio.Reader)->(start:int){
	print("Tokenizing possible identifier\n")
	defer {print("End of tokenizing possible identifier\n")}

	start = stream.r
	iden_len := 1
	local_state := Tokenize_state.NONE

	found_nl := false
	prev_n :=0

	loop: for {
		curr,n,_ := bio.reader_read_rune(stream)
		curr_n   +=1

		switch curr {
		case '\n' : 
			print("should push nl token")
			curr_line+=1
			prev_n = curr_n
			curr_n = 0
			iden_len -=1
			found_nl = true
			break loop
		case ' ','\t','\r': iden_len-=1; break loop
		}
		
		if is_delim(string(stream.buf[stream.r-1:stream.r+n-1])){
			local_state= .DELIMITER
			iden_len-=1
			break loop
		}

		if n == 0 {local_state= .EOF; break loop}
		iden_len+=1
	}

	if is_keyword(stream,start-1,start+iden_len){
		// is_keyword already appends to the token_stream
		append(&tk_stack, local_state)
		print(token_stream[len(token_stream)-1])
		return
	}

	append(&token_stream, Token{
		str = string(stream.buf[start-1:start+iden_len]),
		line= curr_line,
		n   = curr_n,
		type= .ALPHANUM,
	})

	print(token_stream[len(token_stream) -1])

	if found_nl {
		append(&token_stream,Token{
			str = string(stream.buf[start+iden_len:start+iden_len+1]),
			line= curr_line,
			n   = prev_n,
			type= .NL,
		})

		print(token_stream[len(token_stream) -1])

	}

	
	append(&tk_stack, local_state)
	return
}
tk_none :: #force_inline proc(stream:^bio.Reader)->(start:int){
	print("Tokenizing possible nothing\n")
	defer {print("End of tokenizing possible nothing\n")}
	//last_state = tk_stack
	start = stream.r
	
	for i:= 0 ; true ; i+=1{
		curr,n,_ := bio.reader_read_rune(stream)
		curr_n   +=1

		switch curr {
		case '\n'    : 
			curr_line+=1
			curr_n = 0
			append(&token_stream,Token{
				str = string(stream.buf[start:start+1]),
				line= curr_line,
				n   = 0,
				type= .NL,
			})
			print(token_stream[len(token_stream) -1])

			fallthrough
		case ' ','\t','\r':  continue

		case 'a'..='z', 'A'..='Z', '_' :
			append(&tk_stack, Tokenize_state.IDENTIFIER); return

		case '0'..='9' : 
			append(&tk_stack, Tokenize_state.NUMERIC); return
		
		case '"' :  
			append(&tk_stack, Tokenize_state.STRING); return
		}

		if is_delim(string(stream.buf[start+i:start+n+i])){
			append(&tk_stack, Tokenize_state.DELIMITER)
			return 
		}

		if n == 0 {append(&tk_stack, Tokenize_state.EOF); return}
	}

	fmt.printf(
		"Unsuported character for identifiers: %s",
		stream.buf[stream.r:stream.r+1],
	)

	return
}


// @delim
delimiters :: "{" + "}" + "(" + ")" + "[" + "]" + ":" + "\"" + "," + "/" + "=" + "#" + "'" + "." + "-" + "+" + ">" + "<" + "*" + " " + "\n" + "\t" + ";" + "|"

is_delim :: #force_inline proc(str:string)->bool{
	switch str{
	case "{" , "}" , "(" , ")" , "[" , "]" , ":" , "\"" , "," , "/" , "=" , "#" , "'" , "."  , "-" , "+" , ">" , "<" , "*", ";", "|": return true
	case : return false
	}
}

is_keyword :: proc(stream: ^bio.Reader, start,end:int)->bool{

	keyword_type:Token_type
	text := string(stream.buf[start:end])
	switch text {
	case "with"          : keyword_type = .KW_WITH 
	case "title"         : keyword_type = .KW_TITLE 
	case "copy_right"    : keyword_type = .KW_CR
	case "key"           : keyword_type = .KW_KEY 
	case "tempo"         : keyword_type = .KW_TEMPO 
	case "b"             : keyword_type = .KW_B 
	case "s"             : keyword_type = .KW_S 
	case "r"	     : keyword_type = .KW_R
	case "octave"        : keyword_type = .KW_OCTAVE 
	case "measure" , "m"   : keyword_type = .KW_MEASURE
	case : return false
	}

	append(&token_stream, Token{
		str = text,
		line= curr_line,
		n   = curr_n,
		type= keyword_type,
	})

	return true
}

// @token
Token_type :: enum u8{
	// Delimiters
	OPEN_BRACE,
	CLOSE_BRACE,
	OPEN_PAREN,
	CLOSE_PAREN,
	OPEN_BRACKET,
	CLOSE_BRACKET,
	COLON,
	DOUBLE_QUOTE,
	COMMA,
	PIPE,
	SLASH,
	EQUAL,
	// New line, needed for ending statements
	NL,
	//HASH, comments are not saved in the token stream
	SINGLE_QUOTE,
	DOT,
	DASH,
	PLUS,
	GREATER_THAN,
	LESS_THAN,
	ASTERISK,
	SEMICOLON,

	DELIM_N,

	// literals
	ALPHANUM,
	NUM,
	STRING,

	// keywords
	KW_WITH, 
	KW_TITLE, 
	KW_CR,
	KW_KEY, 
	KW_TEMPO, 
	KW_B, 
	KW_S, 
	KW_R,
	KW_OCTAVE, 
	KW_MEASURE,

	EOF, 
}




print_tokens :: proc($verbose:bool){

	for token in token_stream {
		if token.type == .NL{
			fmt.println("<\\n>")
			continue
		}
		when verbose { 

			fmt.printf("<%v : \"%#v\"> ",token.type, token.str)

		} else {fmt.printf("<%v> ",token.str)}

	}
}
