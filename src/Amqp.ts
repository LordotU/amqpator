import * as qs from 'querystring'

import type * as AmqpTypes from 'amqplib'
import * as amqp from 'amqplib'
import { delay } from 'nanodelay'
import { nanoid } from 'nanoid'

import type * as AmqpatorTypes from './types'
import { AmqpSub } from './AmqpSub'
import { AmqpPub } from './AmqpPub'


/**
 * Wrapper around {@link http://www.squaremobius.net/amqp.node/|amqplib} for simplifiyng pub/sub
 */
export class Amqp {

  private connectionString: string

  private connectionOptions: AmqpTypes.Options.Connect

  private reconnect = true

  private reconnectAttempts = 10

  private reconnectCount = 0

  private reconnectInterval = 299

  private onConnectionClose: Function

  private onConnectionError: Function

  // eslint-disable-next-line no-undef
  private logger: Console

  private channels: Map<string, AmqpTypes.Channel> = new Map()

  private connection: AmqpTypes.Connection | null = null

  /**
   * Creates an instance of Amqp
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
  }: AmqpatorTypes.AmqpConstructor = {}) {
    if (typeof host !== 'string') {
      throw new TypeError(`RabbitMQ host should be a string! Given: ${JSON.stringify(host)}`)
    }

    if (!! username) {
      if (typeof username !== 'string') {
        throw new TypeError(`RabbitMQ username should be a string! Given: ${JSON.stringify(username)}`)
      }

      if (typeof password !== 'string') {
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

    if (! logger ||
      typeof logger.info !== 'function' ||
      typeof logger.error !== 'function' ||
      typeof logger.debug !== 'function'
    ) {
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
  }

  /**
   * Opens a connection to the AMQP server
   */
  async connect (): Promise<AmqpTypes.Connection> {
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
   * Closes all open channels
   */
  closeChannelAll (): Promise<void[]> {
    return Promise.all([...this.channels.keys()].map(_id => this.closeChannel(_id)))
  }

  /**
   * Closes connection to the AMQP server if exists
   */
  async disconnect (): Promise<void | null> {
    return this.connection && this.connection.close()
  }

  /**
   * Returns connection
   */
  getConnection (): AmqpTypes.Connection | null {
    return this.connection
  }

  /**
   * Returns channel for publishing
   */
  async getPub (options: AmqpatorTypes.AmqpGetPub): Promise<AmqpPub> {
    await this.createConnectionIfNotExists()

    const _id = nanoid()

    const {
      onChannelClose = () => {},
      onChannelError = () => {},
      ...restOptions
    } = options

    const channel = await this.addChannel({
      _id,
      onChannelClose,
      onChannelError,
      useConfirm: true,
    })

    return new AmqpPub({
      channel,
      ...restOptions,
      logger: this.logger,
    })
  }

  /**
   * Returns channel for subscribing
   */
  async getSub (options: AmqpatorTypes.AmqpGetSub): Promise<AmqpSub> {
    await this.createConnectionIfNotExists()

    const _id = nanoid()

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

    return new AmqpSub({
      channel,
      ...restOptions,
      logger: this.logger,
    })
  }

  /**
   * Adds a channel of a given type ('default' or 'confirm') inside a connection
   */
  private async addChannel ({
    _id = null,
    onChannelClose = () => {},
    onChannelError = () => {},
    useConfirm = false,
  }: AmqpatorTypes.AmqpAddChannel = {}): Promise<AmqpTypes.Channel | AmqpTypes.ConfirmChannel> {
    if (! _id) {
      throw new TypeError('Amqp channel `_id` cannot be empty!')
    } else if (this.channels.has(_id)) {
      throw new Error(`Amqp channel \`_id\` should have an unique value! Given: ${_id}`)
    }

    if ([onChannelClose, onChannelError].some(h => typeof h !== 'function')) {
      throw new TypeError('Amqp channel events handlers should be a functions!')
    }

    if (! this.connection) {
      throw new Error('Connection is not established!')
    }

    try {
      const channel = useConfirm
        ? await this.connection.createConfirmChannel()
        : await this.connection.createChannel()

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

      this.logger.debug('Amqp channel creation succcess!', { _id, useConfirm })

      return channel
    } catch (error) {
      this.logger.error('Amqp channel creation error!', { error })
      throw error
    }
  }

  /**
   * Closes a channel with a given _id
   */
  private async closeChannel (_id: string): Promise<void> {
    try {
      this.channels.get(_id)?.close()
    // eslint-disable-next-line no-empty
    } catch (error) {
    }
  }

  /**
   * Creates a connection to the AMQP server if not exists
   */
  private async createConnectionIfNotExists (): Promise<AmqpTypes.Connection> {
    return this.connection || this.connect()
  }

  /**
   * Removes a channel with a given _id
   */
  private async removeChannel (_id: string): Promise<boolean> {
    await this.closeChannel(_id)
    return this.channels.delete(_id)
  }

}
