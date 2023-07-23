import { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../utils/Store';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import OldAddress from '../../components/checkout/OldAddress';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AlertModal from '../../components/Modal/AlertModal';
import styles from '../../components/Navbar.module.css';

export default function setAddress() {
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const [product, setProduct] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [isErrorModal, setIsErrorModal] = useState(false);

  useEffect(() => {
    console.log(state)
    if (state?.cart[0]) setProduct(state.cart[0]);
    else {
    }
  }, [state]);
  // const cart = state.cart[0].product;


  // useEffect(() => {
  //   console.log(state.cart)
  //   if (state.cart.length > 0) {
  //     cart = state.cart[0].product;
  //   } else {
  //     // router.push('/');
  //   }
  // }, []);


  return (
    <div className='pt-48 px-16 grid grid-cols-10 font-manropet text-white'>
      <AlertModal
        showModal={isErrorModal}
        setShowModal={setIsErrorModal}
        text={errorText}
        type='error'
      />
      <div className='xl:col-span-7 col-span-6 px-12 py-4'>
        <p className='text-3xl '>BILLING DETAILS</p>
        {/* <OldAddress /> */}
        {/* <p className="text-xl mt-10 font-bold">Enter New Address</p> */}

        <CheckoutForm />
      </div>
      <div className='xl:col-span-3 col-span-4 p-8 rounded-lg h-fit'>
        <p className='text-3xl '>PRODUCT DETAILS</p>
        {product && (
        <div className=' h-96 p-3 rounded-xl  cursor-pointer'>
          <div className='w-full  aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8'>
            <img
              src={product.nft_image_url}
              alt={product.token_id}
              className='w-full h-64 object-center object-cover group-hover:opacity-75'
            />
          </div>
          <div className=' mt-2 flex justify-between   '>
            <h3 className=' text-lg text-white'>
              {' '}
              {product.name}
            </h3>
            <div className='flex-1 text-right'>Token: {product.token_id}</div>
          </div>

          <div className='text-sm font-medium text-gray-300'>
            {product.collection.name}
          </div>
        </div>
        )}
        
      </div>
    </div>
  );
}
