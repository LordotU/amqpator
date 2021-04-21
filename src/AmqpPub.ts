import type * as AmqpTypes from 'amqplib'

import type * as AmqpatorTypes from './types'


/**
 * Wrapper around {@link http://www.squaremobius.net/amqp.node/|amqplib}
 * {@link http://www.squaremobius.net/amqp.node/channel_api.html#confirmchannel|ConfirmChannel}
 */
export class AmqpPub {
  private channel: AmqpTypes.Channel | AmqpTypes.ConfirmChannel

  private exchange: string

  private exchangeOptions: AmqpatorTypes.ExchangeOptionsWithType

  // eslint-disable-next-line no-undef
  private logger: Console

  private routingKey: string

  /**
   * Creates an instance of AmqpPub
   */
  constructor ({
    channel,
    exchange = '',
    exchangeOptions = {},
    logger = console,
    routingKey = '',
  }: AmqpatorTypes.AmqpPubConstructor) {
    if ([exchange, routingKey].every(v => ! v)) {
      throw new TypeError('AmqpPub channel `exchange` and `routingKey` cannot be both empty!')
    }

    if ([exchangeOptions].some(o => o && (Array.isArray(o) || typeof o !== 'object'))) {
      throw new TypeError('AmqpPub channel `exchangeOptions` should be an object!')
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
    this.routingKey = routingKey
  }


  /**
   * Publishes message
   */
  async publish ({
    message = '',
    messageOptions = {},
  }: AmqpatorTypes.AmqpPubPublish = {}): Promise<boolean> {
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

    return new Promise((resolve, reject) => {
      this.channel.publish(
        this.exchange,
        this.routingKey,
        Buffer.from(JSON.stringify(message), 'utf-8'),
        messageOptions,
        error => {
          if (error) {
            return reject(error)
          }

          return resolve(true)
        },
      )
    })
  }

}
