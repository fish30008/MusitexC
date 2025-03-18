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

### 3. Statements
```
1.      <macro def.>    --->    <identifier> [with <capture group>] '=' <expr>*

2.           <track>    --->    'track' [<string_literal>] '{' '}'

3.        <movement>    --->    <instrument> [<string literal>] ':' <expr>*

4.        <set def.>    --->    <identifier> <set group>

5.  <global setting>    --->    tempo ':' <int_literal>
                        |       ( measure | m )':'<measure_signature>
                        |       // to be added
```

### 4. Groups
```
                // Note: Used for arguments to macro definitions and macro applications
1.   <capture group>    --->    '(' <arg>+ ')'

                // Note: used for repetitions and defining a multiline expresion
2.  <semantic group>    --->    '{' <token> <token>* '}'
                
                // Equivalent to the mathematal notion of a set. Is used to define restrictions on arguments. Set operations can be performed
3.       <set group>    --->    '{' <token>+ '}'

                // Note: used for multiline expresions
4. <expresion group>    --->    '[' <expr> <expr>* ']'


```

### 5. Sybols
```
1.     <white space>    --->    (" " | "\n" | "\t" )(" " | "\n" | "\t" )*

2.           <token>    --->    <alpha numeric> | <number> | <delimiter>

3.           <alpha>    --->    ("a" ... "z" | "A" ... "Z")
4.         <numeric>    --->    ("0" ... "9")

5.   <alpha numeric>    --->    <alpha>(<alpha> | <numeric | "_")*
6.          <number>    --->    <numeric><numeric>*

7.       <delimiter>    --->    ("{" | "}" | "(" | ")" | "[" | "]" | ":" | "\"" | "," | "|"  | "/" | "=" | "#" | "'" | "." | "-" | "+" | ">" | "<" | "*" | ";")

8.         <keyword>    --->    ("with" | "title" | "copy_right" |"tempo" | "b" | "s" | "r" | "octave" | "m" | "measure")

9.      <identifier>    --->    {<alpha numeric>} - {<keyword>}
10.  <escaped_chars>    --->    {<char>} - {'"'} | "\n" | "\r" | "\t" | "\""

11.     <instrument>    --->    <identifier>

12.   <measure_sig.>    --->    <numeric>'\'<numeric>
```

### 6. Literals
```
1.    <note literal>    --->    ("do" ... "si") |("A" ... "G" )

2.     <int_literal>    --->    <numeric>*[ms]

3.  <string_literal>    --->    '"'<escaped_chars>*'"'
```

### 7. Expressions
```
1.            <expr>    --->    ['(']<note> ['|']
                        |       <note>[')'] ['|']
                        |       <macro inlining>
                        |       <macro application>
                        |       <expression group>
                        |       <semantic group>
                        |       <expr>'*'<NUMERIC>
                        |       <setting>


2.  <macro inlining>    --->    <identifier>

3.     <macro appl.>    --->    <identifier>'('<expr>+')'

4.            <note>    --->    <note literal>['-'<int_literal>]['^'<int_literal>]"b"*"s"*
                        |       'r'['-'<int_literal>]
                        |       <note>['/'<note>]

5.         <setting>    --->    ('<' | '>')[<int_literal>]
``` 

```

           <comment>    --->    '#'<text>'\n'
```
