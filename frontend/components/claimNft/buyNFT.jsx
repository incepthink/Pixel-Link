import Image from 'next/image'
import React, { useContext,useEffect, useState } from 'react'
import styles from "../../components/Navbar.module.css"
import { NftTypes } from '../../config/models'
import { StoreContext } from '../../utils/Store'
import NftSignatureBox from '../NftSignatureBox/NftSignatureBox'
import { init, useQuery } from "@airstack/airstack-react";
import { TokensQuery } from './airstackqueries'
init("920a8bf2707d478dba97e41ec001b799");



const BuyNFT = ({ product, onClaimWithEmail, onClaimToWallet, onClaimNow, signIn, signUp, ownerTokens,handlePrice }) => {
  const { data, loading, error } = useQuery(TokensQuery);
  const [tokenBal, setTokenBal] = useState(null);

  useEffect(() => {
    if (data) {
      console.log("data",data.TokenBalances.TokenBalance[0].formattedAmount
      )
      setTokenBal(data.TokenBalances.TokenBalance[0].formattedAmount)
    }
  }, [data,loading]);



  const { state, dispatch } = useContext(StoreContext)
  console.log(signIn && !state?.user?.id)
  //* Returning this incase there is no product (wrong link or server side issues)
  if (!product) {
    return (
      <div className='h-[90vh] w-full text-white flex items-center justify-center'>Wrong Link</div>
    )
  } else {
    console.log(product);
  }

  return (
    <div className='max-w-screen w-full text-white bg-black font-manrope'>
      <div className='w-full h-[5vh] md:h-[24vh]  bg-cover flex justify-center items-end'>

      </div>
      <div className='w-full grid grid-cols-3 justify-center gap-x-16 p-4 md:p-2'>
        <div className='col-span-3 md:col-span-1' >
          <img src={product.nft_image_url} alt='' width='80%' height='80%' layout="responsive" objectFit="contain" />
        </div>
        <div className='col-span-3 md:col-span-2'>
          <div>
            <h1 className='text-4xl font-semibold mt-4 md:mt-0'>{product.name}</h1>
          </div>
          <h2 className='my-4 text-lg font-semibold'>{product.collection?.name}</h2>
          <h3 className='font-sm'>{product.description}</h3>
          
          <div className='flex flex-col-reverse gap-y-8 md:flex-row justify-between my-6'>
            {
              /* <div className='border-[1px] py-3 px-3 md:w-[40%]'>
                              <select className='bg-transparent px-8 w-full'>
                                  <option selected>UK 10</option>
                              </select>
                          </div> */
            }
            
          </div>
          <div className='text-2xl'>Utilities</div>
          <div className='flex flex-wrap justify-start gap-6 '>
            <div class="h-auto w-auto p-6 mt-8 rounded-lg bg-green-800 border border-green-300 hover:bg-green-400 transition-all ">
              <div className='font-semibold'>
                Cool Glasses
              </div>
              <div className='text-sm'>Get a free pair of glasses at Nouns Conference </div>
            </div>
            <div class="h-auto w-auto p-6 mt-8 rounded-lg bg-green-800 border border-green-300 hover:bg-green-400 transition-all ">
              <div className='font-semibold'>
              Team Fox
              </div>
              <div className='text-sm'>Access to the Foxes Community Lounge </div>
            </div>
            <div class="h-auto w-auto p-6 mt-8 rounded-lg bg-green-800 border border-green-300 hover:bg-green-400 transition-all ">
              <div className='font-semibold'>
              NOUNS Member
              </div>
              <div className='text-sm'>Your ticket to Nouns Convention </div>
            </div>
            
            
            </div>
          <div className=' min-h-[60px] '>
            {
              product.collection.type === NftTypes.SIGNABLE ? <NftSignatureBox tokenId={product.token_id} collectionAddress={product.collection.contract_address} /> :
                null
            }
          </div>
          <h3 className=' text-xl mt-4 font-bold'>Price:  <span className=' text-green-400'>{product.price} APEX</span></h3>
            <div className='text-xl font-semibold my-2'>Balance: <span className=' text-green-400'>{tokenBal?tokenBal+" ApeX":"loading.."}</span></div>
          <div className='grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-x-12 gap-y-4'>

          <button
                className='py-3 px-8 bg-green-500  w-1/2 rounded-full mt-2'
                onClick={onClaimToWallet}>
                Buy NFT 
              </button>
            
            
            {!ownerTokens ? null :
              <h4 className='text-custom-blue text-center'>Tokens in wallet: {ownerTokens}</h4>
            }
            {!onClaimNow ? null :
              <button
                className='py-3 px-8 bg-green-500 w-full rounded-sm'
                onClick={onClaimNow}>
                Claim Now
              </button>
            }
            {
              !(signIn && !state?.user?.id) ? null :
                <button
                  className='py-3 px-8 bg-green-500 w-full rounded-sm'
                  onClick={signIn}>
                  Sign In
                </button>
            }
            {
              !(signUp && !state?.user?.id) ? null :
                <button
                  className='py-3 px-8 bg-blue-700 w-full rounded-sm'
                  onClick={signUp}>
                  Sign Up
                </button>
            }
            {!(onClaimWithEmail && signIn && state?.user?.id) ? null :
              <button
                className='py-3 px-8 bg-blue-700 w-full rounded-sm'
                onClick={onClaimWithEmail}>
                Claim To Local Wallet
              </button>
            }
          </div>
        </div>
        <div className='flex flex-col w-full items-center col-span-3'>
          {!onClaimNow ? null :
            <div className='max-w-4xl text-center my-8 font-thin'>
              When claiming the NFT, the NFT in your wallet will be BURNED and your merch will be claimed and shipped to your address. In addition, a new NFT will be MINTED stating your proof of ownership over the claimed NFT Merch.
            </div>
          }
          <div className='w-full text-left my-8 max-w-4xl'>
            <h1 className='text-3xl'>Description</h1>
            <h2 className='text-sm font-thin mt-4'>Seamlessly predominate enterprise metrics without performance based process improvements. Seamlessly predominate enterprise metrics without performance.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.</h2>
          </div>
          <div className='w-full my-8 max-w-5xl'>
            <h2 className="text-center text-green-400 text-xl tracking-wide">Discover More</h2>
            <h1 className='text-center text-4xl tracking-wide font-semibold'>Products</h1>
          </div>
          {/* <div className="max-w-5xl w-full font-thin flex flex-col md:flex-row text-white items-center justify-around font-manrope md:my-4">
            <CollectionItem img={product.nft_image_url} heart={false} name={product.name} description={product.description} />
            <CollectionItem img={product.nft_image_url} heart={false} name={product.name} description={product.description} />
          </div>
          <div className="max-w-5xl w-full font-thin flex flex-col md:flex-row text-white items-center justify-around font-manrope md:my-4">
            <CollectionItem img={product.nft_image_url} heart={false} name={product.name} description={product.description} />
            <CollectionItem img={product.nft_image_url} heart={false} name={product.name} description={product.description} />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default BuyNFT