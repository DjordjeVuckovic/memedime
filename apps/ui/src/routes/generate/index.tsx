import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/generate/')({
  component: GenerateIndexPage,
})

function GenerateIndexPage() {
  return <Navigate to="/generate/random" />
}