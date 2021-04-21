import type * as AmqpTypes from 'amqplib'

import type * as AmqpatorTypes from './types'


/**
 * Wrapper around {@link http://www.squaremobius.net/amqp.node/|amqplib}
 * {@link http://www.squaremobius.net/amqp.node/channel_api.html#channel|Channel}
 */
export class AmqpSub {

  private channel: AmqpTypes.Channel | AmqpTypes.ConfirmChannel

  private exchange: string

  private exchangeOptions: AmqpatorTypes.ExchangeOptionsWithType

  // eslint-disable-next-line no-undef
  private logger: Console

  private onQueueMsg: Function

  private prefetch: number

  private routingKey: string

  private queue: string

  private queueOptions: AmqpTypes.Options.AssertQueue

  /**
   * Creates an instance of AmqpSub
   */
  constructor ({
    channel,
    exchange = '',
    exchangeOptions = {},
    logger = console,
    onQueueMsg = () => {},
    prefetch = 0,
    queue = '',
    queueOptions = {},
    routingKey = '',
  }: AmqpatorTypes.AmqpSubConstructor) {
    if ([exchangeOptions, queueOptions].some(o => o && (Array.isArray(o) || typeof o !== 'object'))) {
      throw new TypeError('AmqpSub channel `queueOptions` and `exchangeOptions` should be an objects!')
    }

    if (! Number.isInteger(prefetch)) {
      throw new TypeError(`AmqpSub channel \`prefetch\` should be an int number! Given: ${JSON.stringify(prefetch)}`)
    }

    if ([exchange, routingKey, queue].some(p => ! p || typeof p !== 'string')) {
      throw new TypeError('AmqpSub channel `exchange`, `routingKey` and `queue` should be a strings!')
    }

    if (! logger ||
      typeof logger.info !== 'function' ||
      typeof logger.error !== 'function' ||
      typeof logger.debug !== 'function'
    ) {
      throw new TypeError('Amqp logger should implement `debug()`, `info()` and `error()` methods!')
    }

    this.channel = channel
    this.exchange = exchange
    this.exchangeOptions = exchangeOptions
    this.logger = logger
    this.onQueueMsg = onQueueMsg.bind(this)
    this.prefetch = prefetch
    this.routingKey = routingKey
    this.queue = queue
    this.queueOptions = queueOptions
  }


  /**
   * Subscribes to messages
   */
  async subscribe ({
    ackAlways = true,
    options = {},
  }: AmqpatorTypes.AmqpSubSubscribe = {}): Promise<void> {
    try {
      const {
        type = 'fanout',
        ...exchangeOptions
      } = this.exchangeOptions

      await this.channel.assertExchange(this.exchange, type, exchangeOptions)
    } catch (error) {
      this.logger.error('AmqpSub channel exchange assertion error!', { error })
      throw error
    }

    try {
      await this.channel.assertQueue(this.queue, this.queueOptions)
    } catch (error) {
      this.logger.error('AmqpSub channel queue assertion error!', { error })
      throw error
    }

    await this.channel.bindQueue(this.queue, this.exchange, this.routingKey)

    this.channel.prefetch(this.prefetch)

    this.channel.consume(this.queue, async msg => {
      if (! msg || ! msg.content) {
        return
      }

      try {
        await this.onQueueMsg(
          JSON.parse(msg.content.toString('utf-8')),
          msg.fields,
          msg.properties,
        )

        this.channel.ack(msg)
      } catch (error) {
        this.logger.error('AmqpSub channel queue message processing assertion error!', { error })

        if (ackAlways) {
          this.channel.ack(msg)
        }
      }
    }, options)
  }

}
