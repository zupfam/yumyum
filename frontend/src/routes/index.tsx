import { createFileRoute } from '@tanstack/react-router'
import { PortalView } from '../components/portal/PortalView'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-white">
      <PortalView />
    </div>
  )
}
