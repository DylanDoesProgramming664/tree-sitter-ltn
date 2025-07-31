/**
 * @file A JSON, YAML and TOML alternative based on Lua's Tables.
 * @author DylanDoesProgramming664 <dylan20xx@outlook.com>
 * @license BSD 2
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "ltn",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
