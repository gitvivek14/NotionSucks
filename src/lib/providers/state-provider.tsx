"use client"
import React, {
    Dispatch,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
  } from 'react';
import { File, Folder, workspace } from '../supabase/supabase.types';
import { usePathname } from 'next/navigation';;
import { getFiles } from '../supabase/queries';

export type appFoldersType = Folder & { files: File[] | [] };
export type appWorkspaceType = workspace & {
  folders: appFoldersType[] |[];
}

interface Appstate {
  workspaces:appWorkspaceType[]|[]
}

type Action = 
| {type:'ADD_WORKSPACE'; payload:appWorkspaceType}
| {type:'SET_FILES'; payload:{workspaceId:string; files:File[];folderId:string}}

const initialState:Appstate = {workspaces:[]}
const appReducer = (
  state: Appstate = initialState,
  action:Action
):Appstate =>{
  switch(action.type){
    case 'ADD_WORKSPACE':
      return {
        ...state,
        workspaces:[...state.workspaces,action.payload]
      }

    case 'SET_FILES':
      return{
        ...state,
        workspaces :state.workspaces.map((workspace)=>{
          if(workspace.id === action.payload.workspaceId){
            return{
              ...workspace,
              folders:workspace.folders.map((folder)=>{
                if(folder.id === action.payload.folderId){
                  return {
                    ...folder,
                    files:action.payload.files
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        })
      };
  }
}


const AppStateContext = createContext<
|{
  state : Appstate
  dispatch:Dispatch<Action>;
  workspaceId:string | undefined
  folderId:string | undefined;
  fileId : string | undefined
} | undefined
>(undefined);

interface AppStateProviderProps {
  children: React.ReactNode;
}

const AppStateProvider: React.FC<AppStateProviderProps> = ({children})=>{
  const [state, dispatch] = useReducer(appReducer, initialState);
  const pathname = usePathname();
  const workspaceId = useMemo(()=>{
    const urlsegment = pathname?.split('/').filter(Boolean);
    if(urlsegment){
      if(urlsegment.length>1){
        return urlsegment[1]
      }
    }
  },[pathname])
  const folderId = useMemo(()=>{
    const urlSegments = pathname?.split('/').filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 2) {
        return urlSegments[2];
      }
  },[pathname])

  const fileId = useMemo(() => {
    const urlSegments = pathname?.split('/').filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 3) {
        return urlSegments[3];
      }
  }, [pathname]);


  useEffect(()=>{
    if(!folderId || !workspaceId) return;
    const fetchFiles = async ()=>{
      const {error:filesError,data} = await getFiles(folderId);
      if(filesError){
        console.log(filesError);
      }
      if(!data) return;
      dispatch({
        type:'SET_FILES',
        payload:{workspaceId,files:data,folderId}
      });
    };
    fetchFiles();
  },[folderId,workspaceId])

  useEffect(() => {
    console.log('App State Changed', state);
  }, [state]);


  return (
    <AppStateContext.Provider value={{state,dispatch,workspaceId,folderId,fileId}}>
      {children}
    </AppStateContext.Provider>
  )
}

export default AppStateProvider


export const useAppState = ()=>{
  const context = useContext(AppStateContext)
  if(!context){
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}