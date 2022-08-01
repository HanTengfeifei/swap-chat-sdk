import axiosApiInstance from './axios'
// import type {
//   GetLoginRandomSecretParams,
//   GetLoginRandomSecretResponse,
//   LoginParams,
//   LoginResponse,
//   GetRoomsParams,
//   GetRoomsResponse
// } from './type'
export async function register(params) {
    return await axiosApiInstance.post("/register", params);
  }
export async function getOpenSeaInfo(params) {
    return await axiosApiInstance.post("/opensea_user_info", params);
  }
export async function getLoginRandomSecret (params) {
    return await axiosApiInstance.post('/login_random_secret', params)
}
export async function login (params) {
  return await axiosApiInstance.post('/login', params)
}
export async function getRooms(
  params
) {
  return await axiosApiInstance.post("/rooms", params);
}
export async function createThreads(
  params
) {
  return await axiosApiInstance.post("/threads", params);
}