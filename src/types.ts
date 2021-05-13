import type * as qs from 'querystring'

import type * as amqp from 'amqplib'


// eslint-disable-next-line no-unused-vars
type Callback = (...args: any[]) => void

export interface ExchangeOptionsWithType extends amqp.Options.AssertExchange {
  type?: string
}

export interface AmqpSubConstructor {
  channel: amqp.Channel | amqp.ConfirmChannel,
  exchange?: string,
  exchangeOptions?: ExchangeOptionsWithType,
  // eslint-disable-next-line no-undef
  logger?: Console,
  onQueueMsg: Callback,
  prefetch?: number,
  routingKey?: string,
  queue?: string,
  queueOptions?: amqp.Options.AssertQueue,
}

export interface AmqpSubSubscribe {
  ackAlways?: boolean,
  options?: amqp.Options.Consume,
}

export interface AmqpPubConstructor {
  channel: amqp.Channel | amqp.ConfirmChannel,
  exchange?: string,
  exchangeOptions?: amqp.Options.AssertExchange,
  // eslint-disable-next-line no-undef
  logger?: Console,
  routingKey?: string,
}

export interface AmqpPubPublish {
  message?: string,
  messageOptions?: amqp.Options.Publish,
}

export interface AmqpConstructor {
  host?: string,
  username?: string,
  // eslint-disable-next-line no-undef
  logger?: Console,
  onConnectionClose?: Callback,
  onConnectionError?: Callback,
  connectionOptions?: amqp.Options.Connect,
  password?: string,
  port?: number,
  query?: qs.ParsedUrlQueryInput,
  reconnect?: boolean,
  reconnectAttempts?: number,
  reconnectInterval?: number,
  vhost?: string,
}

export interface AmqpAddChannel {
  _id?: string | null,
  onChannelClose?: Callback,
  onChannelError?: Callback,
  useConfirm?: boolean,
}

export interface AmqpGetPub {
  exchange: string,
  exchangeOptions?: amqp.Options.AssertExchange,
  routingKey: string,
  onChannelClose?: Callback,
  onChannelError?: Callback,
}

export interface AmqpGetSub {
  exchange: string,
  exchangeOptions: amqp.Options.AssertExchange,
  onQueueMsg: Callback,
  onChannelClose?: Callback,
  onChannelError?: Callback,
  prefetch?: number,
  queue: string,
  queueOptions: amqp.Options.AssertQueue,
  routingKey: string,
}
