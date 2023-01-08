// VitePassport thing
import {resolveAwaitConnectionPromise, connectEvents, connectionMethod} from "./index.js";
import {isTransactionSuccess, Uint8ToBase64} from "./utils.js";
import BigNumber from "bignumber.js";
import toast from "react-hot-toast";
import Bridge from '@vite/bridge'
import * as utils from "@vite/vitejs-utils";
const bridge = new Bridge()
let isConnected = false;
export function viteBridgeAvailable() {
    try {
        return Bridge.enabled
    } catch (e) {
        return false;
    }
}
export function isBridgeConnected() {
    return isConnected;
}
export async function getConnectedAddress() {
    return await bridge['wallet.currentAddress']();
}
export function connectWallet() {
    resolveAwaitConnectionPromise();
    isConnected = true;
    connectEvents.emit("connect"); // Emit event
}
export async function sendAccountBlock(block) {
    try {
        const uri = utils.uriStringify({
            target_address: block.toAddress,
            function_name: 'VinuPay Call',
            params: {
                tti: block.tokenId,
                amount: block.amount,
                data: block.data.toString()
            }
        })
        return await bridge['wallet.sendTxByURI']({
          address: await getConnectedAddress(),
            uri: uri
        });

    } catch (e) {
        throw new Error(e.message);
    }
}

export async function sendTransaction(block,waitingToast) {
    // We need to fix the stupid decimal thing
    block.amount = new BigNumber(block.amount).shiftedBy(-18).toFixed();
    block.data = Uint8ToBase64(block.data);
    return await sendAccountBlock(block).then((f) => {

        connectEvents.emit("transactionApproved"); // Emit event
        toast.loading("Waiting for transaction to be confirmed", {id: waitingToast}); // Update toast

        // Check every 1 second if the transaction is confirmed
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
        toast.error(`Transaction failed: ${e.message}`, {id: waitingToast}); // Error
    })

}