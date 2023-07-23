import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../utils/Store';
import cookie from 'cookie';
import { ethers } from 'ethers';
import NFTABI from '../../utils/NftApparelABI.json';
import AlertModal from '../../components/Modal/AlertModal';
import ClaimNft from '../../components/claimNft/ClaimNft';

export default function ProductPage({ product, variations }) {
  const { state, dispatch } = useContext(StoreContext);
  const [localVariation, setLocalVariation] = useState([]);
  const [ownerTokens, setOwnerTokens] = useState(0);
  const [isAddToCartModal, setIsAddToCartModal] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isErrorModal, setIsErrorModal] = useState(false);


  let x = variations.map((variation, index) => ({
    [variation.name]: { options: variation.options[0], id: variation.id },
  }));

  useEffect(() => {
    setLocalVariation(x);
  }, []);

  const router = useRouter();

  const [sizeIndex, setSizeIndex] = useState(0);

  const [colorIndex, setColorIndex] = useState(0);

  const submitOrder = () => {

    let obj = {
      ...product,
      variations: localVariation,
    };
    dispatch({
      type: 'ADD_TO_CART',
      payload: obj,
    });
    localStorage.setItem('cart', JSON.stringify([obj]));
    setOwnerTokens(ownerTokens - 1);
  };

  const selectedCheck = (index) => {
    if (index == sizeIndex) {
      return 'border-2 rounded-full p-4 border-cyan-500';
    } else {
      return 'border-2 rounded-full p-4';
    }
  };

  const getOwnedTokenInfo = async () => {
    try {
      // console.log(collection);
      let NFTCONTRACT = product.collection.contract_address;
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      let contract = new ethers.Contract(NFTCONTRACT, NFTABI, provider);
      // console.log(contract);
      let address = state.user.wallet_address;
      let balance = await contract.balanceOf(address, product.token_id);
      // console.log(b);
      console.log("BAL", balance.toNumber());
      setOwnerTokens(balance.toNumber() + 1);
    } catch (e) {
      console.log("Error gettting token info", e);
    }
  };

  useEffect(() => {
    getOwnedTokenInfo();
  }, []);

  const onAddToCard = () => {

    try {
      if (ownerTokens <= 0) {
        setErrorText("You don't have enough tokens to claim this item");
        setIsErrorModal(true);
        throw { msg: "You don't have enough tokens to claim this item" };
      }
      submitOrder();
      setIsAddToCartModal(true);
    } catch (err) {
      console.log(err)
    }
  }
  const onClaimNow = () => {

    if (!product.claimable)  {
      setErrorText("You cannot claim this item. This is a claimed token!");
      setIsErrorModal(true);
      return;
    }

    try {
      submitOrder();
      router.push("/setAddress");
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='max-w-screen-xl font-gothom_pro  '>
      <AlertModal
        showModal={isAddToCartModal}
        setShowModal={setIsAddToCartModal}
        text="Added Item to Cart"
        type='success'
        confirmButtonText="Go to Cart"
        onConfirm={() => router.push('/cart')}
      />
      <AlertModal
        showModal={isErrorModal}
        setShowModal={setIsErrorModal}
        text={errorText}
        type='error'
      />
      <ClaimNft product={product} onClaimNow = {onClaimNow} ownerTokens={ownerTokens}/>
    </div>
  );
}

