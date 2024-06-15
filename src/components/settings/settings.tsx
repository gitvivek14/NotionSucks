import React from 'react';
import CustomDialogTrigger from '../global/custom-dialog-trigger';
interface SettingsProps {
    children: React.ReactNode;
  }


const Settings:React.FC<SettingsProps>  = ({
    children
}) => {
  return (
    <CustomDialogTrigger
    header='Settings'
    >
        {children}
    </CustomDialogTrigger>
  )
}

export default Settings