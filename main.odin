package compiler

import "core:fmt"
import "core:os"


import "front_end"

main :: proc(){
	front_end.main()
	fmt.println("Compiler works!")
	fmt.print(os.args)
}
