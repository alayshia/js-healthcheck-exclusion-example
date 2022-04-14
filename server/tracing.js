//tracing. js 

"use strict";
const process = require('process');
const { Metadata, credentials } = require("@grpc/grpc-js");
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-grpc");

// Metadata is passed into to the tracer to provide both the dataset name and the api key required for Honeycomb

const metadata = new Metadata()
metadata.set('x-honeycomb-team', process.env.HONEYCOMB_API_KEY);
metadata.set('x-honeycomb-dataset', 'endpoint-test');

// The Trace Exporter exports the data to Honeycomb by providing the metadata + url information

const traceExporter = new OTLPTraceExporter({
  url: 'grpc://api.honeycomb.io:443/',
  credentials: credentials.createSsl(),
  metadata
});

// The service name is passed using a the resource package 
// which is an attribute that apply to all spans generated by a process.

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'js-healthcheck-example',
  }),
  traceExporter,
// Instrumentations allow you to add auto-instrumentation packages
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingPaths: [/^.*\/health.*$/]
      }})]
});

sdk.start()
  .then(() => console.log('Application is running. Send data to Honeycomb by hitting the endpoint.'))
  .catch((error) => console.log('Error tracing cannot be initialized.', error));

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});