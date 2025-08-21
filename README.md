# tree-sitter-ltn

A toy tree-sitter for a JSON alternative based on Lua tables.

This is a finished project as far as highlighting is concerned. Considering how some people might want to know how to get highlighting for LTN in Vim/Neovim, let me provide some snippets.

## Adding the queries to Neovim

First, determine where your nvim-treesitter plugin folder is. It is usually somewhere inside ~/.local/share/nvim if using Linux/WSL. We'll use <ts-path> as a placeholder for where your nvim-treesitter plugin folder is, and <ts-ltn-path> for wherever you have the tree-sitter-ltn git clone in.

```bash
cd <ts-path>
mkdir queries/ltn && cd queries/ltn
ln -s <ts-ltn-path>/queries/*.scm .
```

## Add the ltn filetype to Vim

### Lua
```lua
-- insert this in your config after all plugins have been loaded.

vim.filetype.add {
  extension = {
    ltn = 'ltn',
  },
}
```

### Vimscript
```vim
autocmd BufRead, BufNewFile *.ltn set filetype=ltn
```

## Add to nvim-treesitter configs
```lua
config = function()
  local parser_config = require 'nvim-treesitter.parsers'.get_parser_configs()
  parser_config.ltn = {
    install_info = {
      path = '<ts-ltn-path>',
      files = { 'src/parser.c' },
    },
    filetype = 'ltn',
  }
end
```
