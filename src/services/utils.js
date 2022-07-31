import Web3 from "web3";
import { PLATFORM_ENUM } from "./type";
import * as chatApi from "./api";
import moment from "moment";
import axiosApiInstance from "./axios";
const web3 = new Web3(window.ethereum);
export async function getEthAccount() {
  let res = {
    address: "",
    balance: 0,
    shortAddress: "",
  };
  // @ts-ignore
  let isSafePal = web3.currentProvider?.isSafePal;
  if (!isSafePal) {
    // @ts-ignore
    const permissionRes = await web3.currentProvider
      // @ts-ignore
      .request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      })
      .catch((e) => {
        console.log(e);
      });
    if (!permissionRes) return res;
  }
  try {
    //@ts-ignore
    const address = await web3.eth.requestAccounts();
    console.log(address, "address");
    if (address && address.length > 0) {
      res.address = address[0];
      let strLength = address[0].length;
      res.shortAddress =
        address[0].substring(0, 5) +
        "..." +
        address[0].substring(strLength - 4, strLength);
    }
  } catch (e) {
    console.log(e);
  }
  return res;
}
export const loginAfterSign = async (
  res = "",
  address = "",
  signContent = "",
  userAvatar = ""
) => {
  let loginParams = {
    wallet_address: address,
    signature: res,
    login_random_secret: signContent,
  };
  if (userAvatar) {
    loginParams.user_avatar = decodeURIComponent(userAvatar);
  }
  const loginRes = await chatApi.login(loginParams);
  if (loginRes.code === 0) {
    const {
      data: { access_token },
    } = loginRes;
    if (access_token) {
      axiosApiInstance.access_token = `Bearer ${access_token}`;
    }
    return axiosApiInstance.access_token;
  }
};
export const signMetamask = async ({ platform = PLATFORM_ENUM.SWAPCHAT }) => {
  // @ts-ignore
  let ethAccount = await getEthAccount();
  if (!ethAccount.address) {
    return false;
  }
  let address = ethAccount.address;
  if (platform === PLATFORM_ENUM.OPENSEA) {
    await chatApi.register({
      platform: PLATFORM_ENUM.OPENSEA,
      user_name: address,
    });
  }

  let randomSecret = await chatApi.getLoginRandomSecret({
    wallet_address: address,
  });
  if (randomSecret.code !== 0) {
    await chatApi.register({
      platform: "metamask",
      user_name: address,
    });
    randomSecret = await chatApi.getLoginRandomSecret({
      wallet_address: address,
    });
  }
  if (randomSecret.data) {
    const msg = `0x${Buffer.from(randomSecret.data, "utf8").toString("hex")}`;
    let signContent = `SwapChat wants you to sign in with your Ethereum account:
${address}
for SwapChat login
URI: https://chat.web3messaging.online/
Nonce: ${msg}
Issued At: ${moment().utc().local().format("DD/MM/YYYY HH:mm")}`;
    const res = await web3.eth.personal
      .sign(signContent, address, "swapchat")
      .catch((e) => {});
    if (res) {
      await loginAfterSign(res, address, signContent);
    } else {
    }
  } else {
  }
};
