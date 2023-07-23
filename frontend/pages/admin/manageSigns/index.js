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

export default function manageSigns({ collections }) {
  const { state, dispatch } = useContext(StoreContext);
  console.log(collections);

  const { jwt } = state;
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  const { user } = state;
  const initialState = {
    token_id: '',
    collection_id: '',
    approvedWallets: [''],
  };

  const [merchandise, setMerchandise] = useState([]);

  const [filteredCollections, setFilteredCollections] = useState([]);

  const [loading, setLoading] = useState(false);

  const [walletInfo, setwalletInfo] = useState(initialState);

  //   const [collections, setCollections] = useState([]);
  const [collectionIndex, setCollectionIndex] = useState(0);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorText, setErrorText] = useState('');

    // filter collections
    useEffect(() => {
      const filteredCollections = collections.filter(collection => {
        return collection.type === NftTypes.SIGNABLE;
      });
      setFilteredCollections(filteredCollections);
    }, []);

  const approveWalets = async () => {
    console.log("COLLECTIOSN", collections);
    let collectionAddress = filteredCollections[collectionIndex].contract_address;
    console.log(
      'APPROVE',
      collectionAddress,
      user.wallet_address,
      walletInfo.token_id,
      walletInfo.approvedWallets
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
      const tx = await contract.addToSignatureWhitelist(
        walletInfo.token_id,
        walletInfo.approvedWallets
      );
      const receipt = await tx.wait();
      console.log('BURN', receipt);
      return receipt;
    } catch (error) {
      throw {
        type: 'contract',
        error: error,
      };
    }
  };

  const addwalles = async (e) => {
    e.preventDefault();
    if (collections.length == 0) {
      setErrorText('Need atleast one collection');
      setShowAlertModal(true);
    }
    if (!walletInfo.token_id.match(/^-?\d+$/)) {
      setErrorText('Enter valid tokenID');
      setShowAlertModal(true);
      return;
    }
    let invalidWallet = false;
    walletInfo.approvedWallets.map((wallet) => {
      if (wallet.length != 42) {
        console.log('invalid', wallet);
        invalidWallet = true;
      }
    });
    if (invalidWallet) {
      console.log('err');
      setErrorText('Enter valid wallet address');
      setShowAlertModal(true);
      return;
    }
    setLoading(true);
    console.log(walletInfo);
    try {
      await approveWalets();
      setLoading(false);
      setShowSuccessModal(true);
      setwalletInfo(initialState);
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
    <div className='flex text-white'>
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
          text='Collection Added Successfully'
          type='success'
        />
        <LoadingModal showModal={loading} />
        <div className=' w-full container   mx-5  '>
          <div className='flex flex-col '>
            <div className=' flex flex-col '>
              <div className=' font-bold  text-2xl text-custom-blue mb-10'>
                Approve Wallets To Sign
              </div>
              <form onSubmit={addwalles}>
                <div className='flex flex-wrap justify-start'>
                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-custom-blue text-sm font-bold mb-2 mt-2'>
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
                    <label className='text-custom-blue text-sm font-bold mb-2'>
                      Token ID
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Enter Token ID'
                      value={walletInfo.token_id}
                      onChange={(e) =>
                        setwalletInfo({
                          ...walletInfo,
                          token_id: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className='text-left mb-5 mr-2 w-[18rem]'>
                  <label className='text-custom-blue text-sm font-bold mb-2'>
                    Wallets to Approve
                  </label>
                  {walletInfo.approvedWallets.map((wallet, i) => (
                    <div className='flex flex-start my-4' key={i}>
                      <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                        type='text'
                        placeholder='Wallet Address'
                        value={wallet}
                        onChange={(e) => {
                          let wallets = walletInfo.approvedWallets;
                          wallets[i] = e.target.value;
                          setwalletInfo({
                            ...walletInfo,
                            approvedWallets: wallets,
                          });
                        }}
                      />
                      <button
                        className='bg-custom-blue/90 hover:bg-custom-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-4'
                        type='button'
                        onClick={() => {
                          let wallets = walletInfo.approvedWallets;
                          wallets.push('');
                          setwalletInfo({
                            ...walletInfo,
                            approvedWallets: wallets,
                          });
                        }}>
                        +
                      </button>
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <button
                  className='bg-custom-blue/90 hover:bg-custom-blue text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                  type='submit'>
                  Submit
                </button>
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
