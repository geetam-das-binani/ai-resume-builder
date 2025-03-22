import { Button } from '@/components/ui/button';
import { Squircle } from 'lucide-react';
import React from 'react'


interface BorderStyleButtonProps {
    borderStyle: string | undefined;
    onChange:(borderStyle:string) => void
}
const BorderStyleButton = ({borderStyle,onChange}:BorderStyleButtonProps) => {
 function handleClick(){

 }
 
    return (
    <Button size={"icon"} onClick={handleClick} variant={"outline" } title='Change Border Style'>
        <Squircle />
    </Button>
  )
}

export default BorderStyleButton