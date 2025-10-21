(comment) @comment.line.number-sign.varlink

"interface" @keyword.control.interface.varlink
"type" @keyword.other.typedef.varlink
"method" @keyword.other.method.varlink
"error" @keyword.other.error.varlink

(interface_name) @string.unquoted.interface.varlink
(method name: (name) @entity.name.function.varlink)
(error name: (name) @entity.name.error-type.varlink)
(typedef name: (name) @entity.name.type.varlink)
(type (name) @entity.name.type.varlink)
(struct_field name: (_) @entity.other.attribute-name.varlink)
(enum member: (_) @string.unquoted.enum-member.varlink)

[
    "bool" 
    "int"
    "float"
    "string"
    "object"
] @support.type.primitive.varlink

[
    "("
    ")"
] @punctuation.brackets.round.varlink

[
    "["
    "]"
] @punctuation.brackets.square.varlink

"," @punctuation.separator.comma.varlink
"?" @keyword.operator.nullable.varlink
":" @keyword.operator.key-value.varlink
"->" @storage.type.function.arrow.varlink
