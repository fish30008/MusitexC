package parser

import "core:fmt"
import str"core:strings"


Ast :: struct {
	statements  : [dynamic]Statement,
	identifiers : map[string]Identifier,
	tagged_mov  : map[string]^Statement,
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
	fmt.println("Identifiers:")
	fmt.printf("%#v",ast.identifiers)
}

// @statement
Statement :: union{
	Macro_decl,
	Track,
	Movement,
	Tagged_Movement,
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


