import type { Prompt, LLMOptions, LLMCoinResp } from './schemas'
import { LLMCoinRespSchema } from './schemas'
import { createXai } from '@ai-sdk/xai'
import { generateObject, generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createOllama } from 'ollama-ai-provider-v2'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { createGroq } from '@ai-sdk/groq'
import { MODEL_CAPABILITIES } from './capabilities'
import { jsonParse } from './json'
import { pipe } from './types'
import { withEnforcedSchema } from './prompts'
import { memeCoinResponseExample } from './examples'
import { logger } from './logger'
import { GenerationError } from './errors'

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

          logger.debug(
            {
              usage,
              finishReason,
              provider: options.provider,
              modelId: options.modelId,
              mode: 'schema',
            },
            'LLM generation completed with schema',
          )

          return pipe(object, (o) => LLMCoinRespSchema.parse(o), validateCoinOutput)
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

        logger.debug(
          {
            usage,
            finishReason,
            responseLength: text.length,
            provider: options.provider,
            modelId: options.modelId,
            mode: 'text',
          },
          'LLM generation completed without schema',
        )

        return pipe(text, jsonParse, (o) => LLMCoinRespSchema.parse(o), validateCoinOutput)
      } catch (error) {
        logger.error(
          {
            err: error,
            provider: options.provider,
            modelId: options.modelId,
            promptLength: prompt.text.length,
          },
          'Failed to generate meme coin from LLM',
        )
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

const BLOCKED_OUTPUT = [/0x[a-fA-F0-9]{40}/, /[1-9A-HJ-NP-Za-km-z]{32,44}/, /https?:\/\//i, /http?:\/\//i]

const validateCoinOutput = (coin: LLMCoinResp): LLMCoinResp => {
  const allText = [coin.name, coin.ticker, coin.tagline, coin.description, coin.marketing]
    .filter(Boolean)
    .join(' ')

  for (const pattern of BLOCKED_OUTPUT) {
    if (pattern.test(allText)) {
      logger.warn({ coinName: coin.name, ticker: coin.ticker }, 'Output contains blocked content (address/URL)')
      throw new GenerationError('Generated coin contains blocked content')
    }
  }

  return coin
}
