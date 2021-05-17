[amqpator](../README.md) / Amqp

# Class: Amqp

Wrapper around [amqplib](http://www.squaremobius.net/amqp.node/) for simplifiyng pub/sub

## Table of contents

### Constructors

- [constructor](amqp.md#constructor)

### Properties

- [channels](amqp.md#channels)
- [connection](amqp.md#connection)
- [connectionOptions](amqp.md#connectionoptions)
- [connectionString](amqp.md#connectionstring)
- [logger](amqp.md#logger)
- [onConnectionClose](amqp.md#onconnectionclose)
- [onConnectionError](amqp.md#onconnectionerror)
- [reconnect](amqp.md#reconnect)
- [reconnectAttempts](amqp.md#reconnectattempts)
- [reconnectCount](amqp.md#reconnectcount)
- [reconnectInterval](amqp.md#reconnectinterval)

### Methods

- [addChannel](amqp.md#addchannel)
- [closeChannel](amqp.md#closechannel)
- [closeChannelAll](amqp.md#closechannelall)
- [connect](amqp.md#connect)
- [createConnectionIfNotExists](amqp.md#createconnectionifnotexists)
- [disconnect](amqp.md#disconnect)
- [getConnection](amqp.md#getconnection)
- [getPub](amqp.md#getpub)
- [getSub](amqp.md#getsub)
- [removeChannel](amqp.md#removechannel)

## Constructors

### constructor

\+ **new Amqp**(`__namedParameters?`: [*AmqpConstructor*](../interfaces/amqpatortypes.amqpconstructor.md)): [*Amqp*](amqp.md)

Creates an instance of Amqp

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `__namedParameters` | [*AmqpConstructor*](../interfaces/amqpatortypes.amqpconstructor.md) | {} |

**Returns:** [*Amqp*](amqp.md)

Defined in: [src/Amqp.ts:39](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L39)

## Properties

### channels

• `Private` **channels**: *Map*<string, Channel\>

Defined in: [src/Amqp.ts:37](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L37)

___

### connection

• `Private` **connection**: ``null`` \| *Connection*= null

Defined in: [src/Amqp.ts:39](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L39)

___

### connectionOptions

• `Private` **connectionOptions**: Connect

Defined in: [src/Amqp.ts:20](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L20)

___

### connectionString

• `Private` **connectionString**: *string*

Defined in: [src/Amqp.ts:18](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L18)

___

### logger

• `Private` **logger**: Console

Defined in: [src/Amqp.ts:35](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L35)

___

### onConnectionClose

• `Private` **onConnectionClose**: Function

Defined in: [src/Amqp.ts:30](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L30)

___

### onConnectionError

• `Private` **onConnectionError**: Function

Defined in: [src/Amqp.ts:32](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L32)

___

### reconnect

• `Private` **reconnect**: *boolean*= true

Defined in: [src/Amqp.ts:22](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L22)

___

### reconnectAttempts

• `Private` **reconnectAttempts**: *number*= 10

Defined in: [src/Amqp.ts:24](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L24)

___

### reconnectCount

• `Private` **reconnectCount**: *number*= 0

Defined in: [src/Amqp.ts:26](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L26)

___

### reconnectInterval

• `Private` **reconnectInterval**: *number*= 299

Defined in: [src/Amqp.ts:28](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L28)

## Methods

### addChannel

▸ `Private` **addChannel**(`__namedParameters?`: [*AmqpAddChannel*](../interfaces/amqpatortypes.amqpaddchannel.md)): *Promise*<Channel \| ConfirmChannel\>

Adds a channel of a given type ('default' or 'confirm') inside a connection

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `__namedParameters` | [*AmqpAddChannel*](../interfaces/amqpatortypes.amqpaddchannel.md) | {} |

**Returns:** *Promise*<Channel \| ConfirmChannel\>

Defined in: [src/Amqp.ts:252](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L252)

___

### closeChannel

▸ `Private` **closeChannel**(`_id`: *string*): *Promise*<void\>

Closes a channel with a given _id

#### Parameters

| Name | Type |
| :------ | :------ |
| `_id` | *string* |

**Returns:** *Promise*<void\>

Defined in: [src/Amqp.ts:303](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L303)

___

### closeChannelAll

▸ **closeChannelAll**(): *Promise*<void[]\>

Closes all open channels

**Returns:** *Promise*<void[]\>

Defined in: [src/Amqp.ts:176](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L176)

___

### connect

▸ **connect**(): *Promise*<Connection\>

Opens a connection to the AMQP server

**Returns:** *Promise*<Connection\>

Defined in: [src/Amqp.ts:124](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L124)

___

### createConnectionIfNotExists

▸ `Private` **createConnectionIfNotExists**(): *Promise*<Connection\>

Creates a connection to the AMQP server if not exists

**Returns:** *Promise*<Connection\>

Defined in: [src/Amqp.ts:314](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L314)

___

### disconnect

▸ **disconnect**(): *Promise*<``null`` \| void\>

Closes connection to the AMQP server if exists

**Returns:** *Promise*<``null`` \| void\>

Defined in: [src/Amqp.ts:183](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L183)

___

### getConnection

▸ **getConnection**(): ``null`` \| *Connection*

Returns connection

**Returns:** ``null`` \| *Connection*

Defined in: [src/Amqp.ts:190](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L190)

___

### getPub

▸ **getPub**(`options`: [*AmqpGetPub*](../interfaces/amqpatortypes.amqpgetpub.md)): *Promise*<AmqpPub\>

Returns channel for publishing

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [*AmqpGetPub*](../interfaces/amqpatortypes.amqpgetpub.md) |

**Returns:** *Promise*<AmqpPub\>

Defined in: [src/Amqp.ts:197](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L197)

___

### getSub

▸ **getSub**(`options`: [*AmqpGetSub*](../interfaces/amqpatortypes.amqpgetsub.md)): *Promise*<AmqpSub\>

Returns channel for subscribing

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [*AmqpGetSub*](../interfaces/amqpatortypes.amqpgetsub.md) |

**Returns:** *Promise*<AmqpSub\>

Defined in: [src/Amqp.ts:225](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L225)

___

### removeChannel

▸ `Private` **removeChannel**(`_id`: *string*): *Promise*<boolean\>

Removes a channel with a given _id

#### Parameters

| Name | Type |
| :------ | :------ |
| `_id` | *string* |

**Returns:** *Promise*<boolean\>

Defined in: [src/Amqp.ts:321](https://github.com/LordotU/amqpator/blob/1f2687b/src/Amqp.ts#L321)
