import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../utils/Store';
import Image from 'next/image';
import axios from 'axios';
import { ethers } from 'ethers';
import NFTABI from '../../utils/NftApparelABI.json';
import styles from '../../components/Navbar.module.css';

import { useRouter } from 'next/router';
import AlertModal from '../../components/Modal/AlertModal';
import LoadingModal from '../../components/Modal/LoadingModal';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import OrderModal from '../../components/Modal/OrderModal';

export default function Checkout() {
  const { state, dispatch } = useContext(StoreContext);

  const [sku, setSku] = useState('');

  const router = useRouter();

  const user = state.user;

  const jwt = state.jwt;
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

  const addressID = state.addressID;

  const cart = state.cart;

  const [address, setAddress] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);
  const [isConfirmationModal, setIsConfirmationModal] = useState(false);
  const [claimedToken, setClaimedToken] = useState({});
  const [txHash, setTxHash] = useState(null);

  const [product, setProduct] = useState({});

  //   console.log(cart[0]);

  useEffect(() => {
    console.log('state', state);
    if (cart.length > 0) {
      setProduct(cart[0]);
    }
    // else router.push("/catalog");
  }, []);

  // length of the cart variations
  useEffect(() => {
    if (user && jwt) {
      // console.log(cart);
      axios.get(`${process.env.API}/shippings/shipping/${addressID}`).then((res) => {
        // console.log('ADDRESS', res);
        setAddress(res.data);
      });
    }
  }, [cart]);

  // useEffect(() => {

  //   let tempSKU = "M" + cart[0].id;

  //   for (let i = 0; i < cart[0].variations.length; i++) {
  //     Object.keys(cart[0].variations[i]).map((key, index) => {
  //       // console.log(key);
  //       // console.log(cart[0].variations[i][key]);
  //       tempSKU +=
  //         "-" +
  //         cart[0].variations[i][key].id +
  //         cart[0].variations[i][key].options.value_id;
  //       console.log(tempSKU);
  //     });

  //     console.log(cart[0].variations[i]);
  //   }

  //   setSku(tempSKU);
  // }, []);

  const burnNft = async () => {
    console.log("CLAIM", product.collection.contract_address, user.wallet_address, product.token_id)
    try {
      const providers = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      const contract = new ethers.Contract(
        product.collection.contract_address,
        NFTABI,
        providers.getSigner(user.wallet_address)
      );
      const tx = await contract.burnAndClaim(product.token_id);
      const receipt = await tx.wait();
      console.log("BURN", receipt);
      return receipt;
    } catch (error) {
      throw {
        type: 'contract',
        error: error
      }
    }
  }

  const handleConfirm = async () => {
    if (!(user && jwt)) {
      setErrorText("Sorry, Cannot find user, please try again.");
      setIsErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {

      const order = {
        user_id: user.id,
        address_id: addressID,
        product: cart[0],
        sku: sku,
      };

      console.log("ORDER", order)

      let tx = await burnNft();
      let res = await axios.post(`${process.env.API}/orders/createOrder`, order)
      console.log("ORDER RES", res);
      // dispatch({
      //   type: "EMPTY_CART",
      // });
      // console.log(product, process.env.API)
      const { data } = await axios.post(
        `${process.env.API}/merchandise/getallbyIDs/`, [{
          id: product.token_id - 1,
          contract_id: product.collection.id
        }]
      );
      setTxHash(tx.transactionHash)
      console.log(data[0]);
      setClaimedToken(data[0])
      setIsLoading(false);
      setIsConfirmationModal(true);
    } catch (err) {
      setIsLoading(false);
      if (err?.type == 'contract') {
        console.log("ERROR BURN", err)
        setErrorText("Sorry, Something went wrong while claiming your NFT, please try again.");
        setIsErrorModal(true);
        return;
      }
      console.log("ERROR IN ORDER", err);
      setIsErrorModal(true);
      setErrorText("Sorry, something went wrong");
    }
  };

  return (
    <>
      <div className='max-w-screen-xl p-5 mx-auto container font-manrope text-white pt-40'>
        <AlertModal
          showModal={isErrorModal}
          setShowModal={setIsErrorModal}
          text={errorText}
          type='error'
        />
        <LoadingModal showModal={isLoading} />
        <OrderModal
          showModal={isConfirmationModal}
          setShowModal={setIsConfirmationModal}
          token={claimedToken}
          txhash={txHash}
          onConfirm={() => router.push("/user/myNfts")}
        />

        <hi className='text-3xl font-bold'>Claim & Checkout</hi>
        <div className='border-b-4 border-cyan-500 w-1/12 mt-2'></div>
        {product && (
          <div className=' mt-10'>
            <div className='flex flex-col  md:flex-row'>
              <div className='  xl:w-96 lg:w-[25rem] w-full max-h-96  aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8'>
                <img
                  src={product.nft_image_url}
                  alt={product.token_id}
                  className='w-full h-96 object-center object-cover group-hover:opacity-75'
                />
              </div>
              <div className=' flex-1  p-3 lg:px-16 lg:pt-2 w-full '>
                <div className='min-h-[8rem] mb-2'>
                  {product?.collection?.name && (
                    <h1 className='font-thin text-lg'>
                      {product.collection.name}
                    </h1>
                  )}
                  <p className=' text-3xl font-bold mt-2'>
                    {/* {product.contract_address.slice(0, 30) + "..."} */}
                    {product.name}
                  </p>
                  <h1 className='font-thin text-base mt-2'>
                    {/* {product.token_id} */}
                    {product.type}
                  </h1>
                  <div className='text-md font-thin min-h-20'>
                    {product.description}
                  </div>
                </div>
                <div>
                  <div className='text-xl text-bold mb-1 '>
                    Shipping Details
                  </div>
                  <div className=' md:w-1/2 w-full'>
                    <p className=' text-sm'>{address.street_address_2}</p>
                    <p className=' text-sm'>{address.city}</p>
                    <p className=' text-sm'>{address.street_address_1}</p>
                    <p className=' text-sm'>{address.state}</p>
                    <p className=' text-sm'>{address.country}</p>
                  </div>
                </div>

                <div className={``}>
                    <div className='bg-emerald-900 p-3 rounded-lg my-5 w-2/3 '>
                  <p className='text-sm    text-white max-w-[35rem]'>
                    IMPORTANT: When you claim your NFT the NFT will be burned
                    and destroyed and a new NFT will be minted to your wallet in
                    its place proving your ownership over the physical
                    collectible item.
                  </p>
                  </div>
                  <div className=' mt-2 flex flex-col md:flex-row w-full lg:w-4/5 x'>
                    <button
                      onClick={handleConfirm}
                      className={
                        ' mt-1 rounded-md lg:px-5 px-1   w-full py-2  text-center   text-white text-lg   shadow-lg transition-all hover:shadow-sky-300 mr-4 ' +
                        styles.login
                      }>
                      Claim & Burn
                    </button>
                  </div>
                </div>
              </div>
            </div>


          </div>
        )}
      </div>
    </>
  );
}