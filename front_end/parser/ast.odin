package parser

import "core:fmt"
import str"core:strings"

Parse_state :: enum {
	// general
	NONE,
	STATEMENT,
	EXPR,
	EOF,

	// header
	H_TITLE,
	H_CR,

	// statements
	S_MACRO_DEF,
	S_SET_DEF,
	S_MOVEMENT,
	S_TAGGED_M,
	S_GL_SETTING,

	// collections
	C_ARGS,
	C_SEM_GROUP,
	C_SET,
	C_EXPR_GROUP,

	// Expressions
	E_MACRO_APL,
	E_MACRO_INL,
	E_NOTE,
	E_SETTING,

	// Error states
	ERR,
}


parse_stack :[dynamic]Parse_state



Tk_iter :: struct{
	tokens:[]Token,
	i:int,
}

Tk_next :: proc(iter:^Tk_iter)->Token{
	iter.i= (iter.i + 1) % len(iter.tokens)-1
	return iter.tokens[iter.i-1]
}

Tk_peek :: proc(iter:^Tk_iter)->Token{
	return iter.tokens[(iter.i+1)%len(iter.tokens)-1]
}

parse :: proc(tokens:[]Token)->(ast:Ast){
	ast.statements  = make([dynamic]Statement)
	ast.definitions = make(map[string]Identifier)

	iter := Tk_iter{tokens,0}

	for {
	
	}

	return
}

Ast :: struct {
	statements  : [dynamic]Statement,
	definitions : map[string]Identifier,
}

Identifier :: struct{
	def  : ^Statement,
	type : Ident_type,
}


Ident_type :: enum{
	macro,
	track,
	set,
	def,
	keyword,
	note,
	instrument,
}

print_ast :: proc(ast:^Ast){
	fmt.println("Statements:")
	for statement in ast.statements{
		fmt.println(statement)
	}
	fmt.println()
	fmt.println("Definitions:")
	fmt.printf("%#v",ast.definitions)
}

// @statement
Statement :: union{
	Macro_decl,
	Track,
	Movement,
	Tagged_movement,
	Set_decl,
	Def,
}
// @statement_end

// @expr

Expr :: struct{
	this : Any_expr,
	next : ^Expr,
}
//{
	Any_expr :: union{
		Note,
		Macro,
		Expr_group,
		// NOTE: These exist only at the parsing step, they are unpacked within the ast
		// Sem_group, 
		// repetition,
	}
	//{
		Note :: struct{
			note     : string,
			octave   : u8,
			duration : u64,
			mode	 : Note_mode,
		}
		//{
			Note_mode :: enum{
				neutral,
				hold   ,
				release,
			}
		//}

		Macro :: struct{
			name : string,
			args : Maybe([dynamic]string),
		}

		Expr_group :: struct{
			exprs : [dynamic]Expr,
		}
	//}
//}
// @expr_end

// @track

Track	   :: struct{
	instrumnet : string,
	name	   : string,
	body	   : ^Expr,

}

// @track_end

// @movement

Movement :: struct{
	instrument : string,

}

Tagged_movement :: struct{
	instrument : string,
	tag	   : string,
}
// @movement_end


// @macro
Macro_decl :: struct{
	identifier : string,
	args	   : Maybe([dynamic]string),
	body	   : ^Expr,
}

// @macro_end

// @set
Set_decl   :: struct{}
// @set_end


// @def
Def	   :: struct{}
//@def_end


