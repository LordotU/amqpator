[amqpator](../README.md) / [AmqpatorTypes](../modules/amqpatortypes.md) / AmqpSubConstructor

# Interface: AmqpSubConstructor

[AmqpatorTypes](../modules/amqpatortypes.md).AmqpSubConstructor

## Table of contents

### Properties

- [channel](amqpatortypes.amqpsubconstructor.md#channel)
- [exchange](amqpatortypes.amqpsubconstructor.md#exchange)
- [exchangeOptions](amqpatortypes.amqpsubconstructor.md#exchangeoptions)
- [logger](amqpatortypes.amqpsubconstructor.md#logger)
- [onQueueMsg](amqpatortypes.amqpsubconstructor.md#onqueuemsg)
- [prefetch](amqpatortypes.amqpsubconstructor.md#prefetch)
- [queue](amqpatortypes.amqpsubconstructor.md#queue)
- [queueOptions](amqpatortypes.amqpsubconstructor.md#queueoptions)
- [routingKey](amqpatortypes.amqpsubconstructor.md#routingkey)

## Properties

### channel

• **channel**: *Channel* \| *ConfirmChannel*

Defined in: [src/types.ts:14](https://github.com/LordotU/amqpator/blob/1f2687b/src/types.ts#L14)

___

### exchange

• `Optional` **exchange**: *string*

Defined in: [src/types.ts:15](https://github.com/LordotU/amqpator/blob/1f2687b/src/types.ts#L15)

___

### exchangeOptions

• `Optional` **exchangeOptions**: [*ExchangeOptionsWithType*](amqpatortypes.exchangeoptionswithtype.md)

Defined in: [src/types.ts:16](https://github.com/LordotU/amqpator/blob/1f2687b/src/types.ts#L16)

___

### logger

• `Optional` **logger**: Console

Defined in: [src/types.ts:18](https://github.com/LordotU/amqpator/blob/1f2687b/src/types.ts#L18)

___

### onQueueMsg

• **onQueueMsg**: Callback

Defined in: [src/types.ts:19](https://github.com/LordotU/amqpator/blob/1f2687b/src/types.ts#L19)

___

### prefetch

• `Optional` **prefetch**: *number*

Defined in: [src/types.ts:20](https://github.com/LordotU/amqpator/blob/1f2687b/src/types.ts#L20)

___

### queue

• `Optional` **queue**: *string*

Defined in: [src/types.ts:22](https://github.com/LordotU/amqpator/blob/1f2687b/src/types.ts#L22)

___

### queueOptions

• `Optional` **queueOptions**: AssertQueue

Defined in: [src/types.ts:23](https://github.com/LordotU/amqpator/blob/1f2687b/src/types.ts#L23)

___

### routingKey

• `Optional` **routingKey**: *string*

Defined in: [src/types.ts:21](https://github.com/LordotU/amqpator/blob/1f2687b/src/types.ts#L21)
