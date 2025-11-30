import { GenFunMemeReq } from '../memecoins/schema'
import { LLMPrompt } from './schema'

export const toLLMPrompt = (req: GenFunMemeReq): LLMPrompt => {
  const { prompt: userPrompt, combos } = req;
  const comboStr = combos.map(c => `${c.emoji} ${c.name}`).join(' + ');
  const prompt = `you're a degen meme coin creator. 3am energy drink hours. you've been rugged 47 times but still believe.

  just rolled: ${comboStr}
  ${userPrompt ? `vibe: "${userPrompt}"\n` : ''}
  create a meme coin that makes degens NEED to ape.
  
  rules:
  - actually FUNNY
  - use ALL emojis meaningfully  
  - feels REAL (could be on pump.fun)
  - specific details > vague bs
  - self-aware + unhinged
  ${userPrompt ? `- incorporate: "${userPrompt}"\n` : ''}
  output ONLY json (no markdown):
  {
    "name": "catchy meme name",
    "ticker": "$SYMBOL",
    "tagline": "makes degens ape",
    "concept": "funny + specific + crypto-native. 3-4 sentences.",
    "supply": "creative meme number",
    "tokenomics": {"lp_burned": "%", "dev": "%", "marketing": "%", "community": "%"},
    "marketing": "unhinged but believable strategy"
  }
  
  make it FIRE. go.`;

  return {
    text: prompt
  }
}
