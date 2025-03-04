< non terminal >

*terminal*

\[ zero of one occurrences ]

(zero or more occurences)*

(comma separated list)+

{grouping}

(the order) / (doesn't matter) /

(?) terminal simbols:  ']', '[', '{', '}', '(', ')', '.'

| alternaives

---
```

<program>       --->    [ <program header> ] 
                        <macro definition>*   /
                        <track>*              /

<prog. header>  --->    <global define>*   /
                        [ <copyright notice>] /

<global define
<macro def.>    --->    <identifier> = <expr>*
                |       <identifier> ( <argument definition>+ ) = <expr>*

<track>         --->    


```
