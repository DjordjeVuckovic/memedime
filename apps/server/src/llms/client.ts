import { LLMPrompt, LLMResponse, LLMProvider, LLMOptions } from './schema'
import { createXai } from '@ai-sdk/xai'
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai'
import { createOllama, ollama } from 'ollama-ai-provider-v2';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createGroq, groq } from '@ai-sdk/groq';

export interface LLMClient {
  genMemeCoin(prompt: LLMPrompt): Promise<LLMResponse>
}


export const createLLMClient = (options: LLMOptions): LLMClient => {
  return {
    async genMemeCoin(prompt: LLMPrompt): Promise<LLMResponse> {
      try {
        const { text, sources } = await generateText({
          prompt: prompt.text,
          temperature: 0.9,
          maxOutputTokens: 600,
          ...buildModel(options),
          providerOptions: {
            groq: {

            }
          }
        })
        return { text }
      } catch (error) {
        console.error('Error generating memecoins coin prompt:', error)
        throw error
      }
    },
  }
}

const buildModel = (options: LLMOptions) => {
  const { provider } = options

  switch (provider) {
    case 'xai':
      return buildXaiModel(options)
    case 'openai':
      return buildOpenAIModel(options)
    case 'ollama':
      return buildOllamaModel(options)
    case 'openrouter':
      return buildOpenRouterModel(options)
    case 'groq':
      return buildGroqModel(options)
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`)
  }
}

const buildXaiModel = (options: LLMOptions) => {
  const { modelId, apiKey } = options

  const xai = createXai({
    apiKey,
  });

  let model = xai(modelId);

  return {
    model,
  }
}

const buildOpenAIModel = (options: LLMOptions) => {
  const { modelId, apiKey, baseURL } = options

  const openAi = createOpenAI({
    apiKey,
    baseURL
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

  let model = ollama(modelId);

  return {
    model
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
