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
        field("declaration", $.interface_declaration),
        repeat(seq($._eventually_eol, choice($.typedef, $.error, $.method))),
        repeat($._)
      ),

    _: ($) => choice($._hspace, $.comment, $.eol),
    _eventually_eol: ($) =>
      seq(repeat(choice($._hspace, $.comment)), $.eol, repeat($._)),

    _hspace: (_) => /[ \t]+/,
    comment: (_) => /#[^\n]*/,
    eol: (_) => /\n/,

    keyword_interface: (_) => "interface",
    interface_declaration: ($) =>
      seq(
        field("keyword", $.keyword_interface),
        repeat1($._),
        field("name", $.interface_name)
      ),

    keyword_type: (_) => "type",
    typedef: ($) =>
      seq(
        field("keyword", $.keyword_type),
        repeat1($._),
        field("name", $.name),
        repeat($._),
        field("value", choice($.struct, $.enum))
      ),

    keyword_error: (_) => "error",
    error: ($) =>
      seq(
        field("keyword", $.keyword_error),
        repeat1($._),
        field("name", $.name),
        repeat($._),
        field("value", $.struct)
      ),

    keyword_method: (_) => "method",
    arrow: (_) => "->",
    method: ($) =>
      seq(
        field("keyword", $.keyword_method),
        repeat1($._),
        field("name", $.name),
        repeat($._),
        field("input", $.struct),
        repeat($._),
        field("arrow", $.arrow),
        repeat($._),
        field("output", $.struct)
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
        field("value", $.type)
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
    questionmark: (_) => "?",
    maybe: ($) =>
      seq(field("questionmark", $.questionmark), field("just", $.type)),

    _just: ($) =>
      choice(
        $.struct,
        $.enum,
        $.array,
        $.dict,
        $.bool,
        $.int,
        $.float,
        $.string,
        $.object,
        $.typeref
      ),

    array: ($) => seq("[", "]", field("type", $.type)),
    dict: ($) => seq("[", $.string, "]", field("type", $.type)),

    bool: (_) => "bool",
    int: (_) => "int",
    float: (_) => "float",
    string: (_) => "string",
    object: (_) => "object",

    typeref: ($) => $.name,

    // letters + numbers,
    //  starting with a capital letter
    name: (_) => /[A-Z][a-zA-Z0-9]*/,

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
