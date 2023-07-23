import React, { useContext, useState } from 'react';

import { StoreContext } from '../../../utils/Store';

import axios from 'axios';

import AdminLayout from '../../../components/layouts/AdminLayout';
import Link from 'next/link';
import AlertModal from '../../../components/Modal/AlertModal';
import { blockchains, NftStandard, NftTypes } from '../../../config/models';

export default function add() {

  const initialState = {
    name: '',
    contract_address: '',
    blockchain: blockchains.POLYGON,
    website_link: '',
    image: '',
    description: '',
    type: NftTypes.SIGNABLE,
    standard: NftStandard[1155]
  }
  const [newCollection, setNewCollection] = useState(initialState);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorText, setErrorText] = useState('');

  const { state, dispatch } = useContext(StoreContext);

  const { user, jwt } = state;
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

  const validate = () => {
    console.log(newCollection);
    if (newCollection?.name.length == 0) {
      return { success: false, error: 'Please provide a name!' };
    }
    if (newCollection?.contract_address.length == 0) {
      return { success: false, error: 'Please provide the Contract Address' };
    }
    if (newCollection?.contract_address.length !== 42) {
      return { success: false, error: 'Invalid Contract Address' };
    }

    return { success: true, error: '' };
  };

  const addNewCollection = async (e) => {
    e.preventDefault();
    try {
      let valid = validate(newCollection);
      if (valid.success) {
        const data = await axios.post('/backend/collections/addNewCollection', {
          ...newCollection,
        });
        console.log(data);
        setShowSuccessModal(true);
        setNewCollection(initialState);
        // Router.reload();
      } else {
        setErrorText(valid.error);
        setShowAlertModal(true);
        console.log('Fill all the fields');
      }
    } catch (err) {
      console.log(err.response);
      if (err?.response?.data?.msg) {
        setErrorText(err.response.data.msg);
        setShowAlertModal(true);
      } else {
        setErrorText('Sorry something went wrong');
        setShowAlertModal(true);
      }
    }
  };

  return (
    <div className='flex text-gray-800'>
      {/* {AletModalComponent()} */}
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
      <AdminLayout>
        <div className=' container col-span-4  justify-center mt-4 mx-5  '>
          <div className=' font-bold  text-2xl text-slate-700 mb-10'>
            Add Collection
          </div>

          <div className='  '>
            <form onSubmit={addNewCollection}>
              <div className='flex flex-wrap justify-start'>
                <div className='text-left mb-5 mr-2 w-[18rem]'>
                  <label className='text-gray-600 text-sm font-bold mb-2'>
                    Collection Name
                  </label>
                  <input
                    className='shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    placeholder='Name'
                    value={newCollection.name}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2 mt-2'>
                      Blockchain
                    </label>

                    <select
                      value={newCollection.blockchain}
                      className='shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={(e) => {
                        setNewCollection({
                          ...newCollection,
                          blockchain: e.target.value,
                        });
                      }}>
                        <option key={blockchains.POLYGON} value={blockchains.POLYGON}>
                          Polygon
                        </option>
                        <option key={blockchains.ETHEREUM} value={blockchains.ETHEREUM}>
                          Ethereum
                        </option>
                    </select>
                  </div>

                <div className='text-left mb-5 mr-2 w-[18rem]'>
                  <label className='text-gray-600 text-sm font-bold mb-2 mt-2'>
                    Contract Address
                  </label>

                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    placeholder='Enter Contract Address'
                    value={newCollection.contract_address}
                    onChange={async (e) => {
                      setNewCollection({
                        ...newCollection,
                        contract_address: e.target.value,
                      });
                      // await getContractInfo(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className='flex flex-wrap justify-start'>
                <div className='text-left mb-5 mr-2 w-[18rem]'>
                  <label className='text-gray-600 text-sm font-bold mb-2 mt-2'>
                    Image URL
                  </label>

                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    placeholder='Logo Image URL'
                    value={newCollection.image}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        image: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='text-left mb-5 mr-2 w-[18rem]'>
                  <label className='text-gray-600 text-sm font-bold mb-2 mt-2'>
                    Description
                  </label>

                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    placeholder='Etner description'
                    value={newCollection.description}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='text-left mb-5 mr-2 w-[18rem]'>
                  <label className='text-gray-600 text-sm font-bold mb-2 mt-2'>
                    Website Link
                  </label>

                  <input
                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                    type='text'
                    placeholder='Enter Website URL'
                    value={newCollection.website_link}
                    onChange={(e) =>
                      setNewCollection({
                        ...newCollection,
                        website_link: e.target.value,
                      })
                    }
                  />
                </div>

                <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2 mt-2'>
                      Select Type
                    </label>

                    <select
                      value={newCollection.type}
                      className='shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={(e) => {
                        setNewCollection({
                          ...newCollection,
                          type: e.target.value,
                        });
                      }}>
                        <option key={NftTypes.SIGNABLE} value={NftTypes.SIGNABLE}>
                          Signable
                        </option>
                        <option key={NftTypes.CLAIMABLE} value={NftTypes.CLAIMABLE}>
                          Claimable
                        </option>
                    </select>
                  </div>

                  <div className='text-left mb-5 mr-2 w-[18rem]'>
                    <label className='text-gray-700 text-sm font-bold mb-2 mt-2'>
                      Select Type
                    </label>

                    <select
                      value={newCollection.standard}
                      className='shadow  border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                      onChange={(e) => {
                        setNewCollection({
                          ...newCollection,
                          standard: e.target.value,
                        });
                      }}>
                        <option key={NftStandard[1155]} value={NftStandard[1155]}>
                          1155
                        </option>
                        <option key={NftStandard[721]} value={NftStandard[721]}>
                          721
                        </option>
                    </select>
                  </div>

                {/* <label className="text-gray-700 text-sm font-bold mb-2 mt-2">
                  Count of NFTs
                </label>

                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  value={newCollection.count}
                  onChange={(e) => {
                    setNewCollection({
                      ...newCollection,
                      count: e.target.value,
                    });
                  }}
                ></input> */}

                {/* Submit */}
              </div>
              <div>
                <button
                  className='bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded transition-all'
                  type='submit'>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}
