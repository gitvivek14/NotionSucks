export const dynamic = 'force-dynamic';
import React from 'react'
import { getFolderDetails } from '@/lib/supabase/queries';
import QuillEditor from '@/components/quill-editor/quill-editor';
import { redirect } from 'next/navigation';

const Folder = async(
    {params}:{params:{folderId:string}}
) => {
    const { data, error } = await getFolderDetails(params.folderId);
    if (error || !data.length) redirect('/dashboard');
  return (
    <div className='relative'>
       <QuillEditor
    dirDetails={data[0] || {}}
    fileId={params.folderId}
    dirType='folder'
    />
    </div>
   
  )
}

export default Folder