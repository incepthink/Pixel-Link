import React, { useEffect, useState, useContext } from 'react';

import axios from 'axios';

import LeftNav from '../../../components/adminPanel/LeftNav';

import { StoreContext } from '../../../utils/Store';
import { ethers } from 'ethers';
import NFTABI from '../../../utils/NftApparelABI.json';

import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import AdminLayout from '../../../components/layouts/AdminLayout';
import AlertModal from '../../../components/Modal/AlertModal';
import LoadingModal from '../../../components/Modal/LoadingModal';

export default function merchandise() {
  const { state, dispatch } = useContext(StoreContext);

  const { jwt } = state;
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  const initialState = {
    token_id: '',
    collection_id: '',
    description: '',
    nft_image_url: '',
    opensea_link: '',
    name: '',
    type: '',
    claimable: false
  };

  const [merchandise, setMerchandise] = useState([]);

  const [loading, setLoading] = useState(false);

  const [newMerch, setNewMerch] = useState(initialState);

  const [collections, setCollections] = useState([]);
  const [collectionIndex, setCollectionIndex] = useState(0);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorText, setErrorText] = useState('');

  // console.log(collectionID);

  const getCollections = async () => {
    try {
      const res = await axios.get(`/backend/collections/`);
      console.log(res.data);
      if (res.data.length == 0) {
        setErrorText(
          'Sorry, No Collections found. Please add collection first.'
        );
        setShowAlertModal(true);
      }
      console.log(res.data);
      setCollections(res.data);
      setNewMerch({
        ...newMerch,
        collection_id: res.data[0].id,
      });
    } catch (err) {
      setErrorText('Sorry, error getting collections');
      setShowAlertModal(true);
      console.log('err', err);
    }
  };

  const getContractInfo = async () => {
    let contractAddr = newMerch['contract_address'];
    let token_id = newMerch['token_id'];
    try {
      const providers = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      console.log(contractAddr.length);
      if (contractAddr.length === 42) {
        let contract = new ethers.Contract(contractAddr, NFTABI, providers);
        // let address = state.user.user_instace.wallet_address;

        let uri = await contract.uri(token_id);
        let contractData = await axios.get(uri);
        contractData = contractData.data;
        console.log(contractData);
        let tmpCollection = newMerch;
        // tmpCollection["name"] = contractData["name"];
        // tmpCollection["description"] = contractData["description"];
        tmpCollection['nft_image_url'] = contractData['image'];
        // tmpCollection["website_link"] = contractData["external_url"];
        tmpCollection['contract_address'] = contractAddr;
        tmpCollection['token_id'] = token_id;
        setNewMerch(tmpCollection);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const fetchNFTData = async () => {
    console.log(collectionIndex);
    if (newMerch.token_id.match(/^-?\d+$/)) {
      setLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          'any'
        );
        const signer = provider.getSigner();
        let contract = new ethers.Contract(
          collections[collectionIndex].contract_address,
          NFTABI,
          signer
        );
        let jsonUrl = await contract.uri(newMerch.token_id);
        console.log(jsonUrl);
        let res = await axios.get(jsonUrl);
        console.log(res);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log('err', err);
        setErrorText('Sorry, an error occured, Please enter values manually');
        setShowAlertModal(true);
      }
    } else {
      setErrorText('Enter valid tokenID');
      setShowAlertModal(true);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const addNewMerch = async (e) => {
    e.preventDefault();
    if (collections.length == 0) {
      setErrorText('Need atleast one collection');
      setShowAlertModal(true);
    }
    if (!newMerch.token_id.match(/^-?\d+$/)) {
      setErrorText('Enter valid tokenID');
      setShowAlertModal(true);
      return;
    }
    if (newMerch.name.length == 0) {
      setErrorText('Please give item a name!');
      setShowAlertModal(true);
      return;
    }
    setLoading(true);
    console.log(newMerch);
    try {
      const { data } = await axios.post('/backend/merchandise/addNewMerch', {
        ...newMerch,
        collection_id: collections[collectionIndex].id,
      });
      console.log(data);
      // Router.reload();
      setLoading(false);
      setShowSuccessModal(true);
      setNewMerch(initialState);
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
          text='Collection Added Successfully'
          type='success'
        />
        <LoadingModal showModal={loading} />
        <div className=' w-full container   mx-5  '>
          <div className='flex flex-col '>
            <div className=' flex flex-col '>
              <div className=' font-bold  text-2xl text-slate-700 mb-10'>
                Enter New Merchandise
              </div>
              <form onSubmit={addNewMerch}>
                <div className='flex flex-wrap justify-start'>
                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2 mt-2'>
                      Select Contract
                    </label>

                    <select
                      value={collectionIndex}
                      className='shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={(e) => setCollectionIndex(e.target.value)}>
                      {collections.map((collection, i) => (
                        <option key={i} value={i}>
                          {collection.name}
                        </option>
                      ))}
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
                      value={newMerch.token_id}
                      onChange={(e) =>
                        setNewMerch({ ...newMerch, token_id: e.target.value })
                      }
                    />
                  </div>
                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2'>
                      Name
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Name'
                      value={newMerch.name}
                      onChange={(e) =>
                        setNewMerch({ ...newMerch, name: e.target.value })
                      }
                    />
                  </div>
                </div>
                {/* <button
                  className='bg-slate-500 hover:bg-slate-700 text-white h-10 font-bold py-2 px-4 rounded transition-all'
                  type='button'
                  onClick = {fetchNFTData}
                  >
                  Fetch NFT Data
                </button> */}
                <div className='flex flex-wrap justify-start'>
                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2 mt-2'>
                      Type
                    </label>

                    <select
                      value={newMerch.type}
                      className='shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={(e) =>
                        setNewMerch({ ...newMerch, type: e.target.value })
                      }>
                      <option key='0' value='thisrt'>
                        T-Shirt
                      </option>
                      <option key='1' value='hoodie'>
                        Hoodie
                      </option>
                      <option key='2' value='cap'>
                        Cap
                      </option>
                      <option key='3' value='mug'>
                        Mug
                      </option>
                      <option key='4' value='other'>
                        Other
                      </option>
                    </select>
                  </div>

                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2 mt-2'>
                      Image URL
                    </label>

                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='Image URL'
                      value={newMerch.nft_image_url}
                      onChange={(e) =>
                        setNewMerch({
                          ...newMerch,
                          nft_image_url: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2 mt-2'>
                      OpenSea Link
                    </label>

                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      type='text'
                      placeholder='OpenSea Link'
                      value={newMerch.opensea_link}
                      onChange={(e) =>
                        setNewMerch({
                          ...newMerch,
                          opensea_link: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className='text-left mb-5 mr-2 w-1/2'>
                  <label className='text-gray-700 text-sm font-bold mb-2 mt-2'>
                    Description
                  </label>

                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    placeholder='Description'
                    value={newMerch.description}
                    onChange={(e) =>
                      setNewMerch({
                        ...newMerch,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className='text-left mb-5 mr-2 w-1/2'>
                  <label className='text-gray-700 text-sm font-bold mb-2 mt-2 pr-3'>
                    Claimable
                  </label>

                  <input
                   className="form-check-input  h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
                    type='checkbox'
                    onChange={(e) =>
                      setNewMerch({
                        ...newMerch,
                        claimable:!newMerch.claimable ,
                      })
                    }
                  />
                </div>

                {/* Submit */}
                <button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
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
