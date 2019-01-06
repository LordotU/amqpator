## Classes

<dl>
<dt><a href="#Amqp">Amqp</a></dt>
<dd><p>Wrapper around <a href="http://www.squaremobius.net/amqp.node/">amqplib</a> for simplifiyng pub/sub</p>
</dd>
<dt><a href="#AmqpPub">AmqpPub</a></dt>
<dd><p>Wrapper around <a href="http://www.squaremobius.net/amqp.node/">amqplib</a>
<a href="http://www.squaremobius.net/amqp.node/channel_api.html#confirmchannel">ConfirmChannel</a></p>
</dd>
<dt><a href="#AmqpSub">AmqpSub</a></dt>
<dd><p>Wrapper around <a href="http://www.squaremobius.net/amqp.node/">amqplib</a>
<a href="http://www.squaremobius.net/amqp.node/channel_api.html#channel">Channel</a></p>
</dd>
</dl>

<a name="Amqp"></a>

## Amqp
Wrapper around [amqplib](http://www.squaremobius.net/amqp.node/) for simplifiyng pub/sub

**Kind**: global class  

* [Amqp](#Amqp)
    * [new Amqp([options])](#new_Amqp_new)
    * [.connect()](#Amqp+connect) ⇒ <code>Promise.&lt;ChannelModel&gt;</code>
    * [.disconnect()](#Amqp+disconnect) ⇒ <code>Promise</code>
    * [.removeChannel(_id)](#Amqp+removeChannel) ⇒ <code>Promise</code>
    * [.getPub([options])](#Amqp+getPub) ⇒ [<code>Promise.&lt;AmqpPub&gt;</code>](#AmqpPub)
    * [.getSub([options])](#Amqp+getSub) ⇒ [<code>Promise.&lt;AmqpSub&gt;</code>](#AmqpSub)

<a name="new_Amqp_new"></a>

### new Amqp([options])
Creates an instance of Amqp


| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | 
| [options.host] | <code>String</code> | <code>&#x27;&#x27;</code> | 
| [options.username] | <code>String</code> | <code>&#x27;&#x27;</code> | 
| [options.logger] | <code>Object</code> | <code>console</code> | 
| [options.onConnectionClose] | <code>function</code> | <code>()&#x3D;&gt;{}</code> | 
| [options.onConnectionError] | <code>function</code> | <code>()&#x3D;&gt;{}</code> | 
| [options.connectionOptions] | <code>Object</code> | <code>{}</code> | 
| [options.password] | <code>String</code> | <code>&#x27;&#x27;</code> | 
| [options.port] | <code>Number</code> | <code>5672</code> | 
| [options.query] | <code>Object</code> | <code>{heartbeat: 30}</code> | 
| [options.reconnect] | <code>Boolean</code> | <code>true</code> | 
| [options.reconnectAttempts] | <code>Number</code> | <code>10</code> | 
| [options.reconnectInterval] | <code>Number</code> | <code>299</code> | 
| [options.vhost] | <code>String</code> | <code>&#x27;/&#x27;</code> | 

<a name="Amqp+connect"></a>

### amqp.connect() ⇒ <code>Promise.&lt;ChannelModel&gt;</code>
Opens a connection to the AMQP server

**Kind**: instance method of [<code>Amqp</code>](#Amqp)  
<a name="Amqp+disconnect"></a>

### amqp.disconnect() ⇒ <code>Promise</code>
Closes connection to the AMQP server if exists

**Kind**: instance method of [<code>Amqp</code>](#Amqp)  
<a name="Amqp+removeChannel"></a>

### amqp.removeChannel(_id) ⇒ <code>Promise</code>
Removes a channel with a given _id

**Kind**: instance method of [<code>Amqp</code>](#Amqp)  
**Access**: protected  

| Param | Type |
| --- | --- |
| _id | <code>String</code> | 

<a name="Amqp+getPub"></a>

### amqp.getPub([options]) ⇒ [<code>Promise.&lt;AmqpPub&gt;</code>](#AmqpPub)
Returns channel for publishing

**Kind**: instance method of [<code>Amqp</code>](#Amqp)  
**See**: [AmqpPub](#AmqpPub)  

| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | 

<a name="Amqp+getSub"></a>

### amqp.getSub([options]) ⇒ [<code>Promise.&lt;AmqpSub&gt;</code>](#AmqpSub)
Returns channel for subscribing

**Kind**: instance method of [<code>Amqp</code>](#Amqp)  
**See**: [AmqpSub](#AmqpSub)  

| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | 

<a name="AmqpPub"></a>

## AmqpPub
Wrapper around [amqplib](http://www.squaremobius.net/amqp.node/)
[ConfirmChannel](http://www.squaremobius.net/amqp.node/channel_api.html#confirmchannel)

**Kind**: global class  
**See**: [Amqp](#Amqp)  

* [AmqpPub](#AmqpPub)
    * [new AmqpPub([options])](#new_AmqpPub_new)
    * [.publish([params])](#AmqpPub+publish) ⇒ <code>Promise</code>
    * [.remove()](#AmqpPub+remove) ⇒ <code>Promise</code>

<a name="new_AmqpPub_new"></a>

### new AmqpPub([options])
Creates an instance of AmqpPub


| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | 
| [options.channel] | <code>ConfirmChannel</code> | <code></code> | 
| [options.exchange] | <code>String</code> | <code>&#x27;&#x27;</code> | 
| [options.exchangeOptions] | <code>Object</code> | <code>{}</code> | 
| [options.logger] | <code>Object</code> | <code>console</code> | 
| [options.routingKey] | <code>String</code> | <code>&#x27;&#x27;</code> | 

<a name="AmqpPub+publish"></a>

### amqpPub.publish([params]) ⇒ <code>Promise</code>
Publishes message

**Kind**: instance method of [<code>AmqpPub</code>](#AmqpPub)  

| Param | Type | Default |
| --- | --- | --- |
| [params] | <code>Object</code> | <code>{}</code> | 
| [params.message] | <code>Number</code> \| <code>String</code> \| <code>Object</code> | <code>&#x27;&#x27;</code> | 
| [params.messageOptions] | <code>Object</code> | <code>{}</code> | 

<a name="AmqpPub+remove"></a>

### amqpPub.remove() ⇒ <code>Promise</code>
Removes appropriate confirmation channel

**Kind**: instance method of [<code>AmqpPub</code>](#AmqpPub)  
<a name="AmqpSub"></a>

## AmqpSub
Wrapper around [amqplib](http://www.squaremobius.net/amqp.node/)
[Channel](http://www.squaremobius.net/amqp.node/channel_api.html#channel)

**Kind**: global class  
**See**: [Amqp](#Amqp)  

* [AmqpSub](#AmqpSub)
    * [new AmqpSub([options])](#new_AmqpSub_new)
    * [.subscribe([params])](#AmqpSub+subscribe) ⇒ <code>Promise</code>
    * [.remove()](#AmqpSub+remove) ⇒ <code>Promise</code>

<a name="new_AmqpSub_new"></a>

### new AmqpSub([options])
Creates an instance of AmqpSub


| Param | Type | Default |
| --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | 
| [options.channel] | <code>Channel</code> | <code></code> | 
| [options.exchange] | <code>String</code> | <code>&#x27;&#x27;</code> | 
| [options.exchangeOptions] | <code>Object</code> | <code>{}</code> | 
| [options.logger] | <code>Object</code> | <code>console</code> | 
| [options.onQueueMsg] | <code>function</code> | <code>()&#x3D;&gt;{}</code> | 
| [options.prefetch] | <code>Number</code> | <code>0</code> | 
| [options.queue] | <code>String</code> | <code>&#x27;&#x27;</code> | 
| [options.queueOptions] | <code>Object</code> | <code>{}</code> | 
| [options.routingKey] | <code>String</code> | <code>&#x27;&#x27;</code> | 

<a name="AmqpSub+subscribe"></a>

### amqpSub.subscribe([params]) ⇒ <code>Promise</code>
Subscribes to messages

**Kind**: instance method of [<code>AmqpSub</code>](#AmqpSub)  

| Param | Type | Default |
| --- | --- | --- |
| [params] | <code>Object</code> | <code>{}</code> | 
| [params.ackAlways] | <code>Boolean</code> | <code>true</code> | 
| [params.options] | <code>Object</code> | <code>{}</code> | 

<a name="AmqpSub+remove"></a>

### amqpSub.remove() ⇒ <code>Promise</code>
Removes appropriate channel

**Kind**: instance method of [<code>AmqpSub</code>](#AmqpSub)  
