"use client"
import React,{useState} from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '../ui/card';
  import { Button } from '../ui/button';
  import { Label } from '../ui/label';
   import { Input } from '../ui/input';
   import { useRouter } from 'next/navigation';
  import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
  import { AuthUser } from '@supabase/supabase-js';
  import {z} from 'zod'
import {createClient} from "../../../src/lib/supabase/client"
import { CreateWorkspaceFormSchema } from '@/lib/types';
import { Subscription,workspace } from '@/lib/supabase/supabase.types';
import { v4 } from 'uuid';
import { createWorkspace } from '@/lib/supabase/queries';
import Loader from '../global/Loader';
import EmojiPicker from '../global/emoji-picker';

  interface DashBoardSetupProps{
    user:AuthUser;
    subscription:Subscription | null;
  }
const DashBoardSetup:React.FC<DashBoardSetupProps> = ({
    subscription,
    user
}) => {
    const router = useRouter()
    const [selectedEmoji, setSelectedEmoji] = useState('💼');
    const supabase = createClient()
    const {register,handleSubmit,reset,formState:
        {isSubmitting:isLoading,errors}
    } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
        mode:'onChange',
        defaultValues:{
            logo:'',
            worspaceName:''
        }
    })

    const onSubmit:SubmitHandler<z.infer<typeof CreateWorkspaceFormSchema>> = async (value)=>{
        const file = value.logo?.[0];
        let filePath = null;
        const workspaceUUID = v4()
        console.log(file);
        if(file){
            try {
                const {data,error} = await supabase.storage.from('workspace-logos')
                .upload(`workspaceLogo.${workspaceUUID}`,file,{
                    cacheControl:'3600',
                    upsert:true
                })
                if(error) throw new Error('')
                    filePath = data.path;
            } catch (error) {
                console.log('Error', error);   
            }
        }
        try {
            const newWorkspace:workspace = {
                data:null,
                createdAt:new Date().toISOString(),
                iconId:selectedEmoji,
                id:workspaceUUID,
                inTrash:'',
                title:value.worspaceName,
                workspaceOwner:user.id,
                logo:filePath || null,
                bannerUrl:''
            }
            const {data,error:createError} = await createWorkspace(newWorkspace);
            if (createError) {
                throw new Error();
              }

            router.replace(`/dashboard/${newWorkspace.id}`)
        } catch (error) {
            console.log(error, 'Error');
        }finally{
            reset();
        }
    }

  return (
   <Card className='w-[800px] h-screen sm:h-auto'>
    <CardHeader>
        <CardTitle>
        Create A Workspace
        </CardTitle>
        <CardDescription>
        Lets create a private workspace to get you started.You can add
        collaborators later from the workspace settings tab.
        </CardDescription>
    </CardHeader>
    <CardContent>
    <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
                <div className='text-5xl'>
                   <EmojiPicker getValue={(emoji)=> setSelectedEmoji(emoji)}>
                    {selectedEmoji}
                   </EmojiPicker>
                </div>
                <div className='w-full'>
                    <Label htmlFor='workspaceName'
                    className='text-sm text-muted-foreground'
                    >
                        Name
                    </Label>
                    <Input 
                    id='workspaceName'
                    type='text'
                    placeholder='Workspace Name'
                    disabled={isLoading}
                    {...register('worspaceName',{required:'Workspace name is required'})}
                    >
                    </Input>
                    <small className='text-red-600'>
                        {errors?.worspaceName?.message?.toString()}
                    </small>
                </div>
                </div>
                <div>
                    <Label  htmlFor="logo"
                className="text-sm
                  text-muted-foreground
                " >
                    Workspace Logo
                </Label>
                <Input
                id='logo'
                type='file'
                accept='image/*'
                placeholder='Worspace Name'
                {...register('logo',{
                    required:false
                })}
                />
                <small className="text-red-600">
                {errors?.logo?.message?.toString()}
              </small>
              {subscription?.status !== 'active' && (
                <small
                  className="
                  text-muted-foreground
                  block
              "
                >
                  To customize your workspace, you need to be on a Pro Plan
                </small>
              )}
                </div>

            <div className='self-end'>
                <Button disabled={isLoading} type='submit'>
                {!isLoading ? 'Create Workspace' : <Loader />}
                </Button>
            </div>
        </div>
    </form>
    </CardContent>
   </Card>
  )
}

export default DashBoardSetup