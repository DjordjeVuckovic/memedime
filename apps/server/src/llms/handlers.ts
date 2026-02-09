import { CoinVibe, VibeInfo, getShippedVibes, getVibeInfo } from '@memedime/contracts'

export const getVibes = (): VibeInfo[] => {
  return getShippedVibes()
}

export const getVibe = (id: CoinVibe): VibeInfo => {
  return getVibeInfo(id)
}