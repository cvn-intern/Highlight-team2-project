import React from 'react'

const MainLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div id="main-layout" className='w-screen h-screen bg-blue-500 flex flex-col items-center justify-center'>
        {children}
    </div>
  )
}

export default MainLayout