# Publish Pilet Action

This GitHub action publishes a pilet to a provided feed.

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

## Example usage

```yaml
uses: smapiot/publish-pilet-action@v1
with:
  feed: 'cross-fx'
  api-key: 'abcdef1234567890'
```

## Development

We pretty much followed the [standard tutorial on GitHub help](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-a-javascript-action).
