/**
 * @file A JSON, YAML and TOML alternative based on Lua Tables.
 * @author DylanDoesProgramming664 <dylan20xx@outlook.com>
 * @license BSD2
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "ltn",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source: ($) => choice($._value),

    _value: ($) =>
      choice($.map_table, $.array_table, $.string, $.number, $.boolean, $.nil),

    map_table: ($) => seq("{", commaSep($.pair), "}"),

    pair: ($) => seq(field("key", $.identifier), "=", $._value),

    identifier: ($) => /[a-zA-Z][a-zA-Z_0-9]+/,

    array_table: ($) => seq("{", optional(commaSep($._value)), "}"),

    string: ($) =>
      seq('"', repeat(choice($._string_char, $.escape_sequence)), '"'),

    _string_char: ($) => token.immediate(/[^\\\n"]/),

    escape_sequence: ($) => token.immediate(seq("\\", /(\"|\\|\/|b|f|n|r|t)/)),

    number: ($) => choice($.integer, $.double),

    integer: ($) => choice($._decimal_integer, $._hexadecimal_integer),

    _decimal_integer: ($) => token(/(-)?\d+/),

    _hexadecimal_integer: ($) => token(/(0x)(\d|[a-fA-F])+/),

    double: ($) =>
      choice(token(/\d+((\.\d+)|([Ee]\d+))/), token(/\d+\.\d+[Ee]\d+/)),

    boolean: ($) => choice("true", "false"),

    nil: ($) => "nil",

    comment: ($) => seq("--", /[^\n]*/),
  },
});

function commaSep(rule) {
  return seq(rule, repeat(seq(",", rule)), optional(","));
}
