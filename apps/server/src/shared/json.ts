import { jsonrepair } from 'jsonrepair'

export type JsonParseOptions = {
  skipRepair: boolean
}

export const jsonParse = <T = any>(
  jsonString: string,
  defaultValue: T = {} as T,
  options: JsonParseOptions = {
    skipRepair: false,
  },
): T => {
  const { skipRepair } = options
  try {
    const cleaned = !skipRepair ? repairJsonText(jsonString) : jsonString

    return JSON.parse(cleaned) as T
  } catch (error) {
    console.error('JSON parse error:', error)
    return defaultValue
  }
}

export const repairJsonText = (jsonString: string): string => {
  try {
    return jsonrepair(repairLLMJson(jsonString))
  } catch (e) {
    console.error('Error repairing JSON text:', e)
    return jsonString
  }
}

const repairLLMJson = (text: string): string => {
  let cleaned = text.trim()

  // Remove md code blocks
  cleaned = cleaned.replace(/```(?:json)?\s*/g, '').replace(/```\s*/g, '')

  // Remove thousands separators in numbers (100,000,000 -> 100000000)
  // This regex looks for numbers with commas that aren't inside strings
  cleaned = cleaned.replace(/:\s*(\d{1,3}(?:,\d{3})+)(?=\s*[,}\]])/g, (match, num) => {
    return ': ' + num.replace(/,/g, '')
  })

  // Fix Python exp (10**8 -> 100000000)
  cleaned = cleaned.replace(/:\s*(\d+)\s*\*\*\s*(\d+)/g, (_, base, exp) => {
    return ': ' + String(Math.pow(Number(base), Number(exp)))
  })

  // Remove bare percent signs (keep the number, json-repair will handle quotes)
  cleaned = cleaned.replace(/:\s*(\d+(?:\.\d+)?)%/g, ': $1')

  return cleaned
}
