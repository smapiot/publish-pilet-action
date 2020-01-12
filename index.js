const core = require('@actions/core');
const github = require('@actions/github');
const child_process = require('child_process');
const piral = require('piral-cli');
const path = require('path');
const fs = require('fs');

const fullUrl = /^https?:\/\//i;
const defaultFeed = 'https://feed.piral.io/api/v1/pilet';

async function runAction() {
  const workspace = process.env.GITHUB_WORKSPACE;

  console.log(`Triggered action: ${github.context.action}`);

  try {
    const feed = core.getInput('feed');
    const apiKey = core.getInput('api-key');
    const baseDir = core.getInput('base-dir') || '.';
    const cwd = path.resolve(workspace, baseDir);
    const url = fullUrl.test(feed) ? feed : `${defaultFeed}/${feed}`;
    const packageJson = path.resolve(cwd, 'package.json');
    const { version } = require(packageJson);

    if (!fs.existsSync(path.resolve(cwd, 'node_modules'))) {
      console.log('Did not find a `node_modules` directory. Resolving dependencies first.');
      child_process.execSync('npm install', { cwd });
    }

    console.dir(process.env);
    console.log(fs.readFileSync(packageJson, 'utf8'));
    console.log(core.getInput('api-key'));

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
