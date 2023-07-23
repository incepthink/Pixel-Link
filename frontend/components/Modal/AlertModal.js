import React from 'react';
import styles from '../Navbar.module.css';


export default function AlertModal({ showModal, setShowModal, text, type ,confirmButtonText, onConfirm}) {
  if (showModal)
    return (
      <>
        <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
          <div className='relative w-auto my-6 mx-auto max-w-3xl'>
            {/*content*/}
            <div className='relative bg-white rounded-lg shadow '>
              <div className='flex justify-end p-2'>
                <button
                  type='button'
                  className='text-gray-800 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white'
                  onClick={() => {
                    setShowModal(false);
                  }}>
                  <svg
                    className='w-5 h-5'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fill-rule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'></path>
                  </svg>
                </button>
              </div>
              <div className='p-6 pt-0 text-center'>
                {type == 'success' ? (
                  <svg
                  className='mx-auto mb-4 w-14 h-14 text-green-600 '
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                    >
                    {' '}
                    <path d='M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M17.707,9.707l-7,7 C10.512,16.902,10.256,17,10,17s-0.512-0.098-0.707-0.293l-3-3c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0L10,14.586 l6.293-6.293c0.391-0.391,1.023-0.391,1.414,0S18.098,9.316,17.707,9.707z' />
                  </svg>
                ) : type == 'error' ? (
                  <svg
                    className='mx-auto mb-4 w-14 h-14 text-red-500 '
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                    >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                  </svg>
                ) : null}
                <h3 className='mb-5 text-lg font-normal text-gray-800 text-wrap '>
                  {text}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    if(onConfirm){
                      onConfirm();
                    };
                  }}
                  type='button'
                  className={`text-white rounded-md transition-all  text-lg
                  ${ type=='error'? 'bg-red-400 hover:bg-red-300' : 'bg-gray-500 hover:shadow-lg hover:bg-gray-600'}  
                   px-5 py-2 text-center mr-5`}>
                  Okay
                </button>
                {confirmButtonText && (
                <button
                  onClick={onConfirm}
                  type='button'
                  className={
                    '  rounded-md px-2  py-2  text-center   text-white text-lg   shadow-lg transition-all hover:shadow-sky-300 mr-4 ' +
                    styles.login
                  }>
                  {confirmButtonText}
                </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
      </>
    );
  else return <></>;
}
