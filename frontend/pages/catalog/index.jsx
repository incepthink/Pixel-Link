import Head from 'next/head';
import axios from 'axios';
// import Image from "next/image";
import Filters from '../../components/Filters';
import { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../utils/Store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import NFTABI from '../../utils/NftApparelABI.json';
import styles from '../../components/Navbar.module.css';
import designStyles from "../../components/home/effects.module.scss";
import TransparentButton from '../../utils/buttons/TransparentButton';

const catalogStyles = {
  paraHead: 'text-lg md:text-2xl font-semibold tracking-wide',
  para: 'font-light my-1 tracking-wide',
}

export default function Catalog({ collectionList }) {
  const { state, dispatch } = useContext(StoreContext);

  const router = useRouter();


  const [openFilter, setOpenFilter] = useState(false);
  const [ownedTokens, setOwnedTokens] = useState();

  const toggleFilters = () => {
    setOpenFilter((prev) => !prev);
  };


  const [myNFTs, setMyNFTs] = useState([]);

  const [localNFTs, setLocalNFTs] = useState([]);

  // const getOwnedTokens = async (contract_address, contract_id) => {
  //   // console.log(collection);
  //   // Promise.all(
  //   // collectionList.map(async (collection) => {
  //   // console.log(collection);
  //   try {
  //     // console.log(collection);
  //     const provider = new ethers.providers.Web3Provider(
  //       window.ethereum,
  //       'any'
  //     );
  //     let contract = new ethers.Contract(
  //       contract_address,
  //       NFTABI,
  //       provider
  //     );
  //     // console.log(contract);
  //     let address = state.user.wallet_address;
  //     let tokens = await contract.tokensOfOwner(address);
  //     tokens = tokens.map((token) => token.toNumber());
  //     // console.log('TOKENS', tokens);
  //     tokens = tokens.map((t, i) => {
  //       return {
  //         id: t,
  //         contract_id: contract_id,
  //       };
  //     });
  //     // tokens = tokens.filter((t) => t.quantity > 0);
  //     // console.log("got tokens",tokens);
  //     return tokens;
  //     // setOwnedTokens(tokens);
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   // })
  //   // );
  // };

  // const fetchMyNFTs = async () => {
  //   if (!state?.user?.wallet_address) return;
  //   // console.log("Fethick",collection)
  //   let tokens = [];

  //   await Promise.all(collectionList.map(async collection => {
  //     let gotTokens = await getOwnedTokens(collection.contract_address, collection.id)
  //     console.log("__>>", gotTokens)
  //     tokens = tokens.concat(gotTokens)
  //   })
  //   )
  //   // let tokens = await getOwnedTokens();
  //   console.log('tokens request', tokens);
  //   try {
  //     const allmyNFTs = await axios.post(
  //       `${process.env.API}/merchandise/getallbyIDs`,
  //       tokens
  //     );
  //     // console.log("MY NFTS",allmyNFTs.data);
  //     setMyNFTs(allmyNFTs.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const fetchMyLocalNFTs = async () => {
  //   // console.log("tokens request",tokens,process.env.API );
  //   if (!state?.user?.id) return;
  //   try {
  //     const localnfts = await axios.get(
  //       `${process.env.API}/localnft/getNftsOfUser/${state.user.id}`
  //     );
  //     console.log('MY NFTS', localnfts.data);
  //     setLocalNFTs(localnfts.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  
  // useEffect(() => {
  //   fetchMyNFTs();
  //   fetchMyLocalNFTs();
  // }, []);
  
  // const MyNFTComponent = () => {
  //   return (
  //     <div className='mb-4'>
  //       <div className=' font-semibold  uppercase text-2xl mb-5 text-gray-600 px-2'>
  //         My NFTs
  //       </div>
  //       <div className=' font-semibold  uppercase text-lg mb-5 text-gray-600 px-2'>
  //         Local NFTs
  //       </div>
  //       <div className=' grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8  '>
  //         {localNFTs.map((nft, index) => {
  //           if (nft)
  //             return (
  //               <Link href={'/viewlocalnft/' + nft.id} key={nft.id}>
  //                 <div className='hover:shadow-lg transition-all min-h-96 p-3 rounded-xl hover:bg-slate-50 cursor-pointer'>
  //                   <div className='w-full  aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8'>
  //                     <img
  //                       src={nft.merchandise.nft_image_url}
  //                       alt={nft.merchandise.token_id}
  //                       className='w-full h-64 object-center object-cover group-hover:opacity-75'
  //                     />
  //                   </div>
  //                   <div className=' mt-2 flex justify-between   '>
  //                     <h3 className=' text-sm text-gray-700'>
  //                       Amount: {nft.number}
  //                     </h3>
  //                     <div className=' flex-1  text-right'>
  //                       Token: {nft.merchandise.token_id}
  //                     </div>
  //                   </div>

  //                   <div className='text-lg font-medium text-gray-900'>
  //                     {nft.merchandise.name}
  //                   </div>

  //                   <button
  //                     // onClick={()=>{}}

  //                     className={
  //                       ' mt-1   w-full h-8 px-2 text-center  rounded-md text-sm   shadow-lg transition-all hover:shadow-sky-300 mr-10 ' +
  //                       styles.login
  //                     }>
  //                     View
  //                   </button>
  //                 </div>
  //               </Link>
  //             );
  //         })}
  //       </div>
  //       <div className=' font-semibold  uppercase text-lg mb-5 text-gray-600 px-2'>
  //         In Wallet
  //       </div>
  //       <div className=' grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8  '>
  //         {myNFTs.map((nft, index) => {
  //           if (nft)
  //             return (
  //               <Link href={'/catalog/' + nft.id} key={nft.id}>
  //                 <div className='hover:shadow-lg transition-all min-h-96 p-3 rounded-xl hover:bg-slate-50 cursor-pointer'>
  //                   <div className='w-full  aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8'>
  //                     <img
  //                       src={nft.nft_image_url}
  //                       alt={nft.token_id}
  //                       className='w-full h-64 object-center object-cover group-hover:opacity-75'
  //                     />
  //                   </div>
  //                   <div className=' mt-2 flex justify-between   '>
  //                     <h3 className=' text-sm text-gray-700'>
  //                       {' '}
  //                       {nft['collection.name']}
  //                     </h3>
  //                     <div className=' flex-1  text-right'>
  //                       Token: {nft.token_id}
  //                     </div>
  //                   </div>

  //                   <div className='text-lg font-medium text-gray-900'>
  //                     {nft.name}
  //                   </div>

  //                   <button
  //                     // onClick={()=>{}}
  //                     className={
  //                       ' mt-1   w-full h-8 px-2 text-center  rounded-md text-sm   shadow-lg transition-all hover:shadow-sky-300 mr-10 ' +
  //                       styles.login
  //                     }>
  //                     {nft.token_id % 2 == 0 ? <>Claim Now</> : <>Claimed</>}
  //                   </button>
  //                 </div>
  //               </Link>
  //             );
  //         })}
  //       </div>
  //     </div>
  //   );
  // };

  const CollectionItem = ({img, heart, imglink, name, id, price}) => {
    return (
      <div className=' rounded-lg md:p-4 flex flex-col  justify-center items-center bg-gray-800'>
        <img src={imglink} alt="img" className='w-[250px] object-cover object-center' />
        <h1 className="text-lg md:text-lg font-semibold tracking-wide mt-4">{name}</h1>
        <div className="flex items-center">
          <h1 className=" text-sky-500 font-bold">Price: {price} APEX</h1>
        </div>
        <div className='mt-2 w-full flex justify-between items-center '>
          <Link href={`/buyNFT/${id}`}>
          <button
            className=" w-48 my-2 p-3 px-8 border-[1px] border-white rounded-sm text-center hover:bg-gray-600 transition transition-all">
            <h1>Buy now</h1>
          </button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full text-white bg-black'>
      <div className='w-full h-[25vh] bg-cover flex justify-center items-end'>
        <div className='w-full max-w-md flex flex-col items-center p-4'>
          <h1 className={'text-3xl my-2 ' }>CATALOGUE</h1>
          <h1 className='my-2 text-center font-manrope font-thin text-gray-300'>
            Checkout our latest featured NFTs!
          </h1>
        </div>
      </div>

      <div className='w-full flex flex-col items-center justify-center mt-8 md:mt-2'>
        {/* <div className="max-w-5xl w-[90vw] font-thin flex flex-col items-center justify-center font-manrope">
          <h1 className="text-center text-sky-400 text-xl tracking-wide font-thin">Discover More</h1>
          <h1 className="font-medium text-3xl md:text-5xl  text-center m-8 mt-2">
            Latest Drop
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:py-8 md:px-20 items-center justify-between rounded-sm bg-custom-blue/20">
            <img src="https://hash-collect.s3.ap-south-1.amazonaws.com/website/hero.png"  alt="img" className="place-self-center w-[90%] md:w-96 col-span-1 m-4" />
            <div className="col-span-1 m-6 md:p-8 md:px-4 flex flex-col justify-center">
              <h1 className={catalogStyles.paraHead}>#1178 Cool Sneakers</h1>
              <div className="flex items-center">
                <h1 className={styles.para}>Hash Case Official</h1>
                <div className="relative">
                  <div className={`absolute top-6 left-12 ${designStyles.glowingDotBig}`}></div>
                </div>
                <img src="https://hash-collect.s3.ap-south-1.amazonaws.com/website/hero.png" alt="img" className="w-4 h-4 mx-2" />
              </div>
              <h1 className="my-4 text-sm text-gray-300 tracking-wide leading-loose">
              This pair of sneakers offers a certain exclusivity level, incomparable to other footwear of its type. These shoes are manufactured with extremely high-quality materials, including full-grain calfskin and premium leather uppers. With these materials being used, there's a creation of a sense of durability.
              </h1>
              <div className='mt-2 w-full flex justify-between gap-x-6 items-center'>
                <button
                  className="flex justify-between w-44 lg:w-48 my-2 p-3 px-8 border-[1px] border-white rounded-sm">
                  <h1>Buy now</h1>
                  <h1>-{'>'}</h1>
                </button>
                <img src="/icons/heart-outlined.png" alt="img" className='w-6' />
              </div>
            </div>
          </div>
        </div> */}

        {/* <div className="max-w-5xl w-[90vw] font-thin flex flex-col items-center justify-center font-manrope mt-8 md:mt-24">
          <h1 className="text-center text-sky-400 text-xl tracking-wide font-thin">Discover More</h1>
          <h1 className="font-medium text-3xl md:text-5xl  text-center m-8 mt-2">
            Collection
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:py-8 md:px-20 bg-transparent border-[1px] border-gray-600 items-center justify-between rounded-sm w-full">
            <img src="/images/catalogue/catalogue-img-1.png" alt="img" className="place-self-center w-[90%] sm:w-96 sm:h-80 col-span-1 m-4 object-cover object-center" />
            <div className="col-span-1 m-6 md:p-8 md:px-4 flex flex-col justify-center">
              <h1 className={catalogStyles.paraHead}>#1178 VR Headgear</h1>
              <div className="relative">
                <div className={`absolute left-80 ${designStyles.glowingDotBig}`}></div>
              </div>
              <div className="flex items-center">
                <h1 className={styles.para}>HashCollect</h1>
                <img src="/images/homepage/home_star.png" alt="img" className="w-4 h-4 mx-2" />
              </div>
              <h1 className="my-4 text-sm text-gray-300 tracking-wide leading-loose">
                This NFT acts as a proof of authenticy and as warranty for the hashCase VR headgear.
              </h1>
              <div className='mt-2 w-full flex justify-between gap-x-6 items-center'>
                <button
                  className="flex justify-between w-44 lg:w-48 my-2 p-3 px-8 border-[1px] border-white rounded-sm">
                  <h1>Buy now</h1>
                  <h1>-{'>'}</h1>
                </button>
                <img src="/icons/heart-outlined.png" alt="img" className='w-6' />
              </div>
            </div>
          </div>
        </div> */}

        <div className="max-w-5xl w-full font-thin flex flex-col md:flex-row gap-y-6  md:p-0 items-center justify-around font-manrope mb-24 mt-12 flex-wrap">
          <CollectionItem heart={false} imglink="https://hash-collect.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-07-23+at+10.11.33.jpeg" name="NOUN#1 on ZKev" id={15} price={1}/>
          <CollectionItem heart={false} imglink="https://hash-collect.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-07-23+at+10.15.43.jpeg" name="NOUN#2" price={5} />
          <CollectionItem heart={false} imglink="https://hash-collect.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-07-23+at+10.15.18.jpeg" name="NOUN#3" price={8} />
          {/* <CollectionItem heart={false} imglink="https://hash-collect.s3.ap-south-1.amazonaws.com/website/token-img-tee.png" name="Incepthink Tee" />
          <CollectionItem heart={false} imglink="https://hash-collect.s3.ap-south-1.amazonaws.com/website/token-img-tee.png" name="Incepthink Tee" />
           <CollectionItem heart={false} imglink="https://hash-collect.s3.ap-south-1.amazonaws.com/website/token-img-sneakers.png" name="Cool Sneakers"/>
          <CollectionItem heart={false} imglink="https://hash-collect.s3.ap-south-1.amazonaws.com/website/token-img-tee.png" name="Incepthink Tee" />
          <CollectionItem heart={false} imglink="https://hash-collect.s3.ap-south-1.amazonaws.com/website/token-img-tee.png" name="Incepthink Tee" />
          <CollectionItem heart={false} imglink="https://hash-collect.s3.ap-south-1.amazonaws.com/website/token-img-tee.png" name="Incepthink Tee" /> */}
        </div>
      </div>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   // console.log(context.query);

//   const pageNo = context.query.pageNo ? context.query.pageNo : 0;

//   // const collection = await axios
//   //   .get(`${process.env.API}/collections/byId/1`)
//   //   .then((res) => res.data);

//   // const results = await axios.get(
//   //   `${process.env.API}/merchandise/getall/` + pageNo
//   // );

//   const allCollections = await axios.get(
//     `${process.env.API}/collections/getallNames`
//   );
//   console.log(allCollections.data)

//   return {
//     props: {
//       collectionList: allCollections.data,
//     },
//   };
// }

// <div className=''>
    //   <Head>
    //     <title>Catalog</title>
    //   </Head>
    //   <div className='flex  w-full  font-gothom_pro '>
    //     <div className='w-full lg:mx-48 md:mx-20 mx-10 container'>
    //       {/* <Filters openFilter={openFilter} setOpenFilter={setOpenFilter} /> */}

    //       {/* <div>pagination</div> */}
    //       <div className=' font-semibold  uppercase text-4xl mb-5 text-gray-600 px-2'>
    //         Merchandise
    //       </div>
    //       {myNFTs.length || localNFTs.length ? (
    //         <>
    //           <MyNFTComponent />
    //         </>
    //       ) : null}
    //       <div className=' font-semibold  uppercase text-2xl mb-5 text-gray-600 px-2'>
    //         All merchandise
    //       </div>
    //       <div className=' grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 min-h-screen '>
    //         {products.map((product, index) => {
    //           if ( product.claimable)
    //             return (
    //               <a
    //                 href={'https://opensea.io/'}
    //                 target='_blank'
    //                 key={product.id}>
    //                 <div className='hover:shadow-lg transition-all h-96 p-3 rounded-xl hover:bg-slate-50 cursor-pointer'>
    //                   <div className='w-full  aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8'>
    //                     <img
    //                       src={product.nft_image_url}
    //                       alt={product.token_id}
    //                       className='w-full h-64 object-center object-cover group-hover:opacity-75'
    //                     />
    //                   </div>
    //                   <div className=' mt-2 flex justify-between   '>
    //                     <h3 className=' text-sm text-gray-700'>
    //                       {' '}
    //                       {product.collection.name}
    //                     </h3>
    //                     <div className=' flex-1  text-right'>
    //                       Token: {product.token_id}
    //                     </div>
    //                   </div>

    //                   <div className='text-lg font-medium text-gray-900'>
    //                     {product.name}
    //                   </div>

    //                   <button
    //                     // onClick={()=>{}}
    //                     className={
    //                       ' mt-1   w-full h-8 px-2 text-center  rounded-md text-sm   shadow-lg transition-all hover:shadow-sky-300 mr-10 ' +
    //                       styles.login
    //                     }>
    //                     Buy On OpenSea
    //                   </button>
    //                 </div>
    //               </a>
    //             );
    //         })}
    //       </div>
    //     </div>
    //   </div>
    // </div>
