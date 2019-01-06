/* eslint-disable no-underscore-dangle */

'use strict'

const amqp = require('amqplib')
const delay = require('nanodelay')
const id = require('nanoid')
const qs = require('querystring')

const AmqpPub = require('./AmqpPub')
const AmqpSub = require('./AmqpSub')


/**
 * Wrapper around {@link http://www.squaremobius.net/amqp.node/|amqplib} for simplifiyng pub/sub
 */
class Amqp {

  /**
   * Creates an instance of Amqp
   *
   * @constructs Amqp
   *
   * @param {Object}   [options={}]
   * @param {String}   [options.host='']
   * @param {String}   [options.username='']
   * @param {Object}   [options.logger=console]
   * @param {Function} [options.onConnectionClose=()=>{}]
   * @param {Function} [options.onConnectionError=()=>{}]
   * @param {Object}   [options.connectionOptions={}]
   * @param {String}   [options.password='']
   * @param {Number}   [options.port=5672]
   * @param {Object}   [options.query={heartbeat: 30}]
   * @param {Boolean}  [options.reconnect=true]
   * @param {Number}   [options.reconnectAttempts=10]
   * @param {Number}   [options.reconnectInterval=299]
   * @param {String}   [options.vhost='/']
   */
  constructor ({
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
  } = {}) {
    if (typeof host !== 'string') {
      throw new TypeError(`RabbitMQ host should be a string! Given: ${JSON.stringify(host)}`)
    }

    if (username !== null) {
      if (typeof username !== 'string') {
        throw new TypeError(`RabbitMQ username should be a string! Given: ${JSON.stringify(username)}`)
      } else if (typeof password !== 'string') {
        throw new TypeError(`RabbitMQ password should be a string! Given: ${JSON.stringify(password)}`)
      }
    }

    if (port !== null && ! Number.isInteger(port)) {
      throw new TypeError(`RabbitMQ port should be an int number! Given: ${JSON.stringify(port)}`)
    }

    if (vhost !== null && typeof vhost !== 'string') {
      throw new TypeError(`RabbitMQ vhost should be a string! Given: ${JSON.stringify(port)}`)
    }

    if ([onConnectionClose, onConnectionError].some(h => typeof h !== 'function')) {
      throw new TypeError('Amqp connection events handlers should be a functions!')
    }

    if (logger && ['debug', 'info', 'error'].some(m => typeof logger[m] !== 'function')) {
      throw new TypeError('Amqp logger should implement `debug()`, `info()` and `error()` methods!')
    }

    if (! username) {
      this.connectionString = `amqp://${host}`
    } else {
      this.connectionString = `amqp://${username}:${password}@${host}`
    }

    if (port) {
      this.connectionString += `:${port}`
    }

    if (vhost) {
      this.connectionString += `/${encodeURIComponent(vhost)}`
    }

    this.connectionString += `?${qs.stringify(query)}`
    this.connectionOptions = connectionOptions

    this.reconnect = reconnect
    this.reconnectAttempts = reconnectAttempts
    this.reconnectCount = 0
    this.reconnectInterval = reconnectInterval

    this.onConnectionClose = onConnectionClose.bind(this)
    this.onConnectionError = onConnectionError.bind(this)

    this.logger = logger

    this.channels = new Map()
    this.connection = null
  }


  /**
   * Opens a connection to the AMQP server
   *
   * @memberof Amqp
   *
   * @returns {Promise.<ChannelModel>}
   */
  async connect () {
    try {

      this.connection = await amqp.connect(this.connectionString, this.connectionOptions)

      this.connection
        .on('close', async (...args) => {
          this.logger.debug('Amqp connection close!', { ...args })

          await this.onConnectionClose(...args)

          this.connection = null
        })
        .on('error', async (...args) => {
          this.logger.error('Amqp connection error!', { ...args })

          await this.onConnectionError(...args)

          try {
            await this.disconnect()
          } catch (error) {
            // eslint-disable-next-line no-empty
          }
          this.connection = null
        })

      this.reconnectCount = 0

      this.logger.debug('Amqp connection creation success!')

      return this.connection

    } catch (error) {
      this.logger.error('Amqp connection creation fail!', { error })

      if (
        this.reconnect &&
        this.reconnectCount < this.reconnectAttempts
      ) {
        await delay(this.reconnectInterval)
        ++this.reconnectCount
        return this.connect()
      }

      throw error
    }
  }


  /**
   * Creates a connection to the AMQP server if not exists
   *
   * @memberof Amqp
   * @private
   *
   * @returns {Promise.<ChannelModel>}
   */
  createConnectionIfNotExists () {
    return this.connection || this.connect()
  }


