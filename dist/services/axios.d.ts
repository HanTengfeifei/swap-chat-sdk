export function parseJwt(str: any): any;
export function isFreshToken(accessToken: any): boolean;
export function tokenMgr(): {
    getToken: (type?: string) => string;
    setToken: (v?: string) => void;
};
export default axiosApiInstance;
declare const axiosApiInstance: import("axios").AxiosInstance;
