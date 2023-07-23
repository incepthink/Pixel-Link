import React from 'react';
import { useRouter } from 'next/router';


export default function ConfirmationModal({ showModal, setShowModal, token, txHash }) {
  const router = useRouter();
  if (showModal)
    return (
      <>
        <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
          <div className='relative w-auto my-6 mx-auto max-w-3xl'>
            {/*content*/}
            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
              {/*header*/}
              <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                <h3 className='text-3xl font-semibold'>
                  Your Order Is Placed & Your NFT Is Claimed!
                </h3>
                <button
                  className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                  onClick={() => {
                    setShowModal(false);
                  }}>
                  <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                    ×
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className='h-96  text-center w-full'>
                <div className='flex flex-col  md:flex-row'>
                  <div className=' mx-auto h-64    bg-gray-200 rounded-lg overflow-hidden '>
                    <img
                      src={token.nft_image_url}
                      alt='Claimed Token'
                      className=' w-52  rouned-lg'
                    />
                  </div>
                </div>
                <div className=' w-2/3  mx-auto mt-2 '>
                  Your Order is placed!
                  <br /> Your NFT is burned and this new NFT is minted into your
                  wallet proving your ownership over this Collectible
                  Merchandise.
                  <br/>
                  You will soon recieve an email with the shipment details.
                  <br/>

                  <a className='text-blue-500 underline' href={`https://polygonscan.com/tx/${txHash}`} target="_blank">Tranaction on Polygonscan</a>
                </div>
              </div>
              {/*footer*/}
              <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
                <button
                  className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                  type='button'
                  onClick={() => {
                    router.push('/')
                  }}>
                  Go home
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
      </>
    );
  else return <></>;
}
