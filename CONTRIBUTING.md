# Contributing

## Development

### Getting started

1. Ensure you have a recent version of Node.js installed. Using [nvm](https://github.com/nvm-sh/nvm) makes this easy.

### Making changes

1. Install dependencies with `npm install` if you're starting from scratch or if the `package-lock.json` file has changed since the last time it was run.
2. As you make changes run `npm test` to run the unit tests against your changes.
3. Use `npm run format` to automatically format your code according to the project's style guide with Prettier. It is also highly recommended to set up your editor to automatically format files on save. Most editors have Prettier plugins available to do this.
4. Use `npm run build` to build the project.

### Publishing releases

1. Use `npm version` to increment the version number followed by `git push && git push --tags` to push the version change to GitHub.
2. Create a new GitHub [release](https://github.com/geneontology/wc-gocam-viz/releases) using the new version tag. Once the new release is created, a GitHub Action will automatically publish it to NPM.
