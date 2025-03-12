# Basics.

## Writing notes

Notes are denoted by lowercase italian notation(do,re, mi ...).

You can also specify the duration of the note by adding "-" and how many qorters long
it is. You can also specify it in miliseconds by appending ms to the number.

Accidentals are denoted by "b" for flat ad "s" for sharp and "n" for natural respecitvy respecitvly.

To show the octave of the note use "^"fallowed by a number from 1 to 8.

the syntax for a note is : ```<note>[-<duration>][^<octave>][b or s or n]``` with everything within [] being optional.

Sometimes notes need to be held for longer than it's allowed within the time signature. For this, a note can be 
held by prefixing it with "(".

For example: ```(do re mi fa sol la si do)```, in this code snippet, the note do will be held until "do)", where
it's released.


## Bars

Between notes, you can put bars in order to ensure that the time signature is preserved.
```
// correct sequence

piano : do re mi fa | sol la si do |

// will raise an error

piano : do re mi fa sol | la si do |

```
Bars are evaluated from the last note (from the left of the bar)

## Tracks
To write a track you must use an instrument. For example:
```
piano : do mi la si
```
By default the time signature is 4/4 and 4th octave is used. 

/* I don't like this, probably needs reworking
/    
/    piano : | 4, 4/4 ,   : 
/        do mi la si 
/    :|
/    
/
/    "|: :|" defines a composition. Between 1st '|' and ':' you can specify the time signature, octave and key
/ signatures. All of them are optional and have default values:
/    default time sig. = 4/4
/    default octave = 4
/    default key signatures = do major
/
/    Note: key signatures are defined by writing the notes coresponding to the key signature.
*/


## Multi-line sequences

So far, you can only write a track on a single line. In order to allow tracks to span multiple lines, you use [].


## Macros

A macro is a collection of expressions. 

A basic macro is defined as fallows :
```
my_macro = do re mi fa sol la si
```

To use this macro, simply write it's name where you would be able to write any expresion:
```
piano : do mi la si my_macro
```
Macros can also accept arguments. Arguments are to be used within the body of the expresion of the macro itself 
and can be take any expresion unless restricted.

```
my_macro2 with(first,last) = first re mi fa | sol la si last |
```

If you pass to first or last values that would violate the bar placement, you would get an error/warning.

```
my_macro_restricted with(first/note4, last/note4) = first re mi fa | sol la si last |
```

"/note-4" restricts the arguments to being part of this set, that is notes of length 4. This way, the macro is 
ensured to not be missued.





