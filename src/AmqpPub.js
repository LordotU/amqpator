/* eslint-disable no-underscore-dangle */

'use strict'

const { ConfirmChannel } = require('amqplib/lib/channel_model')


/**
 * Wrapper around {@link http://www.squaremobius.net/amqp.node/|amqplib}
 * {@link http://www.squaremobius.net/amqp.node/channel_api.html#confirmchannel|ConfirmChannel}
 *
 * @see {@link #Amqp|Amqp}
 */
class AmqpPub {

  /**
   * Creates an instance of AmqpPub
   *
   * @constructs AmqpPub
   *
   * @param {Object}         [options={}]
   * @param {ConfirmChannel} [options.channel=null]
   * @param {String}         [options.exchange='']
   * @param {Object}         [options.exchangeOptions={}]
   * @param {Object}         [options.logger=console]
   * @param {String}         [options.routingKey='']
   */
  constructor ({
    channel = null,
    exchange = '',
    exchangeOptions = {},
    logger = console,
    routingKey = '',
  } = {}) {
    if (! (channel instanceof ConfirmChannel)) {
      throw new TypeError('AmqpPub `channel` should be an isntance of ConfirmChannel!')
    }

    if ([exchange, routingKey].every(v => ! v)) {
      throw new TypeError('AmqpPub channel `exchange` and `routingKey` cannot be both empty!')
    }

    if ([exchangeOptions].some(o => o && (Array.isArray(o) || typeof o !== 'object'))) {
      throw new TypeError('AmqpPub channel `exchangeOptions` should be an object!')
    }

    if (logger && ['debug', 'info', 'error'].some(m => typeof logger[m] !== 'function')) {
      throw new TypeError('AmqpPub logger should implement `debug()`, `info()` and `error()` methods!')
    }

    this.channel = channel
    this.exchange = exchange
    this.exchangeOptions = exchangeOptions
    this.logger = logger
    this.routingKey = routingKey
  }


  /**
   * Publishes message
   *
   * @memberof AmqpPub
   *
   * @param {Object}               [params={}]
   * @param {Number|String|Object} [params.message='']
   * @param {Object}               [params.messageOptions={}]
   *
   * @returns {Promise}
   */
  async publish ({
    message = '',
    messageOptions = {},
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

    return new Promise((resolve, reject) => {
      this.channel.publish(
        this.exchange,
        this.routingKey,
        Buffer.from(JSON.stringify(message), 'utf-8'),
        messageOptions,
        (error) => {
          if (error) {
            return reject(error)
          }

          return resolve()
        },
      )
    })
  }


  /**
   * Removes appropriate confirmation channel
   *
   * @memberof AmqpPub
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


module.exports = AmqpPub
