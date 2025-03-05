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

                        |       (time_signature | time_sig) ':' <int_literal>


        <macro def.>    --->    <identifier> '=' <expr>*
                        |       <identifier> (<argument definition>+) '=' <expr>*

             <track>    --->


```
