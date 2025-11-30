import { GenFunMemeReq } from './model'
import { LLMClient } from '../llm/client'
import { toLLMPrompt } from '../llm/prompt'
import { LLMResponse } from '../llm/model'
import { env, Env } from 'bun'

export class MemeCoinService {
  private readonly llmClient: LLMClient
  constructor(llmClient: LLMClient) {
    this.llmClient = llmClient
  }

  generateMemePrompt = async (req: GenFunMemeReq): Promise<LLMResponse> => {
    const response = await this.llmClient.genMemeCoin(toLLMPrompt(req))
    console.log(response)
    return response
  }
}
