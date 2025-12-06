import { GenCoinReq, RandomCoinReq } from '../coins/schemas'
import { Prompt } from './schemas'
import { z } from 'zod'

export const withEnforcedSchema = <T extends z.ZodSchema>(prompt: Prompt, outputFormat: z.infer<T>): Prompt => {
  const { text: basePrompt } = prompt
  const text = `${basePrompt}

    CRITICAL: Return ONLY valid JSON. Use proper JSON syntax:
    - NO markdown code blocks (no \`\`\`json)
    - No trailing commas
    - No comments
    - Numbers without %, **, or other operators
    - ONLY the valid JSON object 
    
    Example format (COPY THIS STRUCTURE EXACTLY):
    ${JSON.stringify(outputFormat, null, 2)}
    IMPORTANT: 
    - tokenomics percentages must add up to 100%
        
    Your JSON response`
  return {
    text,
  }
}

export const toLLMPrompt = (req: RandomCoinReq): Prompt => {
  const { prompt: userPrompt, combos } = req
  const comboStr = Object.keys(combos).map((x) => {
    return `${x}: ${combos[x as keyof typeof combos].emoji} (${combos[x as keyof typeof combos].name})`
  })
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
  
  make it FIRE. go.`

  return {
    text: prompt,
  }
}
