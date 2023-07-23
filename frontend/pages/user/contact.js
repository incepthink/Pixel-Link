import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import UserNavbar from '../../components/UserNavbar';
import UserLayout from '../../components/layouts/UserLayout';
import { ethers } from 'ethers';
import NFTABI from '../../utils/NftApparelABI.json';

export default function Contact() {
  return (
    <div className='grid grid-cols-5 '>
      <UserLayout>
        <div className='col-span-4 flex flex-col mt-64   '>
            <div className='container mx-auto px-4'>
            
              <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64 font-gothom_pro'>
                <div className='px-6'>
                <div className='text-2xl text-center'> Contact Us</div>
                  <div className='mt-5 py-4 border-t border-gray-300 text-center '>
                      
                    <div className='flex flex-wrap justify-center'>
                      <div className='w-full lg:w-9/12 px-4'>
                        <p className='mb-4 text-lg leading-relaxed text-gray-800'>
                          Have any query or stuck somewhere? Reach out to us at
                          contact@incepthink.com!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </UserLayout>
    </div>
  );
}
