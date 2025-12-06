import { CoinResp } from './schemas'

export const memeCoinResponseExample: CoinResp = {
  name: 'catchy meme name',
  ticker: '$SYMBOL',
  tagline: 'makes degens ape',
  description: 'funny + specific + crypto-native. 2-4 sentences.',
  supply: '69000000',
  tokenomics: {
    lpBurnPercentage: '%',
    devPercentage: '%',
    marketingFeePercentage: '%',
    communityFeePercentage: '%',
  },
  marketing: 'unhinged but believable strategy',
}
