# Publish Pilet Action

This GitHub action publishes a pilet to a provided feed.

With this action you will usually not need to build (as in `npm run build`) anything.

If you did not install the NPM dependencies (e.g., via `npm install`) this is done for you.

**Important**: We recommend that you have the Piral CLI in the desired version included in your `devDependencies`. Otherwise, we'll resolve to the `latest` version of the Piral CLI.

## Inputs

### `feed`

**Required** The address or name of the feed to publish to.

Remark: If no full `http:` or `https:` URL is given the value is interpreted as the name of the feed in the official feed service. As such a name like `sample` will be transformed to `https://feed.piral.io/api/v1/pilet/sample`.

### `api-key`

**Optional** The API key to use. Most feed services will require an API key.

### `base-dir`

**Optional** The base directory relative to the project root.

## Outputs

### `version`

The published version.

## Example Usage

The simplified usage looks like:

```yaml
uses: smapiot/publish-pilet-action@v1
with:
  feed: 'my-sample'
  api-key: 'abcdef1234567890'
```

A complete example could thus look as follows:

```yaml
on:
  push:
    branches:
      - master

jobs:
  publish-pilet:
    name: Build and Deploy
    runs-on: [ubuntu-16.04]
    steps:
    - uses: actions/checkout@master
    - name: Publish Pilet
      uses: smapiot/publish-pilet-action@v1
      with:
        feed: my-sample
        api-key: ${{ secrets.apiKey }}
```
