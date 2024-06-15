
'use client';
import { useAppState } from '@/lib/providers/state-provider';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import clsx from 'clsx';
import EmojiPicker from '../global/emoji-picker';
import { createFile, updateFile, updateFolder } from '@/lib/supabase/queries';
import { useToast } from '../ui/use-toast';
import TooltipComponent from '../global/tooltip-component,'
import {createClient} from "@/lib/supabase/client"
import { PlusIcon, Trash } from 'lucide-react';
import { File } from '@/lib/supabase/supabase.types';
import { v4 } from 'uuid';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';

interface DropdownProps {
    title: string;
    id: string;
    listType: 'folder' | 'file';
    iconId: string;
    children?: React.ReactNode;
    disabled?: boolean;
  }

const Dropdown: React.FC<DropdownProps> = (
    {
        title,
        id,
        listType,
        iconId,
        children,
        disabled,
        ...props
      }
) => {
    const supabase = createClient()
  const { toast } = useToast();
  const { user } = useSupabaseUser();
  const { state, dispatch, workspaceId, folderId } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  return (
    <div>Dropdown</div>
  )
}

export default Dropdown