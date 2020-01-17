# Amqpator

[![License](https://img.shields.io/badge/License-MIT-000000.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/LordotU/amqpator.svg?branch=master)](https://travis-ci.org/LordotU/amqpator)
[![Coverage Status](https://coveralls.io/repos/github/LordotU/amqpator/badge.svg)](https://coveralls.io/github/LordotU/amqpator)

## Description

Wrapper for [amqplib](http://www.squaremobius.net/amqp.node/) which simplifies its usage for publishing and subscribing

## Installation

```bash
yarn add amqpator
```

## Testing

You should have running RabbitMQ instance with management plugin installed.

```bash
yarn test:jest # Run Jest with coverage collection
yarn test:coverage # Send coverage to .coveralls.io
yarn test # yarn test:jest && yarn test:coverage
```

Also, you may set connection params for this instance via environment variables:

```bash
export AMQPATOR_HOST = 'localhost'
export AMQPATOR_PORT = 5672
export AMQPATOR_USERNAME = 'guest'
export AMQPATOR_PASSWORD = 'guest'
export AMQPATOR_VHOST = '/'
export AMQPATOR_PORT_HTTP = 15672
```

## Usage

```javascript
// Simple echo pub/sub

const Amqpator = require('amqpator')


const amqp = new Amqpator(/* {
  host = 'localhost',
  username = 'guest',
  logger = console,
  onConnectionClose = () => {},
  onConnectionError = () => {},
  connectionOptions = {},
  password = 'guest',
  port = 5672,
  query = { heartbeat: 30 },
  reconnect = true,
  reconnectAttempts = 10,
  reconnectInterval = 299,
  vhost = '/',
} */)

const exchange = 'echo_exchange'
const routingKey = 'echo_exchange_routing_key'

amqp.getSub({
  exchange,
  exchangeOptions: {
    autoDelete: true,
  },

  routingKey,

  queue: 'echo_queue',
  queueOptions: {
    autoDelete: true,
    exclusive: true,
  },

  onQueueMsg: ({ echo }, fields, properties) => {
    console.log(echo, fields, properties)
  },
}).then(
  _ => _.subscribe()
)

amqp.getPub({
  exchange,
  exchangeOptions: {
    autoDelete: true,
  },

  routingKey,
}).then(
  _ => _.publish({
    message: { echo: 'Echo' },
    messageOptions: {
      // expiration (string)
      // userId (string)
      // CC (string or array of string)
      // priority (positive integer)
      // persistent (boolean)
      // deliveryMode (boolean or numeric)
      // mandatory (boolean)
      // BCC (string or array of string)
      // immediate (boolean)
      // contentType (string)
      // contentEncoding (string)
      // headers (object)
      // correlationId (string)
      // replyTo (string)
      // messageId (string)
      // timestamp (positive number)
      // type (string)
      // appId (string)
    },
  )
)
```
