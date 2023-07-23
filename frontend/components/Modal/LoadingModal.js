import React from 'react';
import { SwishSpinner } from "react-spinners-kit";
import { useEffect } from 'react';

export default function LoadingModal({ showModal }) {

  useEffect(() => {
    if(showModal)
      document.body.style.overflow = "hidden"
    else 
      document.body.style.overflow = 'unset';
  }, [showModal]);
  
  if (showModal)
    return (
      <>
        <div className='justify-center items-center bg-black/50   flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
          <div className='relative w-auto my-6 mx-auto max-w-3xl'>
            {/*content*/}
            <div className='relative '>
              <div className='flex justify-end p-2'>
              </div>
              <div className='p-6 pt-0 text-center'>
                {/* <img src='/images/loading.gif'/> */}
                <SwishSpinner size={100} frontColor="#1fe1ff" loading={true} />
                <div className='text-white mt-5'>Processing...</div>
              </div>
            </div>
          </div>
        </div>
        <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
      </>
    );
  else return <></>;
}


