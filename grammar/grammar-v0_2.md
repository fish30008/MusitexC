## Program level
```
<program>    --->    [<program header>] '---' <code section>

<code section>    --->    <macro definition> [<code section>]
                    |       <track> [<code section>]

<prog. header>    --->    <header section>*

<header section>    --->   <title> <global define>

```

## Header section
```
<global define>    --->    tempo ':' <int_literal>
                    |       (time_signature | time_sig) ':' <int_literal>'/'<int_literal>
                    |       title ':' <string_literal>
                    |       key ':' <key_signature>
                    |       // to be added
<title> ---> title ':' <string_literal>
```

## Code section
```
<macro def.>    --->    <identifier> '=' <expr>*
                    |       <identifier> (<argument definition>+) '=' <expr>*

<track>    --->    '|' [<octave> ',' ] [ <int_literal>'/'<int_literal> ] [ ',' <major/minor notes>] ':' <notes> ':|'

```

## Components
```
<octave>    --->    <int_literal>
<key_signature>    --->    4
                    |       5
                    |       6
                    |       7
                    |       // TODO add more key signatures

<major/minor notes>    --->    do
                        |       re
                        |       mi
                        |       fa
                        |       sol
                        |       la
                        |       si

<notes>    --->    <note_sequence>
            |       <note_sequence> <note_sequence>

<note_sequence>    --->    | <note>+ :|

<note>    --->    <note_name> <octave> [<duration>]

<note_name>    --->    do
                |       re
                |       mi
                |       fa
                |       sol
                |       la
                |       si

<octave>    --->    '4'
            |       '5'
            |       '6'

<duration>    --->    '.'       // optional for dot notation
                |       '_'       // optional for underscore notation

<identifier>    --->    [a-zA-Z][a-zA-Z0-9]*

<int_literal>    --->    [0-9]+

<string_literal> --->    '.*'

<argument definition>    --->    <octave> | <notes>

<expr>    --->    <notes> | <key_signature> | <time_signature> | <tempo>
            |       <macro def.>  // Expressions can include notes, time signatures, tempo, etc.

```
