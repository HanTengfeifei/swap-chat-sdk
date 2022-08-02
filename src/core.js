import { addEvent, isDOM, createElement, getElementById, isObj } from "./utils";
import { baseUrl } from "./constants";
import { INTERFACE_TYPE, PLATFORM_ENUM } from "./services/type";
import { merge, mergeConfig } from "./utils";
import { signMetamask,loginAfterSign,register,getOpenSeaInfo,creactThreads } from "./services/utils";
import { getRooms } from "./services/api";
import axiosApiInstance, { isFreshToken, tokenMgr } from "./services/axios";
 class SwapChatSdk {
  constructor(content, container, options = {}, params = {}) {
    if (!isDOM()(content) || !isDOM()(container)) {
      return this;
    }
    const defaultOp = { height: 600, width: 400 };
    const defaultParams = {
      platform: PLATFORM_ENUM.SWAPCHAT, //PLATFORM_ENUM.SWAPCHAT,PLATFORM_ENUM.TWITTER,LATFORM_ENUM.OPENSEA,PLATFORM_ENUM.DISCORD
      type: INTERFACE_TYPE.SINGLE, //“single”,INTERFACE_TYPE.GROUP,INTERFACE_TYPE.THREAD,INTERFACE_TYPE.CUSTOMER
      room_payload: {
        //## type===INTERFACE_TYPE.SINGLE
        //swapchat
        swapchat_user_id: "",
        user_id:'',
        user_avatar: "", // 可选
        user_name: "", // 可选
        //twitter
        twitter_handle: "",
        twitter_avatar: "",
        //opensea
        wallet_address: "",
        //discord
        discord_username: "",
        //## type===INTERFACE_TYPE.GROUP
        //swapchat
        users: [], //[{userId:"",userAvatar:"",userName:""}]
        //twitter
        space_id: "",
        //opensea
        collection_name: "",
        //discord
        //#.........
        //## type===INTERFACE_TYPE.THREAD
        //swapchat
        is_thread: "true", //"false","true"
        msg_id: "",
        user_name: "",
        user_avatar: "",
        thread_msg: "",
        //twitter
        // is_thread: "true",
        // room_id: "",
        // msg_id: "",
        // user_name: "",
        // user_avatar: "",
        // thread_msg: "",
        //opensea
        opensea_item_token_id: "",
        opensea_item_contract_address: "",
        chain_name: "",
        opensea_coll_slug: "",
        //discord
        //#.........
      },
      roomId: "",
      login_paylod: {
        login_random_secret: "",
        signature: "",
        wallet_address: "",
        user_avatar: "",
      },
      access_token: "",
    };
    this.defaultOptions = isObj(options)
      ? merge({}, defaultOp, options)
      : defaultOp;
    this.defaultParams = isObj(params)
      ? merge({}, defaultParams, params)
      : defaultParams;
    this.status = false;
    this.contentWrapper = content;
    this.button = `<div style="
     height: 44px; 
     min-width: 44px;
     border-radius: 999px;
     padding: 0 20px;
     display: flex; 
     align-items: center;
     font-family: sans-serif;
     background: #605DEC;
     color: #ffffff;
     "
     >
     <div style="display: inline-block; width: 30px; height: 30px; margin-right: 10px;">
        <img style="width: 100%; margin-right: 10px; filter: drop-shadow(0px 4px 5px rgba(36, 36, 36, 0.45));" src="https://chat.web3messaging.online/assets/icon/newHouseChatIcon.svg" alt="">
     </div>
        Create a SwapChat        
    </div>`;
    this.container = container;
  }
  exect() {
    let that = this;
    if(!that.contentWrapper ||!that.container || that.contentWrapper === that.container){
      console.log('The first parameter and the second parameter cannot be the same dom element')
      return 
    }
      that.contentWrapper.innerHTML = that.button;
    const firstButtonDom = that.contentWrapper.firstChild;
    addEvent(firstButtonDom, "click", function () {
      if (that.status) {
        that.closeClient();
        that.status = false;
      } else {
        that.creatClient();
        that.status = true;
      }
    });
  }
  async creactIframeUrl() {
    const that = this;
    let {
      platform = PLATFORM_ENUM.SWAPCHAT,
      type = INTERFACE_TYPE.SINGLE,
      room_payload: {
        //## type===INTERFACE_TYPE.SINGLE
        //swapchat
        swapchat_user_id,
        user_id,
        user_avatar, // 可选
        user_name, // 可选
        //twitter
        twitter_handle,
        twitter_avatar,
        //opensea
        wallet_address,
        //discord
        discord_username,
        //## type===INTERFACE_TYPE.GROUP
        //swapchat
        users: [], //[{user_id:"",user_avatar:"",user_name:""}]
        //twitter
        space_id,
        space_title,
        //opensea
        collection_name,
        //discord
        //#.........
        //## type===INTERFACE_TYPE.THREAD
        //swapchat
        is_thread, //"false","true"
        msg_id,
        // user_name,
        // user_avatar,
        thread_msg,
        //twitter
        // is_thread: "true",
        // room_id: "",
        // msg_id: "",
        // user_name: "",
        // user_avatar: "",
        // thread_msg: "",
        //opensea
        opensea_item_token_id,
        opensea_item_contract_address,
        chain_name,
        opensea_coll_slug,
        //discord
        //#.........
      },
      room_id,
      access_token,
      login_paylod: { login_random_secret, signature },
      login_paylod,
    } = that.defaultParams;
    let targetToken = access_token || tokenMgr().getToken();
    let targetRoomId = room_id || "";
    let tartgetMessageId = ''
    let iframeUrl = `${baseUrl}/chat/chatWebPage?platform=${platform}&fromPage=normal`;
    if (!isFreshToken(targetToken)) {
      if (
        login_paylod &&
        login_random_secret &&
        signature &&
        login_paylod.wallet_address &&
        login_paylod.user_avatar
      ) {
        targetToken = await loginAfterSign(
          signature,
          login_paylod.wallet_address,
          login_random_secret,
          login_paylod.user_avatar
        );
      }else{
        targetToken = await signMetamask(platform);
      }
    }
    if (!targetToken) {
      return;
    }
    //     GetRoomsParams {
    //     user_id?: string,
    //     user_ids?: string[],
    //     is_opensea_coll?: boolean,
    //     opensea_coll_slug?: string
    //     item_contract_address?: string,
    //     is_twitter_space?: boolean
    //     space_id?: string
    //     space_title?: string,
    //     target_user_avatar?: string

    // }
    async function getRoomIdByParams(params){
      let roomId = null
      console.log('rooms-params',params)
      const roomData  = await getRooms({
        ...params,
      });
      if (roomData.code !== 0) {
        return;
      }
      if(roomData.data) {
        roomId = roomData.data;
      }
      return roomId
    }
    if (!targetRoomId) {
      let platType = `${platform}-${type}`;
      switch (platType) {
         //thread
         case `${PLATFORM_ENUM.OPENSEA}-${INTERFACE_TYPE.THREAD}`:
          if (opensea_item_token_id && opensea_item_contract_address && chain_name && opensea_coll_slug) {
            let roomIdAndMsgId = await creactThreads({
              is_opensea_item_thread:true,
              opensea_coll_slug:opensea_coll_slug,
              opensea_item_token_id:opensea_item_token_id,
              opensea_item_contract_address,
              chain_name
            });
            if (roomIdAndMsgId) {
              targetRoomId = roomIdAndMsgId.room_id;
              tartgetMessageId = roomIdAndMsgId.msg_id
            }
          }
          break;
        case `${PLATFORM_ENUM.SWAPCHAT}-${INTERFACE_TYPE.THREAD}`:
          if (room_payload.room_id) {
              targetRoomId = room_payload.room_id;
              tartgetMessageId = msg_id
            }
          break;
        //single
        case `${PLATFORM_ENUM.SWAPCHAT}-${INTERFACE_TYPE.SINGLE}`:
          if ((swapchat_user_id||user_id)) {
            const snapshotRoomId = await getRoomIdByParams({
              user_id: swapchat_user_id||user_id,
              user_name,
              target_user_avatar:user_avatar,
            })
            if (snapshotRoomId) {
              targetRoomId = snapshotRoomId;
            }
          }
          break;
        case `${PLATFORM_ENUM.OPENSEA}-${INTERFACE_TYPE.SINGLE}`:
          if (user_name) {
            const c_address  = await getOpenSeaInfo({
              opensea_user_id: user_name,
            });
            if(c_address){
            const c_user_id  = await register({
              platform:PLATFORM_ENUM.OPENSEA,
              user_name: c_address,
            });
            if(c_user_id){
            let snapshotRoomId = await getRoomIdByParams({
              target_user_avatar:user_avatar,
              user_id:c_user_id
            });
            if (snapshotRoomId) {
              targetRoomId = snapshotRoomId;
            }
           }
          }
        }
          break;
        case `${PLATFORM_ENUM.DISCORD}-${INTERFACE_TYPE.SINGLE}`:
          if ((discord_username||user_name)&&user_id) {
            const c_user_id  = await register({
              platform:PLATFORM_ENUM.DISCORD,
              user_name: `${discord_username||user_name}#${user_id}`,
            });
            if(c_user_id){
              let snapshotRoomId = await getRoomIdByParams({
                user_id:c_user_id,
              });
              if (snapshotRoomId) {
                targetRoomId = snapshotRoomId;
              }
            }
          }
          break;
        case `${PLATFORM_ENUM.TWITTER}-${INTERFACE_TYPE.SINGLE}`:
          if (user_name) {
            const c_user_id  = await register({
              platform:PLATFORM_ENUM.TWITTER,
              user_name: user_name,
            });
            let snapshotRoomId = await getRoomIdByParams({
              user_id:c_user_id,
              target_user_avatar:user_avatar
            });
            if (snapshotRoomId) {
              targetRoomId = snapshotRoomId;
            }
          }
          break;
          //group
          case `${PLATFORM_ENUM.SWAPCHAT}-${INTERFACE_TYPE.GROUP}`:
            if ((Array.isArray(users))) {
              //暂时不支持
              const snapshotRoomId = await getRoomIdByParams({
                user_ids:users.map((item)=>{
                  return item.user_id
                })
              })
              if (snapshotRoomId) {
                targetRoomId = snapshotRoomId;
              }
            }
            break;
          case `${PLATFORM_ENUM.OPENSEA}-${INTERFACE_TYPE.GROUP}`:
            if (collection_name) {
              let snapshotRoomId = await getRoomIdByParams({
                is_opensea_coll:true,
                opensea_coll_slug:collection_name
              });
              if (snapshotRoomId) {
                targetRoomId = snapshotRoomId;
              }
            }
            break;
          // case `${PLATFORM_ENUM.DISCORD}-${INTERFACE_TYPE.GROUP}`:
          //   if (discord_username||user_name) {
          //     let snapshotRoomId = await getRoomIdByParams({
          //       user_name:discord_username||user_name,
          //     });
          //     if (snapshotRoomId) {
          //       targetRoomId = snapshotRoomId;
          //       iframeUrl = `${baseUrl}/chat/chatWebPage?roomId=${encodeURIComponent(
          //         targetRoomId
          //       )}&access_token=${encodeURIComponent(targetToken)}`;
          //     }
          //   }
          //   break;
          case `${PLATFORM_ENUM.TWITTER}-${INTERFACE_TYPE.GROUP}`:
            if (space_id) {
              let snapshotRoomId = await getRoomIdByParams({
                is_twitter_space:true,
                space_id,
                space_title,
              });
              if (snapshotRoomId) {
                targetRoomId = snapshotRoomId;
              }
            }
            break;
            default:
              targetRoomId = ''

      }
    }
    console.log('targetToken',targetToken)
    try {
      if (targetToken) {
        iframeUrl += `access_token=${encodeURIComponent(targetToken)}`;
      }
      if (targetRoomId) {
        iframeUrl += `&roomId=${encodeURIComponent(
          targetRoomId
        )}`;
      }else{
       let msg ='***The parameter named params may be set incorrectly, please set it according to the specification***'
        console.log(msg)
        return 
      }
      if (tartgetMessageId) {
        iframeUrl += `&threadMsgId=${encodeURIComponent(tartgetMessageId)}`;
      }
    } catch (e) {}
    return iframeUrl;
  }
  async creatClientBox() {
    const that = this;
    let iframeUrl = await this.creactIframeUrl();
    if(!iframeUrl){
      return 
    }
    const IframeDomWrapper = getElementById("twitter-swapchat-message-body");
    if (IframeDomWrapper) {
      IframeDomWrapper.innerHTML = "";
      IframeDomWrapper.innerHTML = `<iframe class="twitter-swapchat-message-header-iframe" style='width: 100%; height: ${that.defaultOptions.height}px; border: 0;' src=${iframeUrl}></iframe>`;
      return;
    }
    let messageBoxEle =
      createElement(`<div id="web3-swapchat-message-box" style="min-width:120px;width:100%;width:${this.defaultOptions.width}px;overflow:auto">
            </div>`);
    let homeIconEle = createElement(
      "<img class='home-icon' src='https://chat.web3messaging.online/assets/icon/newHomeHeaderIcon.svg' alt='' style='width: auto;height: 28px;margin-right: 8px;border-radius: 4px;' >"
    );
    let goHomeIconEle = createElement(
      "<img class='go-home-icon' src='https://d97ch61yqe5j6.cloudfront.net/frontend/newRefreshIconx3.png' alt='' style='position: absolute;right: 50px;height: 22px;width: auto;z-index: 999;margin-right: 8px;border-radius: 4px; cursor: pointer;' >"
    );
    let slideToggleIconELe = createElement(
      "<img class='slide-toggle-icon' id='web3-slide-toggle-icon'  src='https://d97ch61yqe5j6.cloudfront.net/frontend/headerUp.png' alt='' style='position: absolute;right: 12px;height: 22px;width: auto;z-index: 999;margin-right: 8px;border-radius: 4px;cursor: pointer;'>"
    );
    let messageHeaderEle =
      createElement(`<div class="twitter-swapchat-message-header" style='min-width:240px;position:relative;width:100%;align-items: center;
      width: 100%;
      display:flex;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: 600;
      text-align: left;
      font-family: sans-serif;
      padding-left:20px;
      border-bottom: 1px solid #F2F2F2;' >
            </div>
        `);
    let messageBodyEle = createElement(
      "<div class='twitter-swapchat-message-body' id ='twitter-swapchat-message-body' style='overflow:hidden;transition: max-height .25s;max-height:1000px'></div>"
    );
    addEvent(messageHeaderEle, "click", function () {
      const slideToggleIconElement = getElementById("web3-slide-toggle-icon");
      const oriSrc = slideToggleIconElement.src;
      if (oriSrc.indexOf("Up") !== -1) {
        slideToggleIconElement.setAttribute(
          "src",
          "https://d97ch61yqe5j6.cloudfront.net/frontend/headerDown.png"
        );
        messageBodyEle.style.maxHeight = "0px";
      } else {
        slideToggleIconElement.setAttribute(
          "src",
          "https://d97ch61yqe5j6.cloudfront.net/frontend/headerUp.png"
        );
        messageBodyEle.style.maxHeight = "1000px";
      }
    });
    addEvent(goHomeIconEle, "click", function (e) {
      e.stopPropagation();
      const IframeDomWrapper = getElementById("twitter-swapchat-message-body");
      if (IframeDomWrapper) {
        IframeDomWrapper.innerHTML = "";
        IframeDomWrapper.innerHTML = `<iframe class="twitter-swapchat-message-header-iframe" style='width: 100%; height: ${that.defaultOptions.height}px; border: 0;' src=${iframeUrl}></iframe>`;
      }
    });
    messageHeaderEle.appendChild(homeIconEle);
    messageHeaderEle.appendChild(goHomeIconEle);
    messageHeaderEle.appendChild(slideToggleIconELe);
    messageBoxEle.appendChild(messageHeaderEle);
    messageBodyEle.innerHTML = `<iframe
        class="twitter-swapchat-message-header-iframe"
        style="width: 100%; height: ${this.defaultOptions.height}px; border: 0;"
        src=${iframeUrl}
      ></iframe>`;

    messageBoxEle.appendChild(messageBodyEle);
    this.container.appendChild(messageBoxEle);
    this.currentMessageBoxEle = messageBoxEle;
  }
  async creatClient() {
    await this.creatClientBox();
  }
  closeClient() {
    if (this.currentMessageBoxEle) {
      this.container.removeChild(this.currentMessageBoxEle);
      this.currentMessageBoxEle = null;
    }
  }
}
SwapChatSdk.merge = merge;
SwapChatSdk.mergeConfig = mergeConfig;
export default SwapChatSdk