import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';
import UserLayout from '../../components/layouts/UserLayout';
import Pagination from '../../components/Pagination';
import notify from '../../utils/notify';
import Image from 'next/image';

export default function User() {
  const { state, dispatch } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  const jwt = state.jwt;
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

  const getOrders = async () => {
    try {
      const response = await axios.get(
        `/backend/user/getUserOrdersByPage`, {
        params: {
          user_id: state.user.id,
          page: activePage,
          limit: 5,
        }
      });
      // console.log(response.data);
      setOrders(response.data.order);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      if (err?.response?.data?.message) {
        notify(err.response.data.message);
      } else {
        notify(err.message);
      }
    }
  };

  //Check if the user is signed in
  useEffect(() => {
    if (!state.user) {
      router.push('/');
    } else {
      getOrders();
    }
  }, [activePage]);

  return (
    <div className='flex text-white'>
      <UserLayout>
        <div className='w-full bg-custom-blue/20 p-8 mx-16 rounded-lg max-w-4xl'>
          <div className='w-full flex justify-between items-center'>
            <h1 className='text-3xl font-semibold'>ORDERS</h1>
            <h1 className='text-sm font-thin'>{orders.length} ITEMS</h1>
          </div>
          {
            orders.map(order => {
              console.log(order);
              return <OrderComponent order={order} />
            })
          }
          {
            orders.length === 0 ? (
              <h1 className='p-16 text-custom-blue'>You have not ordered anything yet!</h1>
            ) : null
          }
          <Pagination totalPages={totalPages} activePage={activePage} setActivePage={setActivePage} />
        </div>
      </UserLayout>
    </div>
  );
}

const OrderComponent = ({ order }) => {
  return (
    <div className=' my-16 w-full'>
      <div className='relative flex justify-between items-center border-[1px] border-custom-blue/20 px-4'>
        <div>
          <h1 className='text-2xl font-light'>{order?.merchandise?.name}</h1>
          <a href='/user/orders' className='font-thin text-custom-blue'>{"VIEW ORDER >"}</a>
        </div>
        <img src={order?.merchandise?.nft_image_url} alt="img" className='w-56 bg-cover -translate-y-4 rounded-lg' />
      </div>
      <div className='flex justify-end items-center px-6 mt-2'>
        <img src="/images/user/order_shipped.png" alt="img" className='w-3 mr-4' />
        <h1 className='font-thin text-sm'>{order?.status}</h1>
      </div>
    </div>
  )
}
