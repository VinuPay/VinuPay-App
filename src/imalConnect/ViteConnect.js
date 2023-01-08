import Connector from '@vite/connector';
import toast from "react-hot-toast";
const bridge = /*'wss://viteconnect.thomiz.dev';*/ "wss://biforst.vite.net";
import {isTransactionSuccess, Uint8ToBase64} from "./utils.js";
export let vcI = new Connector({ bridge });
import {connectEvents, resolveAwaitConnectionPromise} from "./index.js";
// noinspection JSUnresolvedVariable

// If viteconnect is connected
export function isConnected() {
    return vcI.connected;
}
export function restart() {
    vcI = new Connector({ bridge });
    vcI.on('connect', () => {
        resolveAwaitConnectionPromise();
    });
}
export function getConnectionUri() {
    return vcI.uri
}
export function getConnectedAddress() {
    if (vcI.connected) {
        return vcI.accounts[0];
    } else {
        throw new Error('Not connected');
    }
}

export async function sendAccountBlock(block) {
    return await vcI.sendCustomRequest({method: 'vite_signAndSendTx' , params: [{block: block}]});
}

export async function sendTransaction(block, waitingToast) {
    return await sendAccountBlock(block).then((f) => {

        connectEvents.emit("transactionApproved");
        toast.loading("Waiting for transaction to be confirmed", {id: waitingToast});

        // Check every 1 second
        const interval = setInterval(async () => {
            const result = await isTransactionSuccess(f.hash);
            if (result === true) {
                toast.success("Transaction completed", {id: waitingToast, icon: "🔥"});
                clearInterval(interval);
            } else if (result === false) {
                toast.error("Transaction failed!", {id: waitingToast, icon: "👎"});
                clearInterval(interval);
            }
        }, 1000)
    }).catch((e) => {
        console.log(e);
        toast.error(`Transaction failed: ${e.message}`, {id: waitingToast});
    })
}

// Promise with external resolve and reject
