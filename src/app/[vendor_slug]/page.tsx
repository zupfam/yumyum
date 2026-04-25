import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Brand, Dish, Status } from '@/lib/types';
import {
  getBrandData as getGsheetsBrandData,
  getDishesData as getGsheetsDishesData,
  getStatusData as getGsheetsStatusData,
} from '@/services/gsheets';
import { getVendorMappingBySlug } from '@/services/vendor';
import { ClientWrapper } from '@/components/vendor/ClientWrapper';
import { createClient } from '@/lib/supabase/utils/server';
import { createVendorClient } from '@/lib/supabase/utils/vendor';

// Server-side data fetching function
async function fetchVendorData(vendor_slug: string) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  const vendorMapping = await getVendorMappingBySlug(vendor_slug);

  if (!vendorMapping) {
    notFound();
  }

  let brandData: Brand | null = null;
  let dishesData: Dish[] = [];
  let statusData: Status | null = null;

  if (vendorMapping.datastore_type === 'supabase') {
    const vendorSupabase = createVendorClient(vendorMapping.datastore_id, cookieStore);

    const { data: brand, error: brandError } = await vendorSupabase
      .from('brand')
      .select('*')
      .single();

    if (brandError || !brand) {
      console.error(`Error fetching Supabase brand data for ${vendor_slug}:`, brandError);
      notFound();
    }
    brandData = brand as Brand;

    const { data: dishes, error: dishesError } = await vendorSupabase
      .from('dishes')
      .select('*')
      .eq('brand_id', brandData.id);
    
    dishesData = (dishes || []) as Dish[];

    const { data: status, error: statusError } = await vendorSupabase
      .from('status_item')
      .select('*')
      .eq('brand_id', brandData.id)
      .eq('active', true);

    statusData = (status || []) as Status;

  } else if (vendorMapping.datastore_type === 'gsheets') {
    const sheetId = vendorMapping.datastore_id;
    const [brand, dishes, status] = await Promise.all([
      getGsheetsBrandData(sheetId),
      getGsheetsDishesData(sheetId),
      getGsheetsStatusData(sheetId),
    ]);

    if (!brand) {
      console.error(`Error fetching Google Sheets brand data for ${vendor_slug}.`);
      notFound();
    }
    brandData = brand;
    dishesData = dishes;
    statusData = status;
  }

  if (!brandData) {
    notFound();
  }

  return { brandData, dishesData, statusData, user, vendorMapping };
}

export default async function VendorPage({
  params,
}: {
  params: { vendor_slug: string };
}) {
  const vendorSlug = params.vendor_slug;
  const { brandData, dishesData, statusData, user, vendorMapping } = await fetchVendorData(
    vendorSlug,
  );

  return (
    <ClientWrapper
      vendorMapping={vendorMapping}
      brand={brandData}
      dishes={dishesData}
      status={statusData}
      user={user}
    />
  );
}
