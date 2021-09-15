# mod-pruner
is command line tool to clean up your node_modules from unnessary files.

## Why
I was searching for tool to shrink my node modules folder as much as possible to create the smallest possible docker image for my service. There i found the [modclean](https://www.npmjs.com/package/modclean) package which seems to be good fit but the project seems to be abandoned since a long time and the v3 has a nasty bug where you can't ignore files. Also I missed a feature where you can define rules like a `.gitignore` file to customize to cleanup process. So here we are.

## Installation
```bash
# save into your current project
npm install --save-dev mod-pruner

# or as a global package
npm install -g mod-pruner

# or run it directly with npx
npx mod-pruner ...
```

## Getting started

```bash
# Create the config file
npx mod-pruner init

# Cleanup all your node_modules folder under your current working directory
npx mod-pruner --force
```
## Rules
Rules are working the same as you known it from .gitignore,.eslintignore and so on. You can define filenames, pattern and also invert rules with the `!` prefix.
```ini
README.md
!lodash/README.md  # If you want to keep the lodash readme but delete all other readme files
```

## Commands
### prune
```bash
mod-pruner prune --force --stats
```
* "--force" removes the files from disk
* "-s,--stats" show stats of the operation
* "-c,--config" path to the .mc-patterns file
* "-v,--verbose" display a list of deleted files
### init
```bash
mod-pruner init
```
* "--force" overwrite a existing config file
