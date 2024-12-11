"use client"


import checkTokenExpirationMiddleware from '@/middleware/checkTokenMiddleware';
import React, { Fragment, useEffect } from 'react'

export default function AuthLayout({children}) {
  useEffect(() => {
    checkTokenExpirationMiddleware();
  }, []);
  return (
    <Fragment>{children}</Fragment>
  )
}
