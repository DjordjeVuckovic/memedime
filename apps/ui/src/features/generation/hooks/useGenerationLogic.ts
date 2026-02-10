import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useToast } from '@/components/ui/toast'
import { useGenerateCoin } from '@/routes/coins/-queries.ts'
import type { Mode } from '@memedime/contracts'

interface UseGenerationLogicOptions {
  mode?: Mode
  onError?: (error: Error) => void
}

export function useGenerationLogic({ mode: _mode, onError }: UseGenerationLogicOptions) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [showResult, setShowResult] = useState(false)

  const generateMutation = useGenerateCoin({
    onError: (error) => {
      console.error('Failed to generate coin:', error)
      showToast(`FAILED TO GENERATE COIN: ${error.message.toUpperCase()}`, 'error')
      setShowResult(false)
      onError?.(error)
    },
  })

  useEffect(() => {
    if (generateMutation.isSuccess && generateMutation.data && !showResult) {
      setShowResult(true)
    }
  }, [generateMutation.isSuccess, generateMutation.data, showResult])

  const handleViewDetails = useCallback(() => {
    if (generateMutation.data) {
      void navigate({ to: '/coins/$coinId', params: { coinId: String(generateMutation.data.id) } })
    }
  }, [navigate, generateMutation.data])

  const handleGenerateAnother = useCallback(() => {
    setShowResult(false)
    generateMutation.reset()
  }, [generateMutation])

  const generatedCoin = generateMutation.data
    ? {
        name: generateMutation.data.name,
        ticker: generateMutation.data.ticker,
        tagline: generateMutation.data.tagline,
        combos: generateMutation.data.combos!,
      }
    : null

  return {
    showResult,
    generateMutation,
    generatedCoin,
    handleViewDetails,
    handleGenerateAnother,
  }
}
