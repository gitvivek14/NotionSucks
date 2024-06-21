import React from 'react'
import { getFileDetails } from '@/lib/supabase/queries';
import { redirect } from 'next/navigation';

import QuillEditor from '@/components/quill-editor/quill-editor';


const File = async(
    { params }: { params: { fileId: string } }
) => {
  const { data, error } = await getFileDetails(params.fileId);
  if (error || !data.length) redirect('/dashboard');
  return (
    <div className="relative">
      <QuillEditor
      dirDetails={data[0] || {}}
      dirType='file'
      fileId={params.fileId}
      />
    </div>
  )
}

export default File