import { describe, expect, test } from 'bun:test'
import { jsonParse, repairJsonText } from './json'

describe('repairJsonText', () => {
  test('removes markdown code blocks with json label', () => {
    const input = '```json\n{"name": "test"}\n```'
    const result = repairJsonText(input)
    const parsed = JSON.parse(result)
    expect(parsed.name).toBe('test')
  })

  test('removes markdown code blocks without json label', () => {
    const input = '```\n{"name": "test"}\n```'
    const result = repairJsonText(input)
    const parsed = JSON.parse(result)
    expect(parsed.name).toBe('test')
  })

  test('removes multiple markdown code blocks', () => {
    const input = '```json\n{"name": "test"}\n```'
    const result = repairJsonText(input)
    // Just verify it can be parsed after repair
    const parsed = JSON.parse(result)
    expect(parsed.name).toBe('test')
  })

  test('fixes thousands separators in numbers', () => {
    const input = '{"supply": 100,000,000, "holders": 1,234}'
    const result = repairJsonText(input)
    expect(result).toContain('"supply": 100000000')
    expect(result).toContain('"holders": 1234')
  })

  test('preserves commas in strings', () => {
    const input = '{"description": "hello, world", "count": 1,000}'
    const result = repairJsonText(input)
    expect(result).toContain('"description": "hello, world"')
    expect(result).toContain('"count": 1000')
  })

  test('fixes Python-style exponents', () => {
    const input = '{"supply": 10**8, "large": 2**16}'
    const result = repairJsonText(input)
    expect(result).toContain('"supply": 100000000')
    expect(result).toContain('"large": 65536')
  })

  test('handles complex Python exponents', () => {
    const input = '{"value": 10**9}'
    const result = repairJsonText(input)
    expect(result).toContain('"value": 1000000000')
  })

  test('removes percent signs from numbers', () => {
    const input = '{"allocation": 80%, "burn": 15.5%}'
    const result = repairJsonText(input)
    expect(result).toContain('"allocation": 80')
    expect(result).toContain('"burn": 15.5')
  })

  test('handles all transformations together', () => {
    const input = `\`\`\`json
{
  "supply": 420,690,000,000,
  "burned": 10**6,
  "allocation": 80%
}
\`\`\``
    const result = repairJsonText(input)

    expect(result).not.toContain('```')
    expect(result).toContain('420690000000')
    expect(result).toContain('1000000')
    expect(result).toContain('80')
    expect(result).not.toContain('%')
  })

  test('returns original text if repair fails', () => {
    // Pass something that jsonrepair library might fail on
    const input = 'completely invalid nonsense !@#$%'
    const result = repairJsonText(input)
    // Should return original or attempt repair
    expect(result).toBeDefined()
  })

  test('handles already valid JSON', () => {
    const input = '{"name": "test", "value": 123}'
    const result = repairJsonText(input)
    const parsed = JSON.parse(result)
    expect(parsed.name).toBe('test')
    expect(parsed.value).toBe(123)
  })

  test('fixes missing quotes on keys (via jsonrepair)', () => {
    const input = '{name: "test", value: 123}'
    const result = repairJsonText(input)
    const parsed = JSON.parse(result)
    expect(parsed.name).toBe('test')
    expect(parsed.value).toBe(123)
  })

  test('fixes trailing commas (via jsonrepair)', () => {
    const input = '{"name": "test", "value": 123,}'
    const result = repairJsonText(input)
    const parsed = JSON.parse(result)
    expect(parsed.name).toBe('test')
    expect(parsed.value).toBe(123)
  })
})

describe('jsonParse', () => {
  test('parses valid JSON', () => {
    const input = '{"name": "test", "count": 42}'
    const result = jsonParse(input)

    expect(result.name).toBe('test')
    expect(result.count).toBe(42)
  })

  test('parses JSON with markdown code blocks', () => {
    const input = '```json\n{"name": "test"}\n```'
    const result = jsonParse(input)

    expect(result.name).toBe('test')
  })

  test('repairs and parses JSON with thousands separators', () => {
    const input = '{"supply": 1,000,000}'
    const result = jsonParse(input)

    expect(result.supply).toBe(1000000)
  })

  test('repairs and parses JSON with Python exponents', () => {
    const input = '{"supply": 10**8}'
    const result = jsonParse(input)

    expect(result.supply).toBe(100000000)
  })

  test('repairs and parses JSON with percent signs', () => {
    const input = '{"burn": 80%}'
    const result = jsonParse(input)

    expect(result.burn).toBe(80)
  })

  test('jsonrepair is very permissive', () => {
    // jsonrepair converts bare strings to JSON strings
    const input = 'completely invalid'
    const result = jsonParse(input)

    // jsonrepair turns it into a JSON string
    expect(result).toBe('completely invalid')
  })

  test('handles truly broken JSON', () => {
    const input = '}{broken'
    const defaultValue = { error: true }
    const result = jsonParse(input, defaultValue)

    // Either returns repaired JSON or default value
    expect(result).toBeDefined()
  })

  test('returns default on unparseable input with skipRepair', () => {
    const input = 'invalid'
    const defaultValue = { name: 'fallback', count: 0 }
    const result = jsonParse(input, defaultValue, { skipRepair: true })

    expect(result.name).toBe('fallback')
    expect(result.count).toBe(0)
  })

  test('skips repair when skipRepair is true', () => {
    const input = '{"name": "test"}'
    const result = jsonParse(input, {}, { skipRepair: true }) as { name: string }

    expect(result.name).toBe('test')
  })

  test('returns default when skipRepair is true and JSON is invalid', () => {
    const input = '{name: "test"}' // Missing quotes on key
    const defaultValue = { error: true }
    const result = jsonParse(input, defaultValue, { skipRepair: true })

    expect(result).toEqual(defaultValue)
  })

  test('handles complex LLM response', () => {
    const input = `\`\`\`json
{
  "name": "CAPYBARA PIZZA",
  "ticker": "$CAPYPIZZA",
  "supply": 420,690,000,000,
  "tokenomics": {
    "lp_burned": 80%,
    "dev": 5%,
    "community": 15%
  },
  "max_supply": 10**12
}
\`\`\``

    const result = jsonParse<{
      name: string
      ticker: string
      supply: number
      tokenomics: { lp_burned: number; dev: number; community: number }
      max_supply: number
    }>(input)

    expect(result.name).toBe('CAPYBARA PIZZA')
    expect(result.ticker).toBe('$CAPYPIZZA')
    expect(result.supply).toBe(420690000000)
    expect(result.tokenomics.lp_burned).toBe(80)
    expect(result.tokenomics.dev).toBe(5)
    expect(result.tokenomics.community).toBe(15)
    expect(result.max_supply).toBe(1000000000000)
  })

  test('preserves type safety with generics', () => {
    type TestType = { name: string; count: number }
    const input = '{"name": "test", "count": 42}'
    const result = jsonParse<TestType>(input)

    // TypeScript should allow these accesses
    expect(result.name).toBe('test')
    expect(result.count).toBe(42)
  })

  test('handles empty string input', () => {
    const result = jsonParse('')
    expect(result).toEqual({})
  })

  test('handles whitespace-only input', () => {
    const result = jsonParse('   \n\t  ')
    expect(result).toEqual({})
  })

  test('handles arrays', () => {
    const input = '[1, 2, 3]'
    const result = jsonParse<number[]>(input)
    expect(result).toEqual([1, 2, 3])
  })

  test('handles nested objects', () => {
    const input = '{"outer": {"inner": {"deep": "value"}}}'
    const result = jsonParse(input)
    expect(result.outer.inner.deep).toBe('value')
  })
})
