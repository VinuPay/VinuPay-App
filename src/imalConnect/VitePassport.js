// VitePassport thing
import {resolveAwaitConnectionPromise, connectEvents} from './index.js';
import {isTransactionSuccess} from './utils.js';
import toast from 'react-hot-toast';

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
      block,
    ];
    return await window.vitePassport.writeAccountBlock(...params);
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function sendTransaction(block, waitingToast) {
  try {
    return new Promise(async (resolve, reject) => {
      const send = await sendAccountBlock(block);
      connectEvents.emit('transactionApproved');

      toast.loading('Waiting for transaction to be confirmed', {id: waitingToast});
      // Check every 1 second
      const interval = setInterval(async () => {
        const result = await isTransactionSuccess(send.block.hash);
        if (result === true) {
          toast.success('Transaction completed', {id: waitingToast, icon: '🔥'});
          clearInterval(interval);
          resolve(send.block.hash);
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
  });
} catch (e) {
  console.log(e);
}
