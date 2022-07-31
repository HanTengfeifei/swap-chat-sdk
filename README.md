
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
## Usage

```javascript
import SwapChatSdk from 'swap-chat-js';

// You need to create an instance of SwapChatSdk Pass in two dom elements as parameters.
// The first element is the trigger that brings up the element and the second element is the slot container for the chat tool
const SwapChatSdkStance = new SwapChatSdk(
      dom1,
      dom2
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
      platform: "twitter",//platform
      user: { name: "hantengfei5888", avatarUrl: "" },//user relate  name is required  
      friend: {
        name: "100trillionUSD",//name is required
        avatarUrl: "",
        id: "",
      },//friend  relate
      space: { id: "", title: "" }, //space room
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
      instance.refs.container
    );
    SwapChatSdkStance.exect();
  }
}
</script>
```
