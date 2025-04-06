"use client";
import usePremiumModal from '@/app/hooks/usePremiumModal';
import { Button } from '@/components/ui/button';
import React from 'react'

const GetSubscriptionButton = () => {
    const {setOpen}=usePremiumModal()
  return (
    <Button onClick={()=>setOpen(true)} variant={"premium"}>Get Premuim subscription</Button>
  )
}

export default GetSubscriptionButton