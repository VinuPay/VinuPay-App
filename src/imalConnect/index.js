// Main thing for everything
// noinspection JSUnresolvedFunction,JSUnresolvedVariable

import * as ViteConnect from './ViteConnect.js';
import * as VitePassport from './VitePassport.js';
import * as ViteBridge from './ViteBridge.js';
import toast from 'react-hot-toast';
import {vcI} from './ViteConnect.js';
import events from 'events';
// Connection promise
export let resolveAwaitConnectionPromise;
export let rejectAwaitConnectionPromise;
export let connectionMethod = 0; // 1 => ViteConnect, 2 => VitePassport
export let awaitConnectionPromise = new Promise((resolve, reject) => {
  resolveAwaitConnectionPromise = resolve;
  rejectAwaitConnectionPromise = reject;
});

export function resetConnectionPromise() {
  awaitConnectionPromise = new Promise((resolve, reject) => {
    resolveAwaitConnectionPromise = resolve;
    rejectAwaitConnectionPromise = reject;
  });
}

// Get which options are available for connection
export function getConnectionOptions() {
  const passport = VitePassport.vitePassportAvailable();
  const bridge = ViteBridge.viteBridgeAvailable();
  return {
    passport: passport,
    connect: true,
    viteBridge: bridge,
  };
}
export function isConnected() {
  // Check for all connection methods

  if (VitePassport.vitePassportAvailable() === true && VitePassport.isPassportConnected() === true) {
    return true;
  } else if (ViteConnect.isConnected() === true) {
    return true;
  } else if (ViteBridge.isBridgeConnected() === true) {
    return true;
  } else {
    return false;
  }
}
export async function sendAccountBlock(block) {
  console.log(block);
  const waitingToast = toast.loading('Complete the transaction in your Vite wallet');
  if (VitePassport.vitePassportAvailable() === true && VitePassport.isPassportConnected() === true) {
    return await VitePassport.sendTransaction(block, waitingToast);
  } else if (ViteConnect.isConnected() === true) {
    return await ViteConnect.sendTransaction(block, waitingToast);
  } else if (ViteBridge.isBridgeConnected() === true) {
    return await ViteBridge.sendTransaction(block, waitingToast);
  } else {
    throw new Error('Not connected');
  }
}


export async function getConnection(shouldToast = false) {
  // Check if connected
  if (vcI.connected) {
    throw new Error('Already connected with ViteConnect');
  }
  if (VitePassport.vitePassportAvailable()) {
    if (VitePassport.isPassportConnected()) throw new Error('Already connected with VitePassport');
  }
  if (ViteBridge.isBridgeConnected()) throw new Error('Already connected with ViteBridge');
  // Means we're not connected
  resetConnectionPromise();
  if (shouldToast) {
    toast.promise(awaitConnectionPromise, {
      loading: 'Waiting for connection...',
      success: 'Connected!',
      error: (msg) => `Connection failed. ${msg}`,
    });
  }
  // ViteConnect session
  ViteConnect.restart();
  // We need to replace event listeners
  vcI.on('connect', () => {
    if (connectionMethod !== 2 || connectionMethod !== 3) connectionMethod = 1; connectEvents.emit('connect');
  });
  vcI.on('disconnect', () => {
    connectionMethod = 0;
    connectEvents.emit('disconnect');
  });

  await vcI.createSession();
  console.log(vcI.uri);
  return {
    vcUri: vcI.uri,
    passport: VitePassport.vitePassportAvailable(),
    viteBridge: ViteBridge.viteBridgeAvailable(),
  };
}

export async function getConnectedAddress() {
  if (connectionMethod === 1) {
    return ViteConnect.getConnectedAddress();
  } else if (connectionMethod === 2) {
    return await VitePassport.getConnectedAddress();
  } else if (connectionMethod === 3) {
    return await ViteBridge.getConnectedAddress();
  }
}
export async function connectWithPassport() {
  if (VitePassport.vitePassportAvailable()) {
    console.log(await VitePassport.connectWallet());
  }
}
export async function connectWithViteBridge() {
  if (await ViteBridge.viteBridgeAvailable()) {
    connectionMethod = 3;
    ViteBridge.connectWallet();
  } else {
    console.log('vite bridge not available');
  }
}
export const connectEvents = new events.EventEmitter();


try {
  window.vitePassport.on('accountChange', (obj) => {
    if (obj.activeAddress !== undefined) {
      if (connectionMethod !== 1 || connectionMethod !== 3) connectionMethod = 2; connectEvents.emit('connect');
    } else {
      connectionMethod = 0;
      connectEvents.emit('disconnect');
      // HANDLE DISCONNECT
    }
  });
} catch (e) {
  console.log(e);
}

connectEvents.on('disconnect', () => {
  toast.dismiss();
  toast('Disconnected from wallet', {
    icon: '🔌',
  });
});

