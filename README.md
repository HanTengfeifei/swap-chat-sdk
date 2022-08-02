
# Intro
swapchat-js is a small sdk that allows you to use swapchat more quickly

> You can install and experience swapchat in chrome first
> 
> Downloads: https://chrome.google.com/webstore/detail/swapchat/cljogniamdljbpeapjdbdigbjmipfpgh

## Installation
> npm i swap-chat-js 
> 
or 
> yarn add swap-chat-js
> 
> 
> 
***
Methods
Methods|Description
------- |:---------:|
constructor(dom1,dom2,optionsObj,paramsObj)|The method to create a SwapChatSdk instance accepts four parameters|
exect()|After creating a SwapChatSdk instance, call the exect method of the instance without passing any parameters |
***
Parameters of constructor
Parameter|Description|Required
------- |:---------:|:-----
|dom1|This dom1 is the first parameter of constructor and must be a real dom element. It will act as a container for the button that triggers the chat window|yes
|dom2 |This dom2 is the second parameter of constructor and must be a real dom element. It will act as a container for the chat window|yes
|options |This options is the third parameter of constructor, which is an ordinary object. His width and height properties are number type and will control the width and height of the chat window|no
|params |This params is the fourth parameter of the constructor, which is an ordinary object. including six properties,see the following table for specific usage details|yes
***
Properties for the params parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|platform|string|twitter,discord,opensea,swapchat|swapchat|The platform that will use the sdk, currently supports twitter,discord,opensea,swapchat|no
|type |string|single,group,thread|single|The way of using sdk, currently supports single, group, thread|no
|room_payload|object|{}|Parameters required to create room_id|For different platforms and different ways of calling up the chat window, you need to set the corresponding parameters|If the value of the room_id attribute is set, room_payload does not need to be set. If room_id is not set, then room_payload is required
|room_id |string|Generate a room_id according to the official api documentation|none|room_id corresponding to the chat room|If the value of the room_payload property is set, room_id does not need to be set. If room_payload is not set, then room_id is required
|login_payload|object|{signature,wallet_address,login_random_secret,user_avatar}|{}|Login parameters that need to be set|If the value of the access_token attribute is set, the login_payload does not need to be set. If the access_token is not set, then the login_payload is required.
|access_token |string|Generate a access_token according to the official api documentation|none|access_token corresponding to the login user|If the value of the login_payload property is set, access_token does not need to be set. If login_payload is not set, then access_token is required
***
Properties for the login_payload parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|signature|string|Generate a signature according to the official api documentation|none|The signature of the currently logged in user|yes
|wallet_address |string|Generate a wallet_address according to the official api documentation|none|The address of the currently logged in user|yes
|login_random_secret|string|Generate a login_random_secret according to the official api documentation|none|none|yes
|user_avatar |string|none|none|User avatar address|no
***
Properties for the room_payload parameter object
## When platform is opensea and the type is thread
Properties for the room_payload parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|opensea_coll_slug|string|none|none|none|yes
|opensea_item_token_id |string|none|none|none|yes
|opensea_item_contract_address|string|none|none|none|yes
|chain_name |string|none|none|User avatar address|yes
## When platform is swapchat and the type is thread
Properties for the room_payload parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|room_id|string|none|none|none|yes
|msg_id |string|none|none|none|yes
## When platform is swapchat and the type is single
Properties for the room_payload parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|user_id|string|none|none|user_id of the user to chat|yes
|user_name |string|none|none|user_name of the user to chat|none
|user_avatar |string|none|none|user_avatar of the user to chat｜no
## When platform is opensea and the type is single
Properties for the room_payload parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|user_name |string|none|none|user_name of the user to chat|yes
|user_avatar |string|none|none|user_avatar of the user to chat｜no
## When platform is discord and the type is single
Properties for the room_payload parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|user_id|string|none|none|user_id of the user to chat|yes
|user_name |string|none|none|user_name of the user to chat|yes
## When platform is twitter and the type is single
Properties for the room_payload parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|user_name |string|none|none|user_name of the user to chat|yes
|user_avatar |string|none|none|user_avatar of the user to chat｜no
## When platform is swapChat and the type is group
Not currently supported
## When platform is opensea and the type is group
Properties for the room_payload parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|collection_name |string|none|none|collection_name of the ollection to chat|yes
## When platform is twitter and the type is group
Properties for the room_payload parameter object
Properties|Type|Value|Default|Description|Required
------- |:---------:|:---------:|:---------:|:---------:|:---------:|
|space_id |string|none|none|space_id of the space to chat|yes
|space_title |string|none|none|collection_name of the ollection to chat|no
## Usage




```javascript
import SwapChatSdk from 'swap-chat-js';

// You need to create an instance of SwapChatSdk Pass in two dom elements as parameters.
// The first element is the trigger that brings up the element and the second element is the slot container for the chat tool
const SwapChatSdkStance = new SwapChatSdk({
    dom1,
    dom2
    {width:400,height:600},{
      platform:'twitter',
      type:'single',
      room_payload:{
        user_name:'yihang1314'
      }
    }
  }
    );
//  Methods requiring calls to instances instance.exect()
SwapChatSdkStance.exect()
```

## Using swapchat-js in react
```javascript
import SwapChatSdk from 'swap-chat-js';
import react, { useEffect, useRef } from "react";
function App() {
  const buttonRef = useRef();
  const containRef = useRef();
  useEffect(() => {
    const defaultParams = {
      platform:'twitter',
      type:'group',
      room_payload:{
          // user_name:'yihang1314'
         space_id: '1MYxNnoyanwxw',
      }
    };
    const SwapChatSdkStance = new SwapChatSdk(
      buttonRef.current,
      containRef.current,
      {
        width:400,
        height:600,
      },
       { ...defaultParams }
    );
    SwapChatSdkStance.exect();
  }, []);
  return (
    <div className="App">
      <button ref={buttonRef}>swapChat</button>
      <div ref={containRef}></div>
    </div>
  );
}

export default App;
```
## Using swapchat-js in vue
```vue
<template>
  <div class="hello">
    <button ref="button"></button>
    <div ref="container">
    </div>
  </div>
</template>
<script>
import { getCurrentInstance} from 'vue';
import SwapChatSdk from 'swap-chat-js'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    const instance = getCurrentInstance()
     const SwapChatSdkStance = new SwapChatSdk(
      instance.refs.button,
      instance.refs.container,
      {
        width: 400,
        height: 600},
      {
      platform:'discord',
      type:'single',
      room_payload:{
          user_name:'方庭#3162'
        //  space_id: '1MYxNnoyanwxw',
      }
    }
    );
    SwapChatSdkStance.exect();
  }
}
</script>
```
