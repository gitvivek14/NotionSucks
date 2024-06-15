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