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

	// Literals | NOTE: not needed, already part of the tokens
	//L_NOTE,
	//L_INT,
	//L_STRING,

	// Error states
	ERR,
}


parse_stack :[dynamic]Parse_state


//pop :: proc(stack:^[dynamic]$T)->T{
//	if state,ok:=pop_safe(stack); ok{
//		return state
//	}
//	return cast(T)0
//}



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

	loop: for  {
		switch pop(&parse_stack){
		case .NONE         : parse_none(&iter,&ast)
		// general
		case .STATEMENT    : parse_statement(&iter,&ast)
		case .EXPR         : parse_expr(&iter,&ast)

		// header
		case .H_TITLE      : parse_title(&iter,&ast)
		case .H_CR         : parse_copyright(&iter,&ast)

		// statements
		case .S_MACRO_DEF  : parse_macro_def(&iter,&ast)
		case .S_SET_DEF    : parse_set_def(&iter,&ast)
		case .S_MOVEMENT   : parse_movement(&iter,&ast)
		case .S_TAGGED_M   : parse_tagged_m(&iter,&ast)
		case .S_GL_SETTING : parse_gl_setting(&iter,&ast)

		// collections
		case .C_ARGS       : parse_args(&iter,&ast)
		case .C_SEM_GROUP  : parse_sem_group(&iter,&ast)
		case .C_SET        : parse_set(&iter,&ast)
		case .C_EXPR_GROUP : parse_expr_group(&iter,&ast)

		// Expressions
		case .E_MACRO_APL  : parse_macro_apl(&iter,&ast)
		case .E_MACRO_INL  : parse_macro_inl(&iter,&ast)
		case .E_NOTE       : parse_note(&iter,&ast)
		case .E_SETTING    : parse_setting(&iter,&ast)

		// Error states
		case .ERR	   : parse_err(&iter,&ast)

		case .EOF          : break loop
		}
	}

	return
}

parse_none :: proc(iter: ^Tk_iter, ast: ^Ast){
	switch Tk_next(iter){

	}
}

parse_title :: proc(iter: ^Tk_iter, ast: ^Ast){}
parse_copyright :: proc(iter: ^Tk_iter, ast: ^Ast){}
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
	Macro_def,
Track,
Movement,
Tagged_movement,
Set_def,
Setting,
}

parse_statement :: proc(iter: ^Tk_iter, ast: ^Ast){}
// @statement_end

// @expr

Expr :: struct{
	this : Any_expr,
	next : ^Expr,
}

parse_expr :: proc(iter: ^Tk_iter, ast: ^Ast){}
Any_expr :: union{
	Note,
	Macro,
	Expr_group,
	Setting,
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
parse_note :: proc(iter: ^Tk_iter, ast: ^Ast){}


	Macro :: struct{
		name : string,
		args : Maybe([dynamic]string),
	}
parse_macro_apl :: proc(iter: ^Tk_iter, ast: ^Ast){}
parse_macro_inl :: proc(iter: ^Tk_iter, ast: ^Ast){}

	Expr_group :: struct{
		exprs : [dynamic]Expr,
	}
parse_expr_group :: proc(iter: ^Tk_iter, ast: ^Ast){}

	Setting :: union{Octave,}
	//{
		Octave :: struct{
			dir: enum{asc,desc},
			val: ^Literal,
		}

	//}

	parse_setting :: proc(iter: ^Tk_iter, ast: ^Ast){}
	
//}
// @expr_end

// @track

Track	   :: struct{
	instrumnet : string,
	name	   : string,
	body	   : ^Expr,

}

parse_track :: proc(iter: ^Tk_iter, ast: ^Ast){}

// @track_end

// @movement

Movement :: struct{
	instrument : string,

}

parse_movement :: proc(iter: ^Tk_iter, ast: ^Ast){}

Tagged_movement :: struct{
	instrument : string,
	tag	   : string,
}

parse_tagged_m :: proc(iter: ^Tk_iter, ast: ^Ast){}

// @movement_end


// @macro
Macro_def :: struct{
	identifier : string,
	args	   : Maybe([dynamic]string),
	body	   : [dynamic]^Expr,
}
parse_macro_def :: proc(iter: ^Tk_iter, ast: ^Ast){}

// @macro_end

// @set
Set_def   :: struct{
	identifier : string,
	items	   : Set
}
parse_set_def :: proc(iter: ^Tk_iter, ast: ^Ast){}

//{
	Set :: map[^Identifier]struct{}
parse_set :: proc(iter: ^Tk_iter, ast: ^Ast){}
//}
// @set_end


// @def
Gl_setting   :: struct{}
parse_gl_setting :: proc(iter: ^Tk_iter, ast: ^Ast){}
//@def_end

// @Groups

Cap_group :: struct{

}

parse_args :: proc(iter: ^Tk_iter, ast: ^Ast){}

Sem_group :: struct{}

parse_sem_group :: proc(iter: ^Tk_iter, ast: ^Ast){}

// @Literals

Literal :: union{}


parse_err :: proc(iter: ^Tk_iter, ast: ^Ast){}
