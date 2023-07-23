import Image from 'next/image'
import React, { useContext } from 'react'
import styles from "../../components/Navbar.module.css"
import { NftTypes } from '../../config/models'
import { StoreContext } from '../../utils/Store'
import NftSignatureBox from '../NftSignatureBox/NftSignatureBox'

const ClaimNft = ({ product, onClaimWithEmail, onClaimToWallet, onClaimNow, signIn, signUp, ownerTokens,handlePrice }) => {
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
      <div className='w-full h-[35vh] md:h-[24vh] bg-catalogue-background-1 bg-cover flex justify-center items-end'>
        <div className='w-full flex items-center justify-center p-4 text-center'>
          <h1 className={'text-2xl my-2 w-full ' + styles.arcadeFont}>CLAIM THE FREE NFT ASSOCIATED WITH YOUR ITEM!</h1>
        </div>
      </div>
      <div className='w-full grid grid-cols-3 justify-center gap-x-16 p-4 md:p-12'>
        <div className='col-span-3 md:col-span-1' >
          <img src={product.nft_image_url} alt='' width='100%' height='100%' layout="responsive" objectFit="contain" />
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
            <a href={`/claimlocalnft/${product.id}`} className='text-custom-blue text-sm'>View Product Details</a>
          </div>
          <div className=' min-h-[60px] '>
            {
              product.collection.type === NftTypes.SIGNABLE ? <NftSignatureBox tokenId={product.token_id} collectionAddress={product.collection.contract_address} /> :
                null
            }
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-x-12 gap-y-4'>
            
            {!onClaimToWallet ? null :
              <button
                className='py-3 px-8 bg-custom-blue w-full rounded-sm'
                onClick={onClaimToWallet}>
                Claim To My Wallet
              </button>
            }
            {/* {(onClaimWithEmail && !signIn) ? <button
              className='py-3 px-8 bg-blue-700 w-full rounded-sm'
              onClick={onClaimWithEmail}>
              Claim To Local Wallet
            </button> : null
            } */}
            {!ownerTokens ? null :
              <h4 className='text-custom-blue text-center'>Tokens in wallet: {ownerTokens}</h4>
            }
            {!onClaimNow ? null :
              <button
                className='py-3 px-8 bg-custom-blue w-full rounded-sm'
                onClick={onClaimNow}>
                Claim Now
              </button>
            }
            {
              !(signIn && !state?.user?.id) ? null :
                <button
                  className='py-3 px-8 bg-custom-blue w-full rounded-sm'
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
            <h2 className="text-center text-sky-400 text-xl tracking-wide">Discover More</h2>
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

export default ClaimNft