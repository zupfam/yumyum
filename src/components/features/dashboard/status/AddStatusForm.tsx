'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/utils/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// @ts-ignore
import IK from 'imagekit-javascript';

interface AddStatusFormProps {
  imagekit_account_id: string;
}

/**
 * A form for adding a new status item (text, image, or video).
 * It includes a client-side uploader that authenticates via our
 * own API route to securely upload files to ImageKit.
 */
export function AddStatusForm({ imagekit_account_id }: AddStatusFormProps) {
  const [content, setContent] = useState('');
  const [imagekitFileId, setImagekitFileId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<'text' | 'image' | 'video'>('text');
  const supabase = createClient();

  /**
   * Handles the file upload process using the ImageKit client-side SDK.
   * It fetches authentication parameters from our secure API route.
   */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ik = new IK({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        authenticationEndpoint: '/api/imagekit-auth'
    });

    try {
      const response = await ik.upload({
        file: file,
        fileName: file.name,
      });
      // On successful upload, set the form state
      setContent(response.url);
      setImagekitFileId(response.fileId);
      if (file.type.startsWith('image')) {
        setType('image');
      } else if (file.type.startsWith('video')) {
        setType('video');
      }
    } catch (error) {
      console.error('ImageKit upload error:', error);
    }
  };

  /**
   * Handles the form submission to save the new status item to Supabase.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get the brand_id associated with the current user
    const { data: brand } = await supabase.from('brand').select('id').eq('auth_user_id', user.id).single();
    if (!brand) return;

    // Insert the new status item
    await supabase.from('status_item').insert({
      brand_id: brand.id,
      type,
      content,
      imagekit_file_id: imagekitFileId,
    });
    
    // Reset form after submission
    setContent('');
    setImagekitFileId(undefined);
    setType('text');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">Add New Status</h2>
      <div>
        <Label htmlFor="status-content">Status Content (Text or URL)</Label>
        <Input id="status-content" value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="status-upload">Or Upload Image/Video</Label>
        <Input id="status-upload" type="file" onChange={handleUpload} />
      </div>
      <Button type="submit">Add Status</Button>
    </form>
  );
}