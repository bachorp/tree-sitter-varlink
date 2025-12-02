/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "varlink",
  // interface_declaration/typedef/error/method must be separated by newlines
  // when a newline is encountered, we don't yet know whether another definition will follow
  conflicts: ($) => [[$._, $._eventually_eol]],
  extras: (_) => [],
  rules: {
    interface: ($) =>
      seq(
        repeat($._),
        field("interface_declaration", $.interface_declaration),
        repeat(seq($._eventually_eol, choice($.typedef, $.error, $.method))),
        repeat($._)
      ),

    _: ($) => choice($._hspace, $.comment, $.eol),
    _eventually_eol: ($) =>
      seq(repeat(choice($._hspace, $.comment)), $.eol, repeat($._)),

    _hspace: (_) => /[ \t]+/,
    comment: (_) => /#[^\n\r]*/,
    eol: (_) => /\n|\r\n/,

    interface_declaration: ($) =>
      seq("interface", repeat1($._), field("name", $.interface_name)),

    typedef: ($) =>
      seq(
        "type",
        repeat1($._),
        field("name", $.name),
        repeat($._),
        field("value", choice($.struct, $.enum))
      ),

    error: ($) =>
      seq(
        "error",
        repeat1($._),
        field("name", $.name),
        repeat($._),
        field("value", $.struct)
      ),

    method: ($) =>
      seq(
        "method",
        repeat1($._),
        field("name", $.name),
        repeat($._),
        field("arg_type", $.struct),
        repeat($._),
        "->",
        repeat($._),
        field("return_type", $.struct)
      ),

    struct: ($) =>
      seq(
        "(",
        repeat($._),
        optional(
          seq(
            field("member", $.struct_field),
            repeat($._),
            repeat(
              seq(
                ",",
                repeat($._),
                field("member", $.struct_field),
                repeat($._)
              )
            )
          )
        ),
        ")"
      ),

    struct_field: ($) =>
      seq(
        field("name", $.field_name),
        repeat($._),
        ":",
        repeat($._),
        field("value_type", $.type)
      ),

    enum: ($) =>
      seq(
        "(",
        repeat($._),
        seq(
          field("member", $.field_name),
          repeat($._),
          repeat(
            seq(",", repeat($._), field("member", $.field_name), repeat($._))
          )
        ),
        ")"
      ),

    type: ($) => choice($.maybe, $._just),
    maybe: ($) => seq("?", field("just", $.type)),

    _just: ($) =>
      choice(
        $.name,
        "bool",
        "int",
        "float",
        "string",
        "object",
        $.struct,
        $.enum,
        $.array,
        $.dict
      ),

    dict: ($) => seq("[", "string", "]", field("value_type", $.type)),
    array: ($) => seq("[", "]", field("member_type", $.type)),

    // letters + numbers,
    //  starting with a capital letter
    name: ($) => /[A-Z][a-zA-Z0-9]*/,

    // letters + numbers + underscores,
    //  starting with a letter,
    //  no consecutive or trailing underscores
    field_name: (_) => /[a-zA-Z](_?[a-zA-Z0-9])*/,

    // at least two dot-separated components of letters + numbers + dashes,
    //  first component starting with a letter,
    //  no initial or trailing dashes
    interface_name: (_) =>
      /[a-zA-Z](-*[a-zA-Z0-9])*(\.[a-zA-Z0-9](-*[a-zA-Z0-9])*)+/,
  },
});
