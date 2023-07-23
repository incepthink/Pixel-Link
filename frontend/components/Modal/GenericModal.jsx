import React from 'react';
import styles from '../Navbar.module.css';

const GenericModal = ({ children, heading, subheading, setshowModal, onClose }) => {
  return (
    <>
      <div className='justify-center backdrop-blur-md   items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-lg'>
          {/*content*/}
          <div className='p-4 bg-black font-manrope text-white border-[1px] border-gray-600'>
            <div className='flex flex-col items-center justify-center'>
              <div className='relative text-center w-full'>
                <h1 className={"text-3xl flex-1 uppercase text-green-400 "}>
                  {heading}
                </h1>
                <button
                  className="p-3 absolute top-0 right-0"
                  onClick={() => {
                    setshowModal(false)
                    if(onClose) onClose()
                  }}
                >
                  <img src="/icons/cross.png" alt="" className='w-3' />
                </button>
              </div>
              <h3 className='text-lg my-3 w-full break-words text-center'>{subheading}</h3>
            </div>
            <div className='flex items-center justify-center px-4'>
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  )
}

{/* <div className='fixed hidden inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
                <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='flex'>
                            <h1 className={"text-3xl flex-1 capitalize " + styles.arcadeFont}>{heading}</h1>
                            <button
                                className="p-1 "
                                onClick={() => { setshowModal(false) }}
                            >
                                ×
                            </button>
                        </div>
                        <h3 className='text-lg'>{subheading}</h3>
                    </div>
                    <div className='flex items-center justify-center'>
                        {children}
                    </div>
                </div>
            </div>
            <img src="/images/misc/modal_bg.png" alt="" /> */}

export default GenericModal