import {createClient} from "../../lib/supabase/server"
import React from 'react'
import { redirect } from "next/navigation"

import {twMerge} from "tailwind-merge"
import { getCollaboratingWorkspaces, getFolders, getPrivateWorkspaces, getSharedWorkspaces, getUserSubscriptionStatus } from "@/lib/supabase/queries";
import { error } from "console";
import WorkspaceDropdown from "./workspace-dropdown";
import PlanUsage from "./plan-usage";

import { ScrollArea } from '../ui/scroll-area';
import NativeNavigation from "./native-navigation";

interface SidebarProps{
    params:{workspaceId:string};
    classname?:string;
}

const Sidebar: React.FC<SidebarProps> = async ({params,classname}) => {
    const supabase = createClient()
    const {data:{user}} = await supabase.auth.getUser()
    if(!user) return;
    const { data: subscriptionData, error: subscriptionError } =
    await getUserSubscriptionStatus(user.id);
    //folders
    const {data:workspaceFolderData,error:foldersError} = await getFolders(params.workspaceId)
    //error
    if(subscriptionError || foldersError) redirect('/dashboard')
    //get all workspaces
    const [privateWorkspaces, collaboratingWorkspaces, sharedWorkspaces] =
    await Promise.all([
      getPrivateWorkspaces(user.id),
      getCollaboratingWorkspaces(user.id),
      getSharedWorkspaces(user.id),
    ]);
  return (
    <aside className={twMerge(
        'hidden sm:flex sm:flex-col w-[280px] shrink-0 p-4 md:gap-4 !justify-between',
        classname
    )}>
        <div>
          <WorkspaceDropdown 
          privateWorkspaces={privateWorkspaces}
          sharedWorkspaces={sharedWorkspaces}
          collaboratingWorkspaces={collaboratingWorkspaces}
          defaultValue={[
            ...privateWorkspaces,
            ...collaboratingWorkspaces,
            ...sharedWorkspaces
          ].find((workspace)=> workspace.id === params.workspaceId)}
          />
          <PlanUsage 
          foldersLength={workspaceFolderData?.length || 0}
          subscription={subscriptionData}
          />
          <NativeNavigation myWorkspaceId={params.workspaceId}/>
         

        </div>
    </aside>
  )
}

export default Sidebar