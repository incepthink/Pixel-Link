import React, { useEffect, useState, useContext } from 'react';

import axios from 'axios';

import LeftNav from '../../../components/adminPanel/LeftNav';

import { StoreContext } from '../../../utils/Store';
import { ethers } from 'ethers';
import NFTSignable1155 from '../../../utils/NFTSignable1155.json';

import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../../components/layouts/AdminLayout';
import AlertModal from '../../../components/Modal/AlertModal';
import LoadingModal from '../../../components/Modal/LoadingModal';
import { NftTypes } from '../../../config/models';

export default function SignNfts({ collections }) {
  const { state, dispatch } = useContext(StoreContext);
  const [filteredCollections, setFilteredCollections] = useState([]);

  const { jwt } = state;
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  const { user } = state;
  const initialState = {
    token_id: '',
    collection_id: '',
    wallet_address: '',
    name: '',
    description: '',
  };


  // filter collections
  useEffect(() => {
    const filteredCollections = collections.filter(collection => {
      return collection.type === NftTypes.SIGNABLE;
    });
    setFilteredCollections(filteredCollections);
  }, []);


  const [loading, setLoading] = useState(false);

  const [values, setvalues] = useState(initialState);
  const [isApprovedToSign, setIsApprovedToSign] = useState(false);

  //   const [collections, setCollections] = useState([]);
  const [collectionIndex, setCollectionIndex] = useState(0);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successModalText, setSuccessModalText] = useState("");
  const [errorText, setErrorText] = useState('');


  const checkIfApproved = async () => {
    let collectionAddress = filteredCollections[collectionIndex].contract_address;
    console.log(
      'APPROVE',
      collectionAddress,
      user.wallet_address,
      values.token_id,
      values.name,
      values.description,
    );

    try {
      const providers = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      const contract = new ethers.Contract(
        collectionAddress,
        NFTSignable1155,
        providers.getSigner(user.wallet_address)
      );
      const tx = await contract.isUserOnSignatureWhitelist(
        user.wallet_address,
        values.token_id
      );
      // console.log('BURN', tx);
      setIsApprovedToSign(tx);
      if(tx == true) {
        setSuccessModalText("You are already approved to sign this NFT");
        setShowSuccessModal(true);
      }else {
        setErrorText("You are not approved to sign this NFT. Please contact admin.");
        setShowAlertModal(true);
      }

    } catch (error) {
      console.log(error)
      setErrorText('Sorry, an error occured!');
        setShowAlertModal(true);
    }
  };

  const signNFT = async () => {
    let collectionAddress = filteredCollections[collectionIndex].contract_address;
    console.log(
      'APPROVE',
      collectionAddress,
      user.wallet_address,
      values.token_id,
      values.name,
      values.description,
    );

    try {
      const providers = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      const contract = new ethers.Contract(
        collectionAddress,
        NFTSignable1155,
        providers.getSigner(user.wallet_address)
      );
      const tx = await contract.addSignature(
        values.token_id,
        values.name,
        values.description
      );
      let receipt = await tx.wait();
      console.log('BURN', receipt);

    } catch (error) {
      throw error;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (filteredCollections.length == 0) {
      setErrorText('Need atleast one collection');
      setShowAlertModal(true);
    }
    if (!user.wallet_address) {
      setErrorText('Please connect your wallet to sign!');
      setShowAlertModal(true);
    }
    if (!values.token_id.match(/^-?\d+$/)) {
      setErrorText('Enter valid tokenID');
      setShowAlertModal(true);
      return;
    }

    if (values.name.length == 0) {
      setErrorText('Please provide name to sign!');
      setShowAlertModal(true);
    }

    setLoading(true);
    console.log(values);
    try {
      await signNFT();
      setLoading(false);
      setIsApprovedToSign(false)
      setSuccessModalText("You have successfully signed this NFT");
      setShowSuccessModal(true);
      setvalues(initialState);
    } catch (err) {
      console.log('err', err);
      setLoading(false);
      // console.log(err.response)
      if (err?.response?.data?.msg) {
        setErrorText(err.response.data.msg);
        setShowAlertModal(true);
      } else {
        setErrorText('Sorry, an error occured!');
        setShowAlertModal(true);
      }
    }
  };

  return (
    <div className='flex text-gray-800'>
      <AdminLayout>
        <AlertModal
          showModal={showAlertModal}
          setShowModal={setShowAlertModal}
          text={errorText}
          type='error'
        />
        <AlertModal
          showModal={showSuccessModal}
          setShowModal={setShowSuccessModal}
          text={successModalText}
          type='success'
        />
        <LoadingModal showModal={loading} />
        <div className=' w-full container   mx-5  '>
          <div className='flex flex-col '>
            <div className=' flex flex-col '>
              <div className=' font-bold  text-2xl text-slate-700 '>
                Sign NFTs
              </div>
              <div className='   text-md text-slate-700 mb-10'>
                You can only sign selected NFTs after admin has approved you to sign.
              </div>
              <form onSubmit={onSubmit}>
                <div className='flex flex-wrap justify-start'>
                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2 mt-2'>
                      Select Contract
                    </label>

                    <select
                      value={collectionIndex}
                      className='shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={(e) => setCollectionIndex(e.target.value)}>
                      {filteredCollections.map((collection, i) => {
                          return (
                            <option key={i} value={i}>
                              {collection.name}
                            </option>
                          );
                      })}
                    </select>
                  </div>
                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2'>
                      Token ID
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Token ID'
                      value={values.token_id}
                      onChange={(e) =>{
                        setIsApprovedToSign(false);
                        setvalues({
                          ...values,
                          token_id: e.target.value,
                        })
                      }}
                    />
                  </div>
                </div>

                <div className='flex flex-wrap justify-start'>
                  
                <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2'>
                      User Wallet adress
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Token ID'
                      value={user.wallet_address}
                    />
                  </div>
                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2'>
                      Name
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Name'
                      value={values.name}
                      onChange={(e) =>
                        setvalues({
                          ...values,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2'>
                      Description
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Description'
                      value={values.description}
                      onChange={(e) =>
                        setvalues({
                          ...values,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                

                {/* Submit */}
                <div className='block'>
                <button
                  className=' text-sm block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  type='button'
                  onClick={checkIfApproved}
                  >
                  Check Approval
                </button>
                <button
                  className={`block mt-4 ${isApprovedToSign ? "bg-sky-500 hover:bg-sky-700": " bg-gray-500"} font-xl  text-white font-bold py-2 px-16 rounded focus:outline-none focus:shadow-outline`} 
                  type='submit'
                  disabled={!isApprovedToSign}
                  >
                  Sign
                </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const res = await axios.get(`${process.env.API}/collections/`);
  //   console.log(res.data);
  return {
    props: {
      collections: res.data,
    },
  };
}
