import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import api from '../lib/api';
import { ClientWrapper } from '../components/vendor/ClientWrapper';

export const Route = createFileRoute('/$vendorSlug')({
  component: VendorPage,
})

function VendorPage() {
  const { vendorSlug } = useParams({ from: '/$vendorSlug' })

  const { data, isLoading, error } = useQuery({
    queryKey: ['vendor', vendorSlug],
    queryFn: async () => {
      const response = await api.get(`/public/menu/${vendorSlug}`)
      return response.data
    },
  })

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading menu...</div>
  if (error || !data) return <div className="p-8 text-center text-red-500">Vendor not found</div>

  return (
    <ClientWrapper
      brand={data.brand}
      dishes={data.dishes}
      statuses={data.statuses}
    />
  )
}
