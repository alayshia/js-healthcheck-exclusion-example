# JS Health Check Ignore Example

An example of ignoring a health check endpoint using Nodejs

## Requirements

To utilize the example, you'll need the following:

- Nodejs or Docker, or Tilt+Docker Installed
- A Honeycomb API Key. You will need to set the env variable `HONEYCOMB_API_KEY`

_The data is set to a dataset named `endpoint-test`_

## Testing

To test the health check, `curl localhost:8080/health`
