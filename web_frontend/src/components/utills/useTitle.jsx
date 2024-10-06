import React, { useEffect } from 'react'

export default function useTitle(title) {

    useEffect(()=>{
        document.title = `ระบบอนุมัติ ProviderID - ${title}`;
    },[title])

  return null;
}
