# Amqpator

[![License](https://img.shields.io/badge/License-MIT-000000.svg)](https://opensource.org/licenses/MIT)
[![Coverage Status](https://coveralls.io/repos/github/LordotU/amqpator/badge.svg)](https://coveralls.io/github/LordotU/amqpator)

## Description

Wrapper for [amqplib](http://www.squaremobius.net/amqp.node/) which simplifies its usage for publishing and subscribing

## Installation

```bash
yarn add amqpator
```

## Testing

```bash
yarn test
```

***Note:*** you should have running RabbitMQ instance with management plugin installed.

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

  onQueueMsg: ({ echo }) => console.log(echo),
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
  _ => _.publish({ echo: 'Echo' })
)
```
