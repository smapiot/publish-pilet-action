const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const path = require('path');
const fs = require('fs');

const fullUrl = /^https?:\/\//i;
const defaultFeed = 'https://feed.piral.cloud/api/v1/pilet';

async function runAction() {
  const workspace = process.env.GITHUB_WORKSPACE;

  console.log(`Triggered action: ${github.context.action}`);

  try {
    const feed = core.getInput('feed');
    const apiKey = core.getInput('api-key');
    const baseDir = core.getInput('base-dir') || '.';
    const bundler = core.getInput('bundler') || 'webpack5';
    const cwd = path.resolve(workspace, baseDir);
    const url = fullUrl.test(feed) ? feed : `${defaultFeed}/${feed}`;
    const packageJsonPath = path.resolve(cwd, 'package.json');
    const piralCliPath = path.resolve(cwd, 'node_modules', 'piral-cli');
    const { version } = require(packageJsonPath);

    if (!fs.existsSync(path.resolve(cwd, 'node_modules'))) {
      console.warn('Did not find a `node_modules` directory. Trying to resolve dependencies first ...');
      await exec.exec('npm install', undefined, { cwd });
    }

    if (!fs.existsSync(piralCliPath)) {
      console.warn('Did not find a local `piral-cli` instance. Installing latest ...');
      await exec.exec(`npm install piral-cli piral-cli-${bundler} --no-save`, undefined, { cwd });
    }

    const piralCli = require(piralCliPath);

    await piralCli.apps.publishPilet(cwd, {
      fresh: true,
      apiKey,
      url,
    });

    core.setOutput('version', version);
    return process.exit(0);
  } catch (error) {
    core.setFailed(error.message);
    return process.exit(1);
  }
}

runAction();
