export default SwapChatSdk;
declare class SwapChatSdk {
    constructor(content: any, container: any, options?: {}, params?: {});
    defaultOptions: Object | undefined;
    defaultParams: Object | undefined;
    status: boolean | undefined;
    contentWrapper: any;
    button: string | undefined;
    container: any;
    exect(): void;
    creactIframeUrl(): Promise<string | undefined>;
    creatClientBox(): Promise<void>;
    currentMessageBoxEle: ChildNode | null | undefined;
    creatClient(): Promise<void>;
    closeClient(): void;
}
declare namespace SwapChatSdk {
    export { merge };
    export { mergeConfig };
}
import { merge } from "./utils";
import { mergeConfig } from "./utils";
