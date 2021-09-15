export const CONFIG_FILENAME = `.modprunerrc`;

export const DEFAULT_GLOBS = `
__tests__/
.airtap.yml
.babelrc
.circleci/
.clang-format
.commitlintrc.json
.coveralls.yml
.documentup.json
.editorconfig
.eslintignore
.eslintrc
.eslintrc.js
.eslintrc.json
.eslintrc.yaml
.eslintrc.yml
.flowconfig
.gitattributes
.github/
.gitignore
.gitmodules
.husky/
.istanbul.yml
.jscs.json
.jscsrc
.jshintrc
.npmignore
.npmrc
.nvmrc
.nyc_output
.nycrc
.prettierrc
.prettierrc.js
.prettierrc.yaml
.release-it.json
.releaserc.json
.runkit_example.js
.stylelintrc.json
.tern-project
.travis.yml
.zuul.yml
*.png
*.jp?g
*.gif
*.bak
*.iml
*.log
*.txt
*.patch
appveyor.yml
AUTHORS
NOTICE
.mergify.yml
*.bazel
babel.config.js
ChangeLog
CHANGELOG.md
CHANGES
circle.yml
CONTRIBUTING.md
coverage/
doc/
docs/
example/
examples/
Gruntfile.js
gulpfile*.js
HISTORY.md
jest.config.js
karma.conf.js
lerna.json
nodemon.json
package-lock.json
prettier.config.js
README.md
renovate.json
rollup.config.js
test/
tests/
tsconfig*.json
tslint.json
wercker.yml
yarn.lock
CODE_OF_CONDUCT.md
AUTHORS.md
SECURITY.md
.browserslistrc


# Relatively safe
*.flow
*.mjs.map
*.js.map
*.ts.map
*.ts
*.spec.ts
*.spec.js
bower.json
Makefile*
*.sh


# Unsafe
*.md
*.mkd
*.markdown


!build-long.md  # This file is used by @angular/cli
!*.d.ts         # Always keep .ts definition files

`;
