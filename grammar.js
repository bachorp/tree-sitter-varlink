/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// @ts-ignore
const seq_or_single = (c) => (c.length === 1 ? c[0] : seq(...c));

// @ts-ignore
const seq_0i = (name, f) => {
  const obj = {};
  // @ts-ignore
  obj[name] = ($) => seq_or_single(f($));
  // @ts-ignore
  obj[name + "_i"] = ($) => {
    const [head, ...tail] = f($);
    return seq_or_single([token.immediate(head), ...tail]);
  };
  return obj;
};

module.exports = grammar({
  name: "varlink",
  extras: ($) => [/[ \t\n]/, /\r\n/, $.comment],
  rules: {
    interface: ($) =>
      seq(
        field("declaration", $.interface_decl),
        $.eol,
        repeat(seq(choice($.typedef, $.error, $.method), $.eol))
      ),
    eol: (_) => token(choice("\n", "\r\n")),
    interface_decl: ($) =>
      seq("interface", $._separator, field("name", $.interface_name)),
    typedef: ($) =>
      seq(
        "type",
        $._separator,
        field("name", $.name),
        field("value", choice($.struct, $.enum))
      ),
    error: ($) =>
      seq(
        "error",
        $._separator,
        field("name", $.name),
        field("value", $.struct)
      ),
    method: ($) =>
      seq(
        "method",
        $._separator,
        field("name", $.name),
        field("arg_type", $.struct),
        "->",
        field("return_type", $.struct)
      ),

    // @ts-ignore
    ...seq_0i("struct", ($) => [
      "(",
      optional(
        seq(
          field("member", $.struct_field),
          repeat(seq(",", field("member", $.struct_field)))
        )
      ),
      ")",
    ]),
    struct_field: ($) =>
      seq(field("name", $.field_name), ":", field("value_type", $.type)),

    // @ts-ignore
    ...seq_0i("enum", ($) => [
      "(",
      seq(
        field("member", $.field_name),
        repeat(seq(",", field("member", $.field_name)))
      ),
      ")",
    ]),

    type: ($) => choice($.maybe, $._just),
    type_i: ($) => choice(alias($.maybe_i, $.maybe), $._just_i),

    // @ts-ignore
    ...seq_0i("maybe", ($) => ["?", field("just", alias($._just_i, $.type))]),

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
    _just_i: ($) =>
      choice(
        alias($.name_i, $.name),
        token.immediate("bool"),
        token.immediate("int"),
        token.immediate("float"),
        token.immediate("string"),
        token.immediate("object"),
        alias($.struct_i, $.struct),
        alias($.enum_i, $.enum),
        alias($.array_i, $.array),
        alias($.dict_i, $.dict)
      ),

    // @ts-ignore
    ...seq_0i("dict", ($) => [
      "[",
      token.immediate("string"),
      token.immediate("]"),
      field("value_type", alias($.type_i, $.type)),
    ]),

    // @ts-ignore
    ...seq_0i("array", ($) => [
      "[",
      token.immediate("]"),
      field("member_type", alias($.type_i, $.type)),
    ]),

    // @ts-ignore
    ...seq_0i("name", (_) => [/[A-Z][a-zA-Z0-9]*/]),
    field_name: (_) => /[a-zA-Z]([a-zA-Z0-9_]*[a-zA-Z0-9])?/,
    interface_name: (_) =>
      /[a-zA-Z]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+/,

    comment: (_) => /#[^\r\n]*/,
    // Cannot use `word`: https://github.com/tree-sitter/tree-sitter/issues/5021
    // Have to avoid patterns: https://github.com/tree-sitter/tree-sitter/issues/4996
    _separator: (_) => token(choice(" ", "\t", "\n", "\r\n")),
  },
});
