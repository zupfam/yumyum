'use client';

import { AddStatusForm } from '@/components/features/dashboard/status/AddStatusForm';
import { StatusList } from '@/components/features/dashboard/status/StatusList';
import { VendorMapping } from '@/lib/types';
import { createClient } from '@/lib/supabase/utils/client';
import { useEffect, useState } from 'react';

/**
 * The main dashboard page for status management.
 * It fetches the current vendor's mapping data to retrieve the
 * correct ImageKit account ID and then renders the form and list components.
 */
export default function StatusDashboardPage() {
  const [vendorMapping, setVendorMapping] = useState<VendorMapping | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Fetches the vendor mapping for the currently authenticated user.
    const fetchVendorMapping = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // We query the public.vendor_mappings table in the primary Supabase project
        const { data } = await supabase.from('vendor_mappings').select('*').eq('auth_user_id', user.id).single();
        setVendorMapping(data as VendorMapping | null);
      }
    };
    fetchVendorMapping();
  }, [supabase]);

  // Display a loading state while fetching the vendor mapping
  if (!vendorMapping) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Manage Statuses</h1>
      <p className="text-muted-foreground">
        Add text, image, or video statuses to appear on your public menu page.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <AddStatusForm imagekit_account_id={vendorMapping.imagekit_account_id} />
        <StatusList />
      </div>
    </div>
  );
}