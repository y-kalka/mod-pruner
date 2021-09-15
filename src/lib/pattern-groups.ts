interface IPattern {
  pattern: string | string[];
  env?: 'prod' | 'dev';         // Defines in which environment this pattern should only be applied. If not defined its for both environments
  description?: string;
}

interface IPatternGroup {
  id: string;
  patterns: IPattern[];
  description?: string;
  defaultInclude: boolean;
}

export const PATTERN_GROUPS: IPatternGroup[] = [
  {
    id: 'common',
    defaultInclude: true,
    patterns: [
      { pattern: '.bin/', env: 'prod', description: 'In production environments the CLI executables for node packages are normaly not required' },
      { pattern: 'doc?/', env: 'prod' },
      { pattern: 'example?/', env: 'prod' },
      { pattern: 'coverage/' },
      { pattern: '.husky/' },
      { pattern: '.*ignore', description: 'Remove ignore files like .gitignore,.eslintignore,.npmignore' },
      { pattern: '.gitmodules' },
      { pattern: '.gitattributes' },
      { pattern: '.npmrc' },
      { pattern: '.nvmrc' },
      { pattern: '.editorconfig' },
      { pattern: 'tsconfig*.json', description: 'The typescript config file can safely remove from all modules' },
      { pattern: 'tslint.json' },
      { pattern: '.eslintrc*' },
      { pattern: ['.prettierrc*', 'prettier.config.js'] },
      { pattern: '.stylelintrc*' },
      { pattern: '*.log' },
      { pattern: '*.bak' },
      { pattern: '*.patch', description: 'Git patch files' },
      { pattern: '.browserslistrc' },
      { pattern: 'yarn.lock' },
      { pattern: 'package-lock.json' },
      { pattern: '*.map' },
      { pattern: 'Makefile*', env: 'prod', description: 'Remove all makefiles in production environments' },
      { pattern: '*.sh', env: 'prod' },
      { pattern: '.mergify.yml' },
      { pattern: 'Gruntfile.js' },
      { pattern: 'gulpfile*.js' },
      { pattern: 'bower.json' },
      { pattern: '.runkit_example.js' },
      { pattern: '*.flow', env: 'prod' },
      { pattern: '.coveralls.yml' },
      { pattern: '.flowconfig' },
      { pattern: '.commitlintrc.json' },
      { pattern: 'rollup.config.*' },
      { pattern: 'nodemon.json' },
      { pattern: 'lerna.json' },
      { pattern: '.tern-project' },
      { pattern: '.istanbul.yml' },
      { pattern: ['renovate.json?', '.renovaterc*'] },
      { pattern: ['babel.config.*', '.babelrc*'] },
      { pattern: '*.pdf' },
      { pattern: '*.zip' },
      { pattern: '*.gz' },
    ],
  },
  {
    id: 'no-images',
    defaultInclude: true,
    patterns: [
      { pattern: '*.heic' },
      { pattern: '*.webp' },
      { pattern: '*.png' },
      { pattern: '*.jp?g' },
      { pattern: '*.gif' },
    ],
  },
  {
    id: 'no-test-files',
    defaultInclude: true,
    patterns: [
      { pattern: 'test?/' },
      { pattern: '__tests__/' },
      { pattern: '*.spec.*' },
      { pattern: 'jest.config.js' },
      { pattern: 'karma.conf.js' },
    ],
  },
  {
    id: 'no-fonts',
    defaultInclude: true,
    description: 'Font files in the node_modules folder should not be required for production apps',
    patterns: [
      { pattern: '*.woff', env: 'prod' },
      { pattern: '*.woff2', env: 'prod' },
      { pattern: '*.ttf', env: 'prod' },
      { pattern: '*.otf', env: 'prod' },
    ],
  },
  {
    id: 'no-typescript',
    defaultInclude: true,
    patterns: [
      { pattern: '@types/', env: 'prod', description: 'The "node_modules/@types/..." directory is not required for non typescript projects' },
      { pattern: '*.ts', env: 'prod', description: 'Remove all .ts files including *.spec.ts, *.d.ts' },
    ],
  },
  {
    id: 'no-project-meta-files',
    defaultInclude: true,
    patterns: [
      { pattern: ['README', 'README.md'], env: 'prod' },
      { pattern: ['AUTHORS', 'AUTHORS.md'] },
      { pattern: ['NOTICE', 'NOTICE.md'] },
      { pattern: ['CHANGE*', 'CHANGE*.md'], description: 'Remove CHANGELOG and CHANGES files' },
      { pattern: ['CONTRIBUTING', 'CONTRIBUTING.md'] },
      { pattern: ['HISTORY', 'HISTORY.md'] },
      { pattern: ['CODE_OF_CONDUCT', 'CODE_OF_CONDUCT.md'] },
      { pattern: ['SECURITY', 'SECURITY.md'] },
    ],
  },
  {
    id: 'no-ci-files',
    defaultInclude: true,
    patterns: [
      { pattern: '.circleci/' },
      { pattern: '.github/' },
      { pattern: '.travis.yml' },
      { pattern: '.gitlab-ci.yml' },
      { pattern: 'appveyor.yml' },
      { pattern: '*.bazel' },
      { pattern: 'circle.yml' },
      { pattern: '.zuul.yml' },
      { pattern: 'wercker.yml' },
    ],
  },
  {
    id: 'no-license-files',
    defaultInclude: false,
    patterns: [
      { pattern: 'LICENSE*', env: 'prod', description: 'Remove the license file from production app modules' },
    ],
  }
];
