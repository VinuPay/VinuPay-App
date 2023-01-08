// VitePassport thing
import {resolveAwaitConnectionPromise, connectEvents} from "./index.js";
import {isTransactionSuccess, Uint8ToBase64} from "./utils.js";
import toast from "react-hot-toast";

let isConnected = false;
export function vitePassportAvailable() {
    return window.vitePassport !== undefined;
}
export function isPassportConnected() {
    return isConnected;
}
export async function getConnectedAddress() {
    return await window.vitePassport.getConnectedAddress();
}
export async function connectWallet() {
    return await window.vitePassport.connectWallet();
}
export async function sendAccountBlock(block) {
    try {
        const params = [
            'send',
            block
        ]
        return await window.vitePassport.writeAccountBlock(...params);
    } catch (e) {
        throw new Error(e.message);
    }
}

export async function sendTransaction(block,waitingToast) {
    return await sendAccountBlock(block).then((f) => {

        connectEvents.emit("transactionApproved"); // Emit event
        toast.loading("Waiting for transaction to be confirmed", {id: waitingToast}); // Update toast

        // Check every 1 second if the transaction is confirmed
        const interval = setInterval(async () => {
            const result = await isTransactionSuccess(f.block.hash);
            if (result === true) {

                toast.success("Transaction completed", {id: waitingToast, icon: "🔥"});
                clearInterval(interval);

            } else if (result === false) {

                toast.error("Transaction failed!", {id: waitingToast, icon: "👎"});
                clearInterval(interval);

            }
        }, 1000)


    }).catch((e) => {
        toast.error(`Transaction failed: ${e.message}`, {id: waitingToast}); // Error
    })

}


try {
    window.vitePassport.on('accountChange', (obj) => {
        console.log(obj.activeAddress);
        if (obj.activeAddress !== undefined) {
            isConnected = true;
            resolveAwaitConnectionPromise();
        } else {
            isConnected = false;
            // HANDLE DISCONNECT
        }
    })
} catch (e) {
    console.log(e);
}
