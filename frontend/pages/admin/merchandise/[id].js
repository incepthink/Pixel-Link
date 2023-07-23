import React, { useState, useContext } from 'react';

import { StoreContext } from '../../../utils/Store';

import axios from 'axios';
import Image from 'next/image';

import LeftNav from '../../../components/adminPanel/LeftNav';

import cookie from 'cookie';
import Router from 'next/router';
import AdminLayout from '../../../components/layouts/AdminLayout';
import StantardModal from '../../../components/Modal/StantardModal';

export default function variationPage({ product }) {
  const [newVariationOptionCount, setNewVariationOptionCount] = useState(0);

  const { state, dispatch } = useContext(StoreContext);
  const [addVariationsModal, setAddVariationsModal] = useState(false);

  const user = state.user;
  const jwt = state.jwt;
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

  const addValueToVariation = async (v) => {
    await axios
      .post(
        `/backend/admin/updateValuesOfVariation/`,
        {
          name: document.getElementById(v.id + '_newValue').value,

          product_variant_id: v.id,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(
        '/backend/admin/makeCombinations',
        {
          merch_id: product.id,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewVariation = async (e) => {
    e.preventDefault();
    let valid = 0;

    const variation = {
      name: document.getElementById('newVariationName').value,
    };
    if (!variation.name) {
      valid = valid + 1;
    }
    const variation_options = [...Array(newVariationOptionCount)].map(
      (_, i) => {
        let value = document.getElementById(`newVariationOptionName${i}`).value;
        if (value) {
          return {
            name: value,
          };
        } else {
          valid = valid + 1;
        }
      }
    );
    if (valid < 1) {
      // console.log(variation_options);
      await axios.post('/backend/admin/addNewVariation', {
        variation,
        variation_options,
        merch_id: product.id,
      });

      Router.reload();
    } else {
      console.log('Invalid input');
    }
  };

  const addVariationsComponent = () => {
    return (
      <StantardModal
        showModal={addVariationsModal}
        setShowModal={setAddVariationsModal}
        title='Add Variation'>
        <div className='p-5 flex flex-col text-center'>
          <h1 className='text-2xl font-bold'>Add new Variations</h1>

          <form className='p-5 bg-gray-300'>
            <input
              type='text'
              placeholder='Name'
              className='w-full p-2 rounded-2xl'
              id='newVariationName'
            />
            {[...Array(newVariationOptionCount)].map((_, i) => (
              <div key={i}>
                <input
                  type='text'
                  placeholder='Option Value'
                  className='w-full'
                  id={`newVariationOptionName${i}`}
                />
              </div>
            ))}
            <label>Add new values for the variation</label>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded '
              onClick={async (e) => {
                e.preventDefault();
                setNewVariationOptionCount(newVariationOptionCount + 1);
              }}>
              +
            </button>
            <br />

            <button
              className='bg-blue-500 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2'
              onClick={addNewVariation}>
              Add Variation
            </button>
          </form>
        </div>
      </StantardModal>
    );
  };

  return (
    <div className='flex text-gray-800'>
      <AdminLayout>
        {addVariationsComponent()}
        <div className=' w-full container   mx-5 text-gray-700'>
          <div className='px-5 py-3 flex flex-col border-slate-200 bg-gray-50 border-2 rounded-lg shadow-lg'>
            <div className='flex p-4'>
              <div className='flex flex-col col-span-1'>
                <span className='w-56 overflow-hidden rounded-xl bg-black'>
                  {' '}
                  <img
                    className='mx-auto w-full object-cover'
                    src={product.nft_image_url}
                    width='200'
                  />
                </span>
              </div>
              <div className='flex flex-col col-span-4 px-5 flex-1 '>
                <div>
                  <h1 className='text-4xl font-semibold   '>
                    {product.name}
                  </h1>
                  <p>{product.description}</p>
                  <div className='felx mb-5'>
                    <span className='mr-5'>Token ID:{product.token_id}</span>

                    <span>Merch ID:{product.id}</span>
                  </div>
                  <h3>Collection: {product.collection.name}</h3>
                </div>
                <div className='mt-10 w-full'>
                  <div className='flex justify-between'>
                    <h1 className='text-2xl font-bold'>Variations</h1>
                    <button
                      className='  mx-5 px-4 py-2 rounded-lg  bg-slate-500 text-white hover:bg-slate-600 transition-all'
                      onClick={() => setAddVariationsModal(true)}>
                      {' '}
                      + Add Variation
                    </button>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Values</th>
                        <th className='px-4 py-2'>Add Value </th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variation.map((v) => (
                        <tr key={v.id}>
                          <td className='border px-4 py-2'>{v.id}</td>
                          <td className='border px-4 py-2'>{v.name}</td>
                          <td className='border px-4 py-2'>
                            {v.options.map((option) => (
                              <div key={option.value_id}>{option.name}</div>
                            ))}
                          </td>
                          <td className='border px-4 py-2 flex flex-col items-center '>
                            <input
                              type='text'
                              placeholder='Add Value'
                              className='w-full'
                              id={v.id + '_newValue'}
                            />

                            <button
                              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2'
                              onClick={() => addValueToVariation(v)}>
                              Add Value
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className='col-span-3'>
            <div className='p-5 flex flex-col text-center'>
              <h1 className='text-2xl font-bold'>Manage Stocks (SKU)</h1>
              <table>
                <thead>
                  <tr>
                    <th className='px-4 py-2'>ID</th>
                    <th className='px-4 py-2'>SKU</th>
                    <th className='px-4 py-2'>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {product.merchandise_skus.map((sku) => (
                    <tr key={sku.id}>
                      <td className='border px-4 py-2'>{sku.sku_id}</td>
                      <td className='border px-4 py-2'>{sku.sku}</td>
                      <td className='border px-4 py-2'>
                        <div className='flex flex-row'>
                          <input
                            type='text'
                            placeholder='Quantity'
                            className='w-full'
                            id={sku.id + '_newQuantity'}
                            value={sku.stock_quantity}
                          />
                          <button
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/2'
                            onClick={async (e) => {
                              e.preventDefault();
                              await axios
                                .post('/backend/admin/updateStockQuantity', {
                                  sku_id: sku.id,
                                  stock_quantity: document.getElementById(
                                    sku.id + '_newQuantity'
                                  ).value,
                                })
                                .then((res) => {
                                  console.log(res);
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            }}>
                            Update Quantity
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  const cookies = cookie.parse(context.req.headers.cookie);

  const user = JSON.parse(cookies.user);

  const wallet = user.user_instance.id;

  const { data } = await axios.get(
    `${process.env.API}/merchandise/forTableWithVari?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${cookies.jwt}`,
        'X-Id-Token': wallet,
      },
    }
  );


  const product = data.merch;

  console.log("product",data);

  return {
    props: {
      product,
    },
  };
}
