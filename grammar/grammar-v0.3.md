<variable decl.>    --->    'const' <identifier> '=' <value>
                        |       'int' <identifier> '=' <value> // we can change tempo, velocity, or even instrument. 
We can make const our variables by default, and only if the guy would like to change the variable she must emphasize int to the variable, 
or we can change from 'int' variable to 'dynaminc' variable

             <value>    --->    <int_literal>
                        |       <identifier>    

        <assignment>    --->    <identifier> '=' <value>
                        |       <identifier> '=' <expr>

  <boolean_expression>  --->    <value> ('==' | '!=' | '>' | '<' )<value>
                        |       <boolean_expression> 'and' <boolean_expression>
                        |       <boolean_expression> 'or' <boolean_expression>
                        |       '(' <boolean_expression> ')'
       <arithmetic_expr>  --->      <arithmetic_expr> '+' <value>
                         |      <arithmetic_expr> '-' <value>

 <for_loop>       --->    'for' <identifier> 'in' <track> | <set group> | <semantic group>  then  <expr> // we can go throught track or group of notes/tokens to split the track or create new one                                                                             
<if_statement>   --->    'if' <boolean_expression>  then <expr> | 'if' <boolean_expression>  then <expr> else <if_statement> <expr> | else <expr>
