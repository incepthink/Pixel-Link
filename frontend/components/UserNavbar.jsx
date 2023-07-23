import Link from 'next/link'
import React from 'react'

const styles = {
  userNavItem: " bg-custom-blue/20 px-8 py-4 rounded-lg"
}

export default function UserNavBar({ user }) {
  return (
    <div className="w-60 text-gray-300">
      <ul className='w-full'>
        <Link href='/user'>
          <li className={"mb-4 border-[1px] border-custom-blue/40" + styles.userNavItem}>
            Profile
          </li>
        </Link>
        <Link href='/user/orders'>
          <li className={"rounded-b-none py-6" + styles.userNavItem}>
            Orders
          </li>
        </Link>
        <Link href='/user/signNfts'>
          <li className={"rounded-t-none py-6" + styles.userNavItem}>
            Sign NFTs
          </li>
        </Link>
      </ul>
    </div>
  )
}
