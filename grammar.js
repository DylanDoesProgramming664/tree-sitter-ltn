/**
 * @file A JSON, YAML and TOML alternative based on Lua Tables.
 * @author DylanDoesProgramming664 <dylan20xx@outlook.com>
 * @license BSD2
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
	COMMA: -1,
	DEFAULT: 1,
	PRIORITY: 2,

	STATEMENT: 3,
	SOURCE: 4,
};

module.exports = grammar({
  name: "ltn",

  extras: $ => [
    /\s/,
    $.comment,
  ],

  supertypes: $ => [
    $._value,
  ],

  inline: $ => [
    $.comment
  ],

  rules: {
    source_file: $ => prec(
      PREC.SOURCE,
      repeat($.statement),
    ),
    
    statement: $ => seq(
      optional(
        seq(
          $.identifier,
          /=/,
        ),
      ),
      $._value,
      /,/,
    ),

    _value: $ => choice(
      $.boolean,
      $.number,
      $.string,
      $.table,
    ),

    boolean: $ => choice('true', 'false'),

    number: $ => {
			const decimal_digits = /[0-9]+/;
			const signed_integer = seq(optional(choice("-", "+")), decimal_digits);
			const decimal_exponent_part = seq(choice("e", "E"), signed_integer);

			const decimal_integer_literal = choice(
				"0",
				seq(optional("0"), /[1-9]/, optional(decimal_digits))
			);

			const hex_digits = /[a-fA-F0-9]+/;
			const hex_exponent_part = seq(choice("p", "P"), signed_integer);

			const decimal_literal = choice(
				seq(
					decimal_integer_literal,
					".",
					optional(decimal_digits),
					optional(decimal_exponent_part)
				),
				seq(".", decimal_digits, optional(decimal_exponent_part)),
				seq(decimal_integer_literal, optional(decimal_exponent_part))
			);

			const hex_literal = seq(
				choice("0x", "0X"),
				hex_digits,
				optional(seq(".", hex_digits)),
				optional(hex_exponent_part)
			);

			return token(choice(decimal_literal, hex_literal));
		},

    string: $ => seq('"', optional($._string_content), '"'),

    _string_content: $ => repeat1(choice(
      $.string_content,
      $.escape_sequence,
    )),

    string_content: $ => token.immediate(prec(1, /[^\\"\n]+/)),

    escape_sequence: $ => token.immediate(seq(
      '\\',
      /(b|f|n|r|t|\\|\"|\'|\[|\])/,
    )),

    table: $ => seq(
      '{',
      optional(choice(
        $._array_table,
        $._obj_table,
      )),
      '}',
    ),

    _array_table: $ => seq(
      commaSep($._value),
    ),

    _obj_table: $ => seq(
      commaSep($.pair),
    ),

    pair: $ => seq(
      field('key', $.identifier),
      '=',
      field('value', $._value),
    ),

    identifier: $ => token(prec(PREC.PRIORITY, /[a-zA-Z][a-zA-Z_0-9]+/)),

    comment: $ => seq(
      field("start", alias("--", "comment_start")),
      field("content", alias(/[^\r\n]*/, "comment_content")),
    ),
  }
});

function commaSep(rule) {
  return seq(rule, repeat(seq(',', rule)), optional(','))
}
