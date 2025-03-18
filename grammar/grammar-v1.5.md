< non terminal >


\[ zero of one occurrences ]

(zero or more occurences)*

(comma separated list)+

{grouping} = produs_1_from_grouping | produs\_2_from_grouping | ... | last_produs_from_grouping

{group1} - {group1} = {group1 without any elements from group2} 

terminal simbols:   '(', ')', '.', '=', ':', ']', '[', '{', '}', '|'

| alternaives

If there is space between 2 terminals/non_terminals, then there can be any < white space > between those 2.

---

### 1. Program structure 
```
1.         <program>    --->    [<program header>] '---' [<statement>]

2.    <prog. header>    --->    [<title>] [<copyright notice>]

3.       <statement>    --->    (<macro definition> | <track> | <global setting> | <set definition> | <movement>) ("\n" | ";")
```

### 2. Header section 
```
1.     <c.r. notice>    --->    copy_right ':' <string>

2.           <title>    --->    title ':' <string_literal>
```

### Statements
```
        <macro def.>    --->    <identifier> [with <capture group>] '=' <expr>*

             <track>    --->    'track' [<string_literal>] '{' '}'

          <movement>    --->    <instrument> [<string literal>] ':' <expr>*

          <set def.>    --->    <identifier> <set group>

    <global setting>    --->    tempo ':' <int_literal>
                        |       ( measure | m )':'<measure_signature>
                        |       // to be added
```

### Groups
```
                // Note: Used for arguments to macro definitions and macro applications
     <capture group>    --->    '(' <arg>+ ')'

                // Note: used for repetitions and defining a multiline expresion
    <semantic group>    --->    '{' <token> <token>* '}'
                
                // Equivalent to the mathematal notion of a set. Is used to define restrictions on arguments. Set operations can be performed
         <set group>    --->    '{' <token>+ '}'

                // Note: used for multiline expresions
   <expresion group>    --->    '[' <expr> <expr>* ']'


```

### Sybols
```
       <white space>    --->    (" " | "\n" | "\t" )(" " | "\n" | "\t" )*

             <token>    --->    <alpha numeric> | <number> | <delimiter>

             <alpha>    --->    ("a" ... "z" | "A" ... "Z")
           <numeric>    --->    ("0" ... "9")

     <alpha numeric>    --->    <alpha>(<alpha> | <numeric | "_")*
            <number>    --->    <numeric><numeric>*

         <delimiter>    --->    ("{" | "}" | "(" | ")" | "[" | "]" | ":" | "\"" | "," | "|"  | "/" | "=" | "#" | "'" | "." | "-" | "+" | ">" | "<" | "*")

           <keyword>    --->    ("with" | "title" | "copy_right" |"tempo" | "b" | "s" | "r" | "octave" | "m" | "measure")

        <identifier>    --->    {<alpha numeric>} - {<keyword>}
     <escaped_chars>    --->    {<char>} - {'"'} | "\n" | "\r" | "\t" | "\""

        <instrument>    --->    <identifier>

 <measure_signature>    --->    <numeric>'\'<numeric>
```

### Literals
```
      <note literal>    --->    ("do" ... "si") |("A" ... "G" )

       <int_literal>    --->    <numeric>*[ms]

    <string_literal>    --->    '"'<escaped_chars>*'"'
```

### Expressions
```
              <expr>    --->    ['(']<note> ['|']
                        |       <note>[')'] ['|']
                        |       <macro inlining>
                        |       <macro application>
                        |       <expression group>
                        |       <semantic group>
                        |       <expr>'*'<NUMERIC>
                        |       <setting>


    <macro inlining>    --->    <identifier>

 <macro application>    --->    <identifier>'('<expr>+')'

              <note>    --->    <note literal>['-'<int_literal>]['^'<int_literal>]"b"*"s"*
                        |       'r'['-'<int_literal>]
                        |       <note>['/'<note>]

           <setting>    --->    ('<' | '>')[<int_literal>]
``` 

```

           <comment>    --->    '#'<text>'\n'
```
