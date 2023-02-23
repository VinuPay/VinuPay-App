import {ViteClient} from '../Onoffchain.js';
import {connectEvents} from './index.js';

export function uint8ToBase64(u8Arr) {
  const CHUNK_SIZE = 0x8000; // arbitrary number
  let index = 0;
  const length = u8Arr.length;
  let result = '';
  let slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}


export async function isTransactionSuccess(send) {
  const block = await ViteClient.request('ledger_getAccountBlockByHash', [send]);
  if (block.receiveBlockHash === null) {
    return 'N/A';
  }
  const receiveBlock = await ViteClient.request('ledger_getAccountBlockByHash', [block.receiveBlockHash]);
  const dataBuffer = Buffer.from(receiveBlock.data || '', 'base64')[32];
  if (dataBuffer === 0) {
    connectEvents.emit('transactionSuccess');
    return true;
  } else {
    connectEvents.emit('transactionFailed');
    return false;
  }
}
