import Image from 'next/image';
import React from 'react';

const CollectionItem = ({ img, heart, name, description }) => {
  return (
    <div className='border-[1px] border-gray-600 p-4 md:p-12'>
      <div className='w-[250px]' >
        <Image src={img} alt='' width='100%' height='100%' layout="responsive" objectFit="contain" />
      </div>
      <h1 className="text-2xl font-semibold tracking-wide mt-4">{name}</h1>
      <div className="flex items-center">
        <h1 className="font-light my-1 tracking-wide">{description}</h1>
      </div>
      <div className='mt-6 w-full flex justify-between items-center'>
        <button
          className="flex justify-between w-48 my-2 text-white py-3 px-3 md:px-8 border-[1px] border-white rounded-sm">
          <h1>Buy now</h1>
          <h1>-{'>'}</h1>
        </button>
        <img src={heart ? "/icons/heart.png" : "/icons/heart-outlined.png"} alt="img" className={heart ? 'w-14' : 'w-6'} />
      </div>
    </div>
  )
}

export default CollectionItem;