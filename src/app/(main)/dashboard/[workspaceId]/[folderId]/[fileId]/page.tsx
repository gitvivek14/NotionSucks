import React from 'react'
import { getFileDetails } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

const File = async(
    { params }: { params: { fileId: string } }
) => {
  const { data, error } = await getFileDetails(params.fileId);
  if (error || !data.length) redirect('/dashboard');
  return (
    <div className="relative">File</div>
  )
}

export default File