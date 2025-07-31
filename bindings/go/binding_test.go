package tree_sitter_ltn_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_ltn "github.com/dylandoesprogramming664/tree-sitter-ltn/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_ltn.Language())
	if language == nil {
		t.Errorf("Error loading Lua Table Notation grammar")
	}
}