  /**
   * Closes connection to the AMQP server if exists
   *
   * @memberof Amqp
   *
   * @returns {Promise}
   */
  disconnect () {
    return this.connection && this.connection.close()
  }


  /**
   * Adds a channel of a given type ('default' or 'confirm') inside a connection
   *
   * @memberof Amqp
   *
   * @param {Object} options
   * @param {Object} [options._id=null]
   * @param {Object} [options.onChannelClose=()=>{}]
   * @param {Object} [options.onConnectionError=()=>{}]
   * @param {Object} [options.type='default']
   *
   * @private
   *
   * @returns {Promise.<Channel|ConfirmChannel>}
   */
  async addChannel ({
    _id = null,
    onChannelClose = () => {},
    onChannelError = () => {},
    type = 'default',
  }) {
    if (! _id) {
      throw new TypeError('Amqp channel `_id` cannot be empty!')
    } else if (this.channels.has(_id)) {
      throw new Error(`Amqp channel \`_id\` should have an unique value! Given: ${_id}`)
    }

    if ([onChannelClose, onChannelError].some(h => typeof h !== 'function')) {
      throw new TypeError('Amqp channel events handlers should be a functions!')
    }

    if (! ['default', 'confirm'].includes(type)) {
      throw new TypeError(`Amqp unknown channel \`type\`! Given: ${JSON.stringify(type)}`)
    }

    try {
      const channel = await this.connection[`create${type === 'confirm' ? 'Confirm' : ''}Channel`]()

      channel
        .on('close', async (...args) => {
          this.logger.debug('Amqp channel close!', { ...args, _id })
          await this.removeChannel(_id)
          onChannelClose.call(channel, ...args)
        })
        .on('error', async (...args) => {
          this.logger.error('Amqp channel error!', { ...args, _id })
          await this.removeChannel(_id)
          onChannelError.call(channel, ...args)
        })

      this.channels.set(_id, channel)

      this.logger.debug('Amqp channel creation succcess!', { _id, type })

      return channel
    } catch (error) {
      this.logger.error('Amqp channel creation error!', { error })
      throw error
    }
  }


  /**
   * Closes a channel with a given _id
   *
   * @memberof Amqp
   *
   * @param {String} _id
   *
   * @private
   *
   * @returns {Promise}
   */
  async closeChannel (_id) {
    try {
      await this.channels.get(_id).close()
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  }


  /**
   * Closes all open channels
   *
   * @memberof Amqp
   *
   * @private
   *
   * @returns {Promise}
   */
  async closeChannelAll () {
    await Promise.all([...this.channels.keys()].map(_id => this.closeChannel(_id)))
  }


  /**
   * Removes a channel with a given _id
   *
   * @memberof Amqp
   *
   * @param {String} _id
   *
   * @protected
   *
   * @returns {Promise}
   */
  async removeChannel (_id) {
    await this.closeChannel(_id)
    this.channels.delete(_id)
  }


  /**
   * Returns channel for publishing
   *
   * @memberof Amqp
   *
   * @param {Object} [options={}]
   *
   * @returns {Promise<AmqpPub>}
   *
   * @see {@link #AmqpPub|AmqpPub}
   */
  async getPub (options = {}) {
    await this.createConnectionIfNotExists()

    const _id = id()

    const {
      onChannelClose = () => {},
      onChannelError = () => {},
      ...restOptions
    } = options

    const channel = await this.addChannel({
      _id,
      onChannelClose,
      onChannelError,
      type: 'confirm',
    })

    const amqpPub = new AmqpPub({
      channel,
      ...restOptions,
      logger: this.logger,
    })

    Object.defineProperties(amqpPub, {
      _amqp: {
        enumerable: true,
        value: this,
      },
      _id: {
        enumerable: true,
        value: _id,
      },
    })

    return amqpPub
  }


  /**
   * Returns channel for subscribing
   *
   * @memberof Amqp
   *
   * @param {Object} [options={}]
   *
   * @returns {Promise<AmqpSub>}
   *
   * @see {@link #AmqpSub|AmqpSub}
   */
  async getSub (options = {}) {
    await this.createConnectionIfNotExists()

    const _id = id()

    const {
      onChannelClose = () => {},
      onChannelError = () => {},
      ...restOptions
    } = options

    const channel = await this.addChannel({
      _id,
      onChannelClose,
      onChannelError,
    })

    const amqpSub = new AmqpSub({
      channel,
      ...restOptions,
      logger: this.logger,
    })

    Object.defineProperties(amqpSub, {
      _amqp: {
        enumerable: true,
        value: this,
      },
      _id: {
        enumerable: true,
        value: _id,
      },
    })

    return amqpSub
  }

}


module.exports = Amqp
