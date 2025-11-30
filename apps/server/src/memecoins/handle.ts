import { GenFunMemeReq } from './schema'
import { LLMClient } from '../llms/client'
import { toLLMPrompt } from '../llms/prompt'
import { LLMResponse } from '../llms/schema'

export const generateMemeCoin = async (req: GenFunMemeReq, llmClient: LLMClient): Promise<LLMResponse> => {
  const response = await llmClient.genMemeCoin(toLLMPrompt(req))
  console.log(response)
  return response
}
