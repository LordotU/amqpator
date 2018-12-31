/* eslint-disable no-undef */

'use strict'

const got = require('got')

const Amqp = require('../src')


const TEST_HOST = process.env.AMQPATOR_HOST || 'localhost'
const TEST_PORT = process.env.AMQPATOR_PORT || 5672
const TEST_USERNAME = process.env.AMQPATOR_USERNAME || 'guest'
const TEST_PASSWORD = process.env.AMQPATOR_PASSWORD || 'guest'
const TEST_VHOST = process.env.AMQPATOR_VHOST || '/'
const TEST_PORT_HTTP = process.env.AMQPATOR_PORT_HTTP || 15672

const TEST_CREDENTIALS = {
  host: TEST_HOST,
  port: TEST_PORT,
  username: TEST_USERNAME,
  password: TEST_PASSWORD,
  vhost: TEST_VHOST,
}

const TEST_QUEUE = 'AMQPATOR_test_queue'
const TEST_EXCHANGE = 'AMQPATOR_test_exchange'
const TEST_EXCHANGE_2 = 'AMQPATOR_test_exchange_2'
const TEST_ROUTING_KEY = 'AMQPATOR_test_routing_key'
const TEST_MESSAGE_TEXT = 'AMQPATOR_test_message'

const JEST_TIMEOUT = 30 * 10 ** 3


const getRange = (max = 0) => [...Array(max).keys()]

const publishMessages = (publisher, cnt = 100) => Promise.all(
  getRange(cnt)
    .map(
      k => publisher.publish({ message: `${TEST_MESSAGE_TEXT}_${k}` }),
    ),
)

jest.setTimeout(JEST_TIMEOUT)

describe('Amqp', () => {

  test('Trying to reconnect on initial connection', async () => {
    const amqp = new Amqp({
      ...TEST_CREDENTIALS,

      username: 'root',
      password: 'toor',

      reconnectAttempts: 3,
      reconnectInterval: 100,
    })

    await expect(amqp.connect()).rejects.toThrow()

    expect(amqp.reconnectCount).toEqual(amqp.reconnectAttempts)
  })

  test('Correctly connects and disconnects', async () => {

    const onConnectionClose = jest.fn()

    const amqp = new Amqp({
      onConnectionClose,
    })

    await amqp.connect()
    await amqp.disconnect()

    expect(onConnectionClose.mock.calls.length).toBe(1)
  })

  test('Correctly reacts on errors', async () => {

    const onConnectionError = jest.fn()

    const amqp = new Amqp({
      ...TEST_CREDENTIALS,
      onConnectionError,
    })

    await amqp.connect()
    await amqp.connection.emit('error', new Error('Test error'))

    expect(onConnectionError.mock.calls.length).toBe(1)
  })

})

describe('AmqpPub', () => {

  test('Correctly make publish', async () => {

    const amqp = new Amqp({
      ...TEST_CREDENTIALS,
    })

    const amqpPublisher = await amqp.getPub({
      exchange: TEST_EXCHANGE,
      routingKey: TEST_ROUTING_KEY,
    })

    await publishMessages(amqpPublisher, 100)

    await amqpPublisher.channel.deleteExchange(TEST_EXCHANGE)

    await amqp.disconnect()
  })

})

describe('AmqpSub', () => {

  test('Correctly make consume', async () => {

    const MESSAGES_TO_PUBLISH = 10 ** 3

    const onQueueMsg = jest.fn(msg => msg)
    const { results: onQueueMsgResults } = onQueueMsg.mock

    const amqp = new Amqp({
      ...TEST_CREDENTIALS,
    })

    const amqpSubscriber = await amqp.getSub({
      exchange: TEST_EXCHANGE_2,
      exchangeOptions: {
        autoDelete: true,
      },
      routingKey: TEST_ROUTING_KEY,
      queue: TEST_QUEUE,
      queueOptions: {
        autoDelete: true,
        exclusive: true,
      },
      prefetch: 100,
      onQueueMsg,
    })

    amqpSubscriber.subscribe()

    const amqpPublisher = await amqp.getPub({
      exchange: TEST_EXCHANGE_2,
      exchangeOptions: {
        autoDelete: true,
      },
      routingKey: TEST_ROUTING_KEY,
    })

    await publishMessages(amqpPublisher, MESSAGES_TO_PUBLISH)

    let interval = null

    const finishInterval = async (cb, ...args) => {
      clearInterval(interval)
      await amqp.disconnect()
      cb(...args)
    }

    await new Promise((resolve, reject) => {
      interval = setInterval(async () => {
        try {
          const { body: { messages } } = await got(
            `http://${TEST_HOST}:${TEST_PORT_HTTP}/api/queues/${encodeURIComponent(TEST_VHOST)}/${TEST_QUEUE}`,
            { auth: `${TEST_USERNAME}:${TEST_PASSWORD}`, json: true },
          )

          if (parseInt(messages, 10) <= 0) {
            await finishInterval(resolve)
          }
        } catch (error) {
          await finishInterval(reject, error)
        }
      }, 299)
    })

    expect(onQueueMsgResults.length).toBe(MESSAGES_TO_PUBLISH)

    for (const k of onQueueMsgResults.keys()) {
      expect(onQueueMsgResults[k].value).toBe(`${TEST_MESSAGE_TEXT}_${k}`)
    }

  })

})
