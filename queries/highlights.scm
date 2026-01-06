(comment) @comment.line.number-sign.varlink

(keyword_interface) @keyword.control.interface.varlink
(keyword_type) @keyword.other.typedef.varlink
(keyword_method) @keyword.other.method.varlink
(keyword_error) @keyword.other.error.varlink

(interface_name) @string.unquoted.interface.varlink
(method name: (name) @entity.name.function.varlink)
(error name: (name) @entity.name.error-type.varlink)
(typedef name: (name) @entity.name.type.varlink)
(typeref (name) @entity.name.type.varlink)
(struct_field name: (_) @entity.other.attribute-name.varlink)
(enum member: (_) @string.unquoted.enum-member.varlink)

[
    (bool)
    (int)
    (float)
    (string)
    (object)
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
(questionmark) @keyword.operator.nullable.varlink
":" @keyword.operator.key-value.varlink
(arrow) @storage.type.function.arrow.varlink
