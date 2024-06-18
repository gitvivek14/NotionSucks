'use client'
import { File, Folder, workspace } from '@/lib/supabase/supabase.types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {createClient} from "../../lib/supabase/client"
import EmojiPicker from '../global/emoji-picker';
import { XCircleIcon } from 'lucide-react';
import "quill/dist/quill.core.css";
import {
  deleteFile,
  deleteFolder,
  findUser,
  getFileDetails,
  getFolderDetails,
  getWorkspaceDetails,
  updateFile,
  updateFolder,
  updateWorkspace,
} from '@/lib/supabase/queries';
import { usePathname, useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { useAppState } from '@/lib/providers/state-provider';

interface QuillEditorProps{
  dirDetails:File | Folder| workspace
  fileId:string
  dirType:'workspace'|'folder'|'file'
}
var TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
];

const QuillEditor:React.FC<QuillEditorProps> = (
  {
    dirDetails,
    dirType,
    fileId
  }
) => {
  const supabase = createClient()
  const {dispatch,state,folderId,workspaceId} = useAppState()
  const { user } = useSupabaseUser();
  const router = useRouter();
  const pathname = usePathname()
  const [quill, setQuill] = useState<any>(null);

  const details = useMemo(()=>{
    let selectedDir;
    if(dirType==='file'){
      selectedDir = state.workspaces.find((workspace)=> workspace.id === workspaceId)
      ?.folders.find((folder)=> folder.id === folderId)
      ?.files.find((file)=> file.id === fileId)
    }
    if (dirType === 'folder') {
      selectedDir = state.workspaces
        .find((workspace) => workspace.id === workspaceId)
        ?.folders.find((folder) => folder.id === fileId);
    }
    if (dirType === 'workspace') {
      selectedDir = state.workspaces.find(
        (workspace) => workspace.id === fileId
      );
    }
    if(selectedDir){
      return selectedDir
    }

    return {
      title:dirDetails.title,
      iconId:dirDetails.iconId,
      createdAt:dirDetails.createdAt,
      data:dirDetails.data,
      inTrash:dirDetails.inTrash,
      bannerUrl:dirDetails.bannerUrl
    } as workspace | Folder | File
  },[state,pathname,workspaceId])

  const breadCrumbs = useMemo(()=>{
    if(!pathname ||  !state.workspaces || !workspaceId) return;
    const segments = pathname
    .split('/')
    .filter((val)=> val!= 'dashboard' && val)
    const workspaceDetails = state.workspaces.
    find((workspace)=> workspace.id === workspaceId)
    const workspaceBreadCrumb = workspaceDetails? `${workspaceDetails?.iconId} ${workspaceDetails?.title}` 
    : '';
    if (segments.length === 1) {
      return workspaceBreadCrumb;
    }
    const folderSegment = segments[1];
    const folderDetails = workspaceDetails?.folders.find(
      (folder) => folder.id === folderSegment
    );
    const folderBreadCrumb = folderDetails
      ? `/ ${folderDetails.iconId} ${folderDetails.title}`
      : '';

    if (segments.length === 2) {
      return `${workspaceBreadCrumb} ${folderBreadCrumb}`;
    }

    const fileSegment = segments[2];
    const fileDetails = folderDetails?.files.find(
      (file) => file.id === fileSegment
    );
    const fileBreadCrumb = fileDetails
      ? `/ ${fileDetails.iconId} ${fileDetails.title}`
      : '';

      return `${workspaceBreadCrumb} ${folderBreadCrumb} ${fileBreadCrumb}`;

  },[state,pathname,workspaceId])

  const wrapperRef = useCallback(async(wrapper:any)=>{
    if(typeof window != 'undefined'){
      if(wrapper==null) return;
      wrapper.innerHTML = ''
      const editor = document.createElement('div')
      wrapper.append(editor)
      const Quill = (await import ('quill')).default;
      const QuillCursors = (await import ('quill')).default;
      const q = new Quill(editor,{
        theme: 'snow',
        modules:{
          toolbar:TOOLBAR_OPTIONS,
          cursors:{
            transformOnTextChange:true
          }
        }
      });
      setQuill(q)
    }
  },[])


  const restoreFileHandler = async()=>{
    if(dirType==='file'){
      if(!folderId || !workspaceId) return;
      dispatch({
        type: 'UPDATE_FILE',
        payload: { file: { inTrash: '' }, fileId, folderId, workspaceId },
      });
      await updateFile({ inTrash: '' }, fileId);
    }
    if (dirType === 'folder') {
      if (!workspaceId) return;
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: { folder: { inTrash: '' }, folderId: fileId, workspaceId },
      });
      await updateFolder({ inTrash: '' }, fileId);
    }
  }

  const deleteFileHandler = async()=>{
    if (dirType === 'file') {
      if (!folderId || !workspaceId) return;
      dispatch({
        type: 'DELETE_FILE',
        payload: { fileId, folderId, workspaceId },
      });
      await deleteFile(fileId);
      router.replace(`/dashboard/${workspaceId}`);
    }
    if (dirType === 'folder') {
      if (!workspaceId) return;
      dispatch({
        type: 'DELETE_FOLDER',
        payload: { folderId: fileId, workspaceId },
      });
      await deleteFolder(fileId);
      router.replace(`/dashboard/${workspaceId}`);
    }

  }
  return (
    <>
<div className="relative">
  {details.inTrash && (
    <article
    className="py-2
    z-40
     bg-[#EB5757] 
          flex  
          md:flex-row 
          flex-col 
          justify-center 
          items-center 
          gap-4 
          flex-wrap
    ">
      <div className="flex flex-col md:flex-row
      gap-2
      justify-center
      items-center
      ">
        <span className="text-white">
        This {dirType} is in the trash.
        </span>
        <Button
                size="sm"
                variant="outline"
                className="bg-transparent
                border-white
                text-white
                hover:bg-white
                hover:text-[#EB5757]
                "
                onClick={restoreFileHandler}
              >
                Restore
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="bg-transparent
                border-white
                text-white
                hover:bg-white
                hover:text-[#EB5757]
                "
                onClick={deleteFileHandler}
              >
                Delete
              </Button>
      </div>
      <span className="text-sm text-white">{details.inTrash}</span>
    </article>
  )}

</div>
    </>
  )
}

export default QuillEditor