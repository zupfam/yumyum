'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/utils/client';
import { StatusItem } from '@/lib/types';
import { Button } from '@/components/ui/button';

/**
 * Displays a list of status items for the current vendor.
 * Provides functionality to delete statuses, which also triggers
 * the deletion of the associated asset in ImageKit via a Supabase Edge Function.
 */
export function StatusList() {
  const [statuses, setStatuses] = useState<StatusItem[]>([]);
  const supabase = createClient();

  // Fetch statuses for the current vendor on component mount
  useEffect(() => {
    const fetchStatuses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: brand } = await supabase.from('brand').select('id').eq('auth_user_id', user.id).single();
        if (brand) {
          const { data, error } = await supabase.from('status_item').select('*').eq('brand_id', brand.id);
          if (error) {
            console.error('Error fetching statuses:', error);
          } else {
            setStatuses(data || []);
          }
        }
      }
    };
    fetchStatuses();
  }, [supabase]);

  /**
   * Handles the deletion of a status item.
   * First, it invokes a Supabase Edge Function to delete the asset from ImageKit.
   * Then, it deletes the status record from the Supabase database.
   */
  const handleDelete = async (status: StatusItem) => {
    // First, delete from ImageKit if there is an associated file ID
    if (status.imagekit_file_id) {
      await supabase.functions.invoke('delete-status-asset', {
        body: { file_id: status.imagekit_file_id },
      });
    }

    // Then, delete the record from the database
    const { error } = await supabase.from('status_item').delete().eq('id', status.id);
    if (error) {
      console.error('Error deleting status:', error);
    } else {
      // Update the local state to reflect the deletion
      setStatuses(statuses.filter(s => s.id !== status.id));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Current Statuses</h2>
      {statuses.map((status) => (
        <div key={status.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <p className="font-medium capitalize">{status.type}</p>
            <p className="text-sm text-muted-foreground truncate max-w-xs">{status.content}</p>
          </div>
          <Button variant="destructive" onClick={() => handleDelete(status)}>Delete</Button>
        </div>
      ))}
    </div>
  );
}