/*
<div className='flex flex-col  md:flex-row'>
        <div className='  xl:w-96 lg:w-[25rem] w-full max-h-96  aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8'>
          <img
            src={product.nft_image_url}
            alt={product.token_id}
            className='w-full h-96 object-center object-cover group-hover:opacity-75'
          />
        </div>
        <div className=' flex-1  p-3 lg:px-16 lg:pt-2 w-full '>
          <div className='min-h-[10rem] mb-10'>
            <h1 className='font-thin text-lg'>{product.collection.name}</h1>
            <p className=' text-3xl font-bold mt-2'>
              // {product.contract_address.slice(0, 30) + "..."}
              {product.name}
            </p>
            <h1 className='font-thin text-base mt-2'>
              {product.token_id}
              {product.type}
            </h1>
            <div className='text-md font-thin mt-2 min-h-20'>
              {product.description}
            </div>
            <div className='mt-2 mb-2 font-bold text-sky-700 '>Tokens in wallet: {ownerTokens}</div>
            {product.collection.type === NftTypes.SIGNABLE ? (
              <NftSignatureBox tokenId={product.token_id} collectionAddress={product.collection.contract_address} />
            ) : null}
          </div>
          <a className='text-neutral-500 mt-2 mb-2'>View Product Details</a>
          {/* <p className="product__rating mt-10  font-bold text-lg">
            Rating : {product.rating.rate}
          </p> */

          /*<div className={``}>
            {variations.length > 0 ? (
              variations.map((variation, index) => {
                console.log(variation);
                return (
                  <div>
                    <p className='product__size text-lg font-bold'>
                      {variation.name}
                    </p>
                    <select
                      className='product__size-select'
                      value={
                        variations[index][
                        variation[index] ? variation[index] : '0'
                        ]
                      }
                      onChange={(e) => {
                        // setSizeIndex(e.target.selectedIndex);
                        // console.log(e.target.value);

                        let oldArr = [...localVariation];
                        oldArr[index] = {
                          [variation.name]: {
                            options: variation.options[e.target.value],
                            id: variation.id,
                          },
                        };

                        setLocalVariation(oldArr);
                      }}>
                      {variation.options.map((v, index) => {
                        return <option value={index}>{v.name}</option>;
                      })}
                    </select>
                  </div>
                );
              })
            ) : (
              <div className='col-span-12'>
                <p className='text-md font-bold'>Nil</p>
              </div>
            )}



            <div className=' mt-2 flex flex-col md:flex-row w-full lg:w-2/5 xl:w-1/3'>
              <button
                onClick={onClaimNow}
                className={
                  ' mt-1 rounded-md lg:px-5 px-1   w-full py-2  text-center   text-white text-lg   shadow-lg transition-all hover:shadow-sky-300 mr-4 ' +
                  styles.login
                }>
                Claim Now
              </button>
              {/* <button
                onClick={onAddToCard}
                className={
                  ' mt-1 rounded-md lg:px-5 px-1   w-full py-2  text-center   text-white text-lg   shadow-lg transition-all hover:shadow-sky-300 mr-4 ' +
                  styles.login
                }>
                Add To Cart
              </button> */
          /*  </div>
          </div>
          <p className='text-sm my-5  text-slate-500 max-w-[35rem]'>*When claiming the NFT, the NFT in your wallet will be BURNED and your merch will be claimed and shipped to your address. In addition, a new NFT will be MINTED stating your proof of ownership over the claimed NFT Merch. </p>

        </div>
      </div>
      <div className='mt-16 flex flex-col justify-center w-5/6 mx-auto mb-64'>
        <div className='border-y-2 py-4 font-semibold text-base text-center'>
          Description
        </div>
        <div className='mt-4 leading-8 text-slate-700 mb-8 px-24'>
          Seamlessly predominate enterprise metrics without performance based
          process improvements.Seamlessly predominate enterprise metrics without
          performance .Lorem Ipsum is simply dummy text of the printing and
          typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text. The point of using Lorem Ipsum is that it has a
          more-or-less normal distribution of letters, Lorem Ipsum is simply
          dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text. It is a long established fact
          that a reader will be distracted by the readable content of a page
          when looking at its layout. The point of using Lorem Ipsum is that it
          has a more-or-less normal distribution of letters.
        </div>
      </div>
*/

export async function getServerSideProps(context) {
  const { id } = context.query;
  const cookies = cookie.parse(context.req.headers.cookie);

  const { data: product } = await axios.get(
    `${process.env.API}/merchandise/singleMerch/${id}`
  );

  var { data: variations } = await axios.get(
    `${process.env.API}/merchandise/forTableWithVari?id=${id}`

  );

  variations = variations.merch.variation;
  console.log(product);

  return {
    props: {
      product,
      variations,
    },
  };
}
