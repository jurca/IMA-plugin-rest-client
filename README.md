# ima-plugin-rest-client

Generic REST API client plugin for the IMA application framework. You may find
the IMA application skeleton at
[https://github.com/seznam/IMA.js-skeleton](https://github.com/seznam/IMA.js-skeleton).

## Installation

You may install the IMA REST client plugin using the following command:

```
npm install ima-plugin-rest-client --save
```

## Usage

While it is possible to use this plugin on its own within an IMA application,
it is recommended to use it in a combination with a more specialized
REST client implementation extending this plugin.

## Architecture overview

The main entry point is the `AbstractRestClient` class, the basic abstract
implementation of the `RestClient` interface.

The `AbstractRestClient` provides methods for performing REST API requests,
which are defined in the aforementioned interface.

The Abstract REST client can be configured using the following:

* `Configurator` - interface defining the API for fetching server-provided
  configuration for other tools that can be used to configure the REST client.
* `LinkGenerator` - interface defining the API for generating URLs for
  accessing the resources and entities of the REST API.
* `RequestPreProcessor` - interface defining the API for pre-processing the
  requests before they are sent to the REST API server. The pre-processor may
  also turn the request into a response, if no actual request to the server is
  necessary.
* `ResponsePostProcessor` - interface defining the API for post-processing all
  responses, regardless whether they were received from the server or generated
  by a request pre-processor.
