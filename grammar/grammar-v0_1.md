< non terminal >

*terminal*

\[ zero of one occurrences ]

(zero or more occurences)*

(comma separated list)+

{grouping}

terminal simbols:   '(', ')', '.', '=', ':', ']', '[', '{', '}', '|', '---'

| alternaives

---

## Program level
```
           <program>    --->    [<program header>] '---' <code section>


      <code section>    --->    <macro definition> [<code section>]

                        |       <track> [<code section>]

      <prog. header>    --->    <header section>*

    <header section>    --->    <global define>
                        |       <copyright notice>
                        |       <title>
```
## Header section
```
       <c.r. notice>    --->    //TODO
```
## Code section
```
     <global define>    --->    tempo ':' <int_literal>
                        |       (time_signature | time_sig) ':' <int_literal>'/'<int_literal>
                        |       title ':' <string_literal>
                        |       key ':' <key_signature>
                        |       // to be added

        <macro def.>    --->    <identifier> '=' <expr>*
                        |       <identifier> (<argument definition>+) '=' <expr>*

             <track>    --->    '|' [<octave> ',' ] [ <int_literal>'/'<int_literal> ] [ ',' <major/minor notes>] ':' <notes> ':|' 

```
