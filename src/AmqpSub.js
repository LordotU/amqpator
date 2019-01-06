/* eslint-disable no-underscore-dangle */

'use strict'

const { Channel } = require('amqplib/lib/channel_model')


/**
 * Wrapper around {@link http://www.squaremobius.net/amqp.node/|amqplib}
 * {@link http://www.squaremobius.net/amqp.node/channel_api.html#channel|Channel}
 *
 * @see {@link #Amqp|Amqp}
 */
class AmqpSub {

  /**
   * Creates an instance of AmqpSub
   *
   * @constructs AmqpSub
   *
   * @param {Object}   [options={}]
   * @param {Channel}  [options.channel=null]
   * @param {String}   [options.exchange='']
   * @param {Object}   [options.exchangeOptions={}]
   * @param {Object}   [options.logger=console]
   * @param {Function} [options.onQueueMsg=()=>{}]
   * @param {Number}   [options.prefetch=0]
   * @param {String}   [options.queue='']
   * @param {Object}   [options.queueOptions={}]
   * @param {String}   [options.routingKey='']
   */
  constructor ({
    channel = null,
    exchange = '',
    exchangeOptions = {},
    logger = console,
    onQueueMsg = () => {},
    prefetch = 0,
    queue = '',
    queueOptions = {},
    routingKey = '',
  } = {}) {
    if (! (channel instanceof Channel)) {
      throw new TypeError('AmqpSub `channel` should be an isntance of Channel!')
    }

    if ([exchangeOptions, queueOptions].some(o => o && (Array.isArray(o) || typeof o !== 'object'))) {
      throw new TypeError('AmqpSub channel `queueOptions` and `exchangeOptions` should be an objects!')
    }

    if (! Number.isInteger(prefetch)) {
      throw new TypeError(`AmqpSub channel \`prefetch\` should be an int number! Given: ${JSON.stringify(prefetch)}`)
    }

    if ([exchange, routingKey, queue].some(p => ! p || typeof p !== 'string')) {
      throw new TypeError('AmqpSub channel `exchange`, `routingKey` and `queue` should be a strings!')
    }

    if (logger && ['debug', 'info', 'error'].some(m => typeof logger[m] !== 'function')) {
      throw new TypeError('AmqpSub logger should implement `debug()`, `info()` and `error()` methods!')
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
   *
   * @memberof AmqpSub
   *
   * @param {Object}  [params={}]
   * @param {Boolean} [params.ackAlways=true]
   * @param {Object}  [params.options={}]
   *
   * @returns {Promise}
   */
  async subscribe ({
    ackAlways = true,
    options = {},
  } = {}) {
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

    this.channel.consume(this.queue, async (msg) => {
      if (! msg || ! msg.content) {
        return
      }

      try {
        await this.onQueueMsg(JSON.parse(msg.content.toString('utf-8')))
        await this.channel.ack(msg)
      } catch (error) {
        this.logger.error('AmqpSub channel queue message processing assertion error!', { error })

        if (ackAlways) {
          await this.channel.ack(msg)
        }
      }
    }, options)
  }


  /**
   * Removes appropriate channel
   *
   * @memberof AmqpSub
   *
   * @returns {Promise}
   */
  async remove () {
    if (this._amqp && this._id) {
      await this._amqp.removeChannel(this._id)
    } else {
      try {
        await this.channel.close()
      } catch (error) {
        // eslint-disable-next-line no-empty
      }
    }

    delete this
  }

}


module.exports = AmqpSub
