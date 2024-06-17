export const dynamic = 'force-dynamic';
import React from 'react'
import { getFolderDetails } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';
const Folder = async(
    {params}:{params:{folderId:string}}
) => {
    const { data, error } = await getFolderDetails(params.folderId);
    if (error || !data.length) redirect('/dashboard');
  return (
    <div className="relative">Folder</div>
  )
}

export default Folder