"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '../ui/use-toast';
import { useAppState } from '@/lib/providers/state-provider';
import { User, workspace } from '@/lib/supabase/supabase.types';
import { useSupabaseUser } from '@/lib/providers/supabase-user-provider';
import { useRouter } from 'next/navigation';
import {createClient} from "@/lib/supabase/client"
import {
    Briefcase,
    CreditCard,
    ExternalLink,
    Lock,
    LogOut,
    Plus,
    Share,
    User as UserIcon,
  } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { v4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import CollaboratorSearch from '../global/collaborator-search';
import CypressProfileIcon from '../icons/cypressProfileIcon';
import LogoutButton from '../global/logout-button';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Alert, AlertDescription } from '../ui/alert';
import { postData } from '@/lib/utils';
const SettingsForm = () => {
  return (
    <div>SettingsForm</div>
  )
}

export default SettingsForm