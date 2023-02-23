// VitePassport thing
import {resolveAwaitConnectionPromise, connectEvents} from './index.js';
import {isTransactionSuccess, uint8ToBase64} from './utils.js';
import BigNumber from 'bignumber.js';
import toast from 'react-hot-toast';
import Bridge from '@vite/bridge';
import * as utils from '@vite/vitejs-utils';
const bridge = new Bridge();
let isConnected = false;
export function viteBridgeAvailable() {
  try {
    return Bridge.enabled;
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
  connectEvents.emit('connect'); // Emit event
}
export async function sendAccountBlock(block) {
  try {
    const uri = utils.uriStringify({
      target_address: block.toAddress,
      function_name: 'VinuPay Call',
      params: {
        tti: block.tokenId,
        amount: block.amount,
        data: block.data.toString(),
      },
    });
    return await bridge['wallet.sendTxByURI']({
      address: await getConnectedAddress(),
      uri: uri,
    });
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function sendTransaction(block, waitingToast) {
  // We need to fix the stupid decimal thing
  try {
    block.amount = new BigNumber(block.amount).shiftedBy(-18).toFixed();
    block.data = uint8ToBase64(block.data);
    // noinspection DuplicatedCode
    return new Promise(async (resolve, reject) => {
      const send = await sendAccountBlock(block);
      connectEvents.emit('transactionApproved');

      toast.loading('Waiting for transaction to be confirmed', {id: waitingToast});
      // Check every 1 second
      const interval = setInterval(async () => {
        const result = await isTransactionSuccess(send.hash);
        if (result === true) {
          toast.success('Transaction completed', {id: waitingToast, icon: '🔥'});
          clearInterval(interval);
          resolve(send.hash);
        } else if (result === false) {
          toast.error('Transaction failed!', {id: waitingToast, icon: '👎'});
          clearInterval(interval);
          reject(new Error('Transaction Failed'));
        }
      }, 1000);
    });
  } catch (e) {
    toast.error(`Transaction failed: ${e.message}`, {id: waitingToast});
    throw new Error(e.message);
  }
}
