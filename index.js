const core = require('@actions/core');
const github = require('@actions/github');
const piral = require('piral-cli');
const path = require('path');

const fullUrl = /^https?:\/\//i;
const defaultFeed = 'https://feed.piral.io/api/v1/pilet';

async function runAction() {
  const workspace = process.env.GITHUB_WORKSPACE;

  console.log(`Triggered action: ${github.context.action}`);

  try {
    const feed = core.getInput('feed');
    const apiKey = core.getInput('api-key');
    const baseDir = core.getInput('base-dir') || '.';
    const source = core.getInput('source');
    const cwd = path.resolve(workspace, baseDir);
    const url = fullUrl.test(feed) ? feed : `${defaultFeed}/${feed}`;
    const { version } = require(path.resolve(cwd, 'package.json'));

    await piral.apps.publishPilet(cwd, {
      fresh: true,
      apiKey,
      source,
      url,
    });

    core.setOutput('version', version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

runAction();
