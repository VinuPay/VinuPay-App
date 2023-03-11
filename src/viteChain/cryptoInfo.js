import {ViteClient} from '../Onoffchain';
const url = 'https://vite-api.thomiz.dev/crypto-info/tokens';
// eslint-disable-next-line max-len
const placeholder = 'https://www.wikihow.com/images/thumb/f/f8/End-a-Placeholder-Relationship-Step-13-Version-2.jpg/aid13103974-v4-1200px-End-a-Placeholder-Relationship-Step-13-Version-2.jpg';
// No default export because I may add something here later
export async function getTokenIcon(tokenId) {
  try {
    // We will fetch png icons from thomiz's api (with permission btw)
    const response = await fetch(url + `/${tokenId}/details`);
    if (response.status === 400) {
      console.log('Token not found, returning placeholder');
      // Token not found
      return placeholder;
    } else if (response.status === 200) {
      const data = await response.json();
      return data.data.urlIcon;
    } else {
      console.log('Unknown error. Returning placeholder image');
      return placeholder;
    }
  } catch (e) {
    console.log('Encountered an issue while getting the token icon');
  }
}
export async function getTokenInfo(tokenId) {
  try {
    const token = await ViteClient.request('mintage_getTokenInfoById', [tokenId]);
    if (token === null) {
      throw new Error('Token not found');
    }
    console.log(token);
    return token;
  } catch (e) {
    console.error(e);
    console.log('Encountered an issue while getting the token icon');
  }
}
