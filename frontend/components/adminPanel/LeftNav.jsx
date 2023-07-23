import React, { useEffect, useContext } from 'react';
import Link from 'next/link';

import { StoreContext } from '../../utils/Store';
import { useRouter } from 'next/router';

const styles = {
  leftNavItem: 'my-6 bg-custom-blue/20 px-8 py-4 rounded-lg cursor-pointer',
}

export default function LeftNav() {
  const { state, dispatch } = useContext(StoreContext);

  const user = state.user;

  const router = useRouter();

  useEffect(() => {
    console.log(user);
    if (!user || !user || !user.admin) {
      router.push('/');
    }
  }, [user]);

  return (
    <div className="w-60 text-gray-300">
      <ul>
        <Link href='/admin'>
          <li className={styles.leftNavItem}>
            Home
          </li>
        </Link>
        <Link href='/admin/users'>
          <li className={styles.leftNavItem}>
            Users
          </li>
        </Link>
        <Link href='/admin/merchandise'>
          <li className={styles.leftNavItem}>
            Merchandise
          </li>
        </Link>
        <Link href='/admin/orders'>
          <li className={styles.leftNavItem}>
            Orders
          </li>
        </Link>
        <Link href='/admin/collection'>
          <li className={styles.leftNavItem}>
            Collection
          </li>
        </Link>
        <Link href='/admin/manageSigns'>
          <li className={styles.leftNavItem}>
            Manage Signs
          </li>
        </Link>
        <Link href='/admin/otl'>
          <li className={styles.leftNavItem}>
            One Time Link
          </li>
        </Link>
      </ul>
    </div>
  );
}
