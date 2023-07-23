import React from 'react'
import LeftNav from '../adminPanel/LeftNav'

export default function AdminLayout({ children }) {
  return (
    <div className="w-screen text-white font-manrope">
      <div className="flex w-full justify-center bg-catalogue-background-1 py-8 bg-cover">
        <div className="flex w-full justify-between items-center max-w-6xl pt-16"/>
      </div>

      <div className="w-full flex justify-center mt-20">
        <div className="max-w-6xl w-full flex">
          <div className="max-w-sm w-fit">
            <LeftNav />
          </div>
          <div className="w-full flex flex-col items-center justify-start px-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
