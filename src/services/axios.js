import axios from "axios";
import { baseUrl } from "../constants";
import moment from "moment";
const refreshAPIUrl = `${baseUrl}/refresh`;
export function parseJwt(str) {
  return JSON.parse(
    decodeURIComponent(
      escape(window.atob(str.replace(/-/g, "+").replace(/_/g, "/")))
    )
  );
}
const axiosApiInstance = axios.create();
axiosApiInstance.defaults.timeout = 100000;
axiosApiInstance.defaults.headers.post["Content-Type"] = "application/json";
axiosApiInstance.defaults.baseURL = baseUrl;
axiosApiInstance.defaults.withCredentials = false;
axiosApiInstance.interceptors.request.use(
  async (config) => {
    const newConfig = { ...config };
    let accessToken = axiosApiInstance.accessToken
      ? axiosApiInstance.accessToken
      : "";
    if (accessToken) {
      let jwtToken = accessToken.substring(7);
      let tokenArr = jwtToken.split(".");
      let tokenObj = parseJwt(tokenArr[1]);
      let accessExpiredAt = tokenObj.access_expired_at * 1000;
      if (moment.utc().isAfter(moment(accessExpiredAt).utc())) {
        // ready to refresh token
        console.log("ready to refresh token");
        let token = undefined;
        try {
          token = await axios.get(refreshAPIUrl, {
            headers: {
              Authorization: accessToken,
            },
          });
        } catch (e) {
          console.log(e);
        }
        if (
          token &&
          token.data &&
          token.data.data &&
          token.data.data.access_token
        ) {
          axiosApiInstance.access_token = `Bearer ${token.data.data.access_token}`;
          newConfig.headers["Authorization"] = axiosApiInstance.access_token;
          return newConfig;
        } else {
          axiosApiInstance.access_token = "";
        }
      }
      newConfig.headers["Authorization"] = accessToken;
    }
    return newConfig;
  },
  (error) => {
    Promise.reject(error);
  }
);
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    Promise.reject(error);
  }
);
export function isFreshToken(accessToken) {
  if (typeof accessToken === "string" && accessToken) {
    let jwtToken = accessToken.substring(7);
    let tokenArr = jwtToken.split(".");
    let tokenObj = parseJwt(tokenArr[1]);
    let accessExpiredAt = tokenObj.access_expired_at * 1000;
    if (moment.utc().isAfter(moment(accessExpiredAt).utc())) {
      return false;
    }
    return true;
  }
  return false;
}

export default axiosApiInstance;
