export function getEthAccount(): Promise<{
    address: string;
    balance: number;
    shortAddress: string;
}>;
export function loginAfterSign(res?: string, address?: string, signContent?: string, userAvatar?: string): Promise<string | undefined>;
export function signMetamask(platform?: string): Promise<string | false>;
export function register(params: any): Promise<any>;
export function getOpenSeaInfo(params: any): Promise<any>;
export function creactThreads(params: any): Promise<{
    room_id: any;
    msg_id: any;
} | undefined>;
