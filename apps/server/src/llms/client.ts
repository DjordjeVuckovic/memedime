import { Prompt, LLMOptions, LLMCoinRespSchema, LLMCoinResp } from './schemas'
import { createXai } from '@ai-sdk/xai'
import { generateObject, generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createOllama } from 'ollama-ai-provider-v2'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createGroq } from '@ai-sdk/groq'
import { MODEL_CAPABILITIES } from './capabilities'
import { jsonParse } from '../shared/json'
import { withEnforcedSchema } from './prompts'
import { memeCoinResponseExample } from './examples'

export interface LLMClient {
  genCoin(prompt: Prompt): Promise<LLMCoinResp>
}

export const createLLMClient = (options: LLMOptions): LLMClient => {
  return {
    async genCoin(prompt: Prompt): Promise<LLMCoinResp> {
      try {
        const modelParams = buildModel(options)

        const capability = MODEL_CAPABILITIES.get(options.modelId)
        if (capability && capability.supportJsonSchema) {
          const { object, usage, finishReason } = await generateObject({
            prompt: prompt.text,
            schema: LLMCoinRespSchema,
            temperature: 0.9,
            maxOutputTokens: 600,
            ...modelParams,
          })

          console.log({ usage, finishReason })

          return LLMCoinRespSchema.parse(object)
        }

        const finalPrompt = withEnforcedSchema<typeof LLMCoinRespSchema>(
          prompt,
          memeCoinResponseExample
        ).text

        const { text, usage, finishReason } = await generateText({
          prompt: finalPrompt,
          temperature: 0.9,
          maxOutputTokens: 600,
          ...modelParams,
        })

        console.log({ text, usage, finishReason })

        return LLMCoinRespSchema.parse(jsonParse(text))
      } catch (error) {
        console.error('Error generating coins coin prompt:', error)
        throw error
      }
    },
  }
}

const buildModel = (options: LLMOptions) => {
  const { provider } = options
  switch (provider) {
    case 'groq':
      return buildGroqModel(options)
    case 'xai':
      return buildXaiModel(options)
    case 'openai':
      return buildOpenAIModel(options)
    case 'ollama':
      return buildOllamaModel(options)
    case 'openrouter':
      return buildOpenRouterModel(options)
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`)
  }
}

const buildGroqModel = (options: LLMOptions) => {
  const { modelId, apiKey } = options

  const groq = createGroq({
    apiKey,
  })

  let model = groq(modelId)

  return {
    model,
  }
}

const buildXaiModel = (options: LLMOptions) => {
  const { modelId, apiKey } = options

  const xai = createXai({
    apiKey,
  })

  let model = xai(modelId)

  return {
    model,
  }
}

const buildOpenAIModel = (options: LLMOptions) => {
  const { modelId, apiKey, baseURL } = options

  const openAi = createOpenAI({
    apiKey,
    baseURL,
  })

  let model = openAi(modelId)

  return {
    model,
  }
}

const buildOllamaModel = (options: LLMOptions) => {
  const { modelId, baseURL } = options

  const ollama = createOllama({
    baseURL,
  })

  let model = ollama(modelId)

  return {
    model,
  }
}

const buildOpenRouterModel = (options: LLMOptions) => {
  const { modelId, apiKey } = options

  const openRouter = createOpenRouter({
    apiKey,
  })

  let model = openRouter(modelId)

  return {
    model,
  }
}
