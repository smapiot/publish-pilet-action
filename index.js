const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const piral = require('piral-cli');
const path = require('path');
const fs = require('fs');

const fullUrl = /^https?:\/\//i;
const defaultFeed = 'https://feed.piral.io/api/v1/pilet';

async function runAction() {
  const workspace = process.env.RUNNER_WORKSPACE;
  const [_, repoName] = process.env.GITHUB_REPOSITORY.split('/');

  console.log(`Currently in working directory: ${process.cwd()}`);
  console.log(`Triggered action: ${github.context.action}`);

  try {
    const feed = core.getInput('feed');
    const apiKey = core.getInput('api-key');
    const baseDir = core.getInput('base-dir') || '.';
    const cwd = path.resolve(workspace, repoName, baseDir);
    const url = fullUrl.test(feed) ? feed : `${defaultFeed}/${feed}`;
    const packageJson = path.resolve(cwd, 'package.json');
    const { version } = require(packageJson);

    if (!fs.existsSync(path.resolve(cwd, 'node_modules'))) {
      console.warn('Did not find a `node_modules` directory. Trying to resolve dependencies first.');
      await exec.exec('npm install', undefined, { cwd });
    }

    await piral.apps.publishPilet(cwd, {
      fresh: true,
      apiKey,
      url,
    });

    core.setOutput('version', version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

runAction();
