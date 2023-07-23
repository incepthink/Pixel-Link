import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import UserNavbar from '../../components/UserNavbar';
import UserLayout from '../../components/layouts/UserLayout';
import { ethers } from 'ethers';
import NFTABI from '../../utils/NftApparelABI.json';
import Link from 'next/link';
import AddEmailModal from '../../components/Modal/AddEmailModal';
import Cookies from "js-cookie";
import AlertModal from '../../components/Modal/AlertModal';



export default function User({collections}) {
  const { state, dispatch } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [nftIds, setNftIds] = useState([]);
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  console.log("Collectios",collections)

  const router = useRouter();

  const jwt = state.jwt;
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

  const metaMaskLoginHandler = async () => {
    try {
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log("No metamask");
        alert.error("Please use a browser with Metamask");
        return;
      }

      const web3 = new ethers.providers.Web3Provider(window.ethereum, "any");
      await web3.send("eth_requestAccounts", []);
      const signerAddress = await web3.getSigner().getAddress();
      console.log("Account:", signerAddress);

      const userBackend = await axios.post(`${process.env.API}/user/addWallet`, {
        user_Id : state.user.id,
        wallet_address: signerAddress,
      })
      console.log(userBackend);
      

      var inThirtyMins = new Date(new Date().getTime() + 30 * 60 * 1000);

      dispatch({
        type: "SET_USER",
        payload: userBackend.data.user_instance,
        time: inThirtyMins,
      });
      Cookies.set("user", JSON.stringify(userBackend));

      dispatch({
        type: "SET_JWT",
        payload: userBackend.data.token,
        time: inThirtyMins,
      });
      Cookies.set("jwt", userBackend.data.token);

      setShowSuccessModal(true);
    } catch (e) {
      console.log(e);
      alert("Please Check if meta mask is installed and  logged in");
    }
  };

  // get my nfts

  const getOwnedTokens = async () => {
    let tokenList = []
    console.log(state.user)
    if(!state.user.wallet_address) return;
    await Promise.all(
      collections.map(async (collection) => {
        console.log(collection);
        let tokensInCollection = {name: collection.name}
        try {
          // console.log(collection);
          const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            'any'
          );
          let contract = new ethers.Contract(collection.contract_address, NFTABI, provider);
          // console.log(contract);
          let address = state.user.user_instance.wallet_address;
          let tokens = await contract.tokensOfOwner(address);
          tokens = tokens.map((token) => token.toNumber());
          // console.log('TOKENS', tokens);
          tokens = tokens.map((t, i) => {
            return {
              id: t,
              contract_id: 1,
            };
          });
          // tokens = tokens.filter((t) => t.quantity > 0);
          console.log(tokens);
          tokensInCollection.tokens = tokens;
          // return tokens;
          tokenList.push(tokensInCollection);
        } catch (e) {
          console.log(e);
        }
      })
    ); 
    console.log("allTokens", tokenList);
    setNftIds(tokenList);
    return tokenList;

  };

  // const fetchMyNFTs = async () => {
  //   console.log("Fethick",collection)
  //   let tokens = await getOwnedTokens();
  //   // console.log("tokens request",tokens,process.env.API );
  //   try {
  //     const allmyNFTs = await axios.post(`${process.env.API}/merchandise/getallbyIDs`, 
  //       tokens,
  //     );
  //     console.log("MY NFTS",allmyNFTs.data);
  //     setMyNFTs(allmyNFTs.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  useEffect(() => {
    getOwnedTokens();
  }, []);

  // get orders
  const getOrders = async () => {
    const response = await axios.post(
      `/backend/orders/getAllOrderSummary`,
      {userId: state.user.id},
    );
    // console.log(response.data);

    setOrders(response.data);
    setActiveOrders(response.data.filter(order => order.status === 'processing' || order.status === 'pending' || order.status === 'out for delivery'));
    // console.log("USER",state.user.user_instance,response.data);
  };

  useEffect(() => {
    if (!state.user) {
      router.push('/');
    } else {
      getOrders();
    }
  }, []);

  return (
    <div className='grid grid-cols-5 '>
      <AlertModal
        showModal={showSuccessModal}
        setShowModal={setShowSuccessModal}
        text="Wallet Connected"
        type="success"
      />
      <AddEmailModal showModal={showAddEmailModal} setshowModal={setShowAddEmailModal} />
      <UserLayout>
        <div className='col-span-4 flex flex-col   '>
          <main className='profile-page'>
            <section className='relative block' style={{ height: '300px' }}>
              <div className='absolute top-0 w-full h-full bg-slate-500'>
                <span
                  id='blackOverlay'
                  className='w-full h-full absolute opacity-50 bg-black'></span>
              </div>
              <div
                className='top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden'
                style={{ height: '70px' }}>
                <svg
                  className='absolute bottom-0 overflow-hidden'
                  xmlns='http://www.w3.org/2000/svg'
                  preserveAspectRatio='none'
                  version='1.1'
                  viewBox='0 0 2560 100'
                  x='0'
                  y='0'>
                  <polygon
                    className='text-gray-300 fill-current'
                    points='2560 0 2560 100 0 100'></polygon>
                </svg>
              </div>
            </section>
            <section className='relative py-16 bg-gray-300'>
              <div className='container mx-auto px-4'>
                <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64'>
                  <div className='px-6'>
                    <div className='flex flex-wrap justify-center'>
                      <div className='w-full lg:w-3/12 px-4 lg:order-2 flex justify-center'>
                        <div className='relative'>
                          <img
                            alt='...'
                            src='https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png'
                            className='shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16'
                            style={{ maxWidth: '150px' }}
                          />
                        </div>
                      </div>
                      <div className='w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center'>
                        <div className='py-6 px-3 mt-32 sm:mt-0'>
                          <Link href="/user/orders">
                          <button
                            className='bg-slate-500 active:bg-slate-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1'
                            type='button'
                            style={{ transition: 'all .15s ease' }}>
                            My Orders
                          </button>
                          </Link>
                        </div>
                      </div>
                      <div className='w-full lg:w-4/12 px-4 lg:order-1'>
                      
                      </div>
                    </div>
                    <div className='text-center mt-12'>
                      <h3 className='text-2xl font-semibold leading-normal text-gray-800 mb-2'>
                       {state.user?(state.user?.wallet_address):null}
                      </h3>
                      {/* <div className='text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase'>
                        <i className='fas fa-map-marker-alt mr-2 text-lg text-gray-500'></i>{' '}
                        Los Angeles, California
                      </div>
                      <div className='mb-2 text-gray-700 mt-10'>
                        <i className='fas fa-briefcase mr-2 text-lg text-gray-500'></i>
                        Solution Manager - Creative Tim Officer
                      </div>
                      <div className='mb-2 text-gray-700'>
                        <i className='fas fa-university mr-2 text-lg text-gray-500'></i>
                        University of Computer Science
                      </div> */}
                      <div className='flex justify-center py-4 lg:pt-4 pt-8'>
                          <div className='mr-4 p-3 text-center'>
                            <span className='text-xl font-bold block uppercase tracking-wide text-gray-700'>
                              {activeOrders.length}
                            </span>
                            <span className='text-sm text-gray-500'>
                              Active Orders
                            </span>
                          </div>
                          <div className='mr-4 p-3 text-center'>
                            <span className='text-xl font-bold block uppercase tracking-wide text-gray-700'>
                              {orders.length}
                            </span>
                            <span className='text-sm text-gray-500'>
                              Orders
                            </span>
                          </div>
                          {/* <div className='lg:mr-4 p-3 text-center'>
                            <span className='text-xl font-bold block uppercase tracking-wide text-gray-700'>
                              89
                            </span>
                            <span className='text-sm text-gray-500'>
                              Comments
                            </span>
                          </div> */}
                        </div>
                    </div>
                    
                    <div class="grid grid-rows-2 items-start justify-center">
                      {
                        state.user?.email ? null :
                        <div className='m-4 p-4 grid grid-cols-2'>
                          <h1 className='my-2 mx-8 col-span-1'>
                            This account does not have an email associated with it!
                          </h1>
                          <button 
                            className="w-fit p-2 bg-white text-blue-500 border-2 border-blue-500 rounded-xl hover:bg-blue-500 hover:text-white"
                            onClick={()=>setShowAddEmailModal(true)}
                          >
                            Add Email
                          </button>
                        </div>
                      }
                      {
                        state.user?.wallet_address ? null :
                        <div className='m-4 p-4 grid grid-cols-2'>
                          <h1 className='my-2 mx-8 col-span-1'>
                            This account does not have a wallet associated with it!
                          </h1>
                          <button 
                            className="w-fit p-2 bg-white text-blue-500 border-2 border-blue-500 rounded-xl hover:bg-blue-500 hover:text-white"
                            onClick={metaMaskLoginHandler}
                          >
                            Connect Wallet
                          </button>
                        </div>
                      }
                    </div>

                    <div className='mr-4 p-3 text-center font-gothom_pro'>
                      <span className='text-xl font-bold block uppercase tracking-wide text-gray-700'>
                        My NFTs
                      </span>

                      {nftIds.map((nfts) => 
                        <div className='text-lg font-semibold text-gray-600'>
                        {nfts.name} (token Ids) : 
                        {nfts.tokens.map((token,index) =>(
                          <span className='text-lg text-gray-500'>
                            {token.id}
                            {index < nfts.tokens.length-1 ? ',' : null}
                          </span>
                        ))}
                      </div>
                      )}        
                    </div>

                    <div className='mt-10 py-10 border-t border-gray-300 text-center'>
                      <div className='flex flex-wrap justify-center'>
                      <div className="w-full lg:w-9/12 px-4">
                      <p className="mb-4 text-lg leading-relaxed text-gray-800">
                        Have any query or stuck somewhere? Reach out to us
                        at contact@incepthink.com!
                      </p>
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </UserLayout>
    </div>
  );
}

export async function getServerSideProps() {
  // console.log(context.query);


  const {data} = await axios
    .get(`${process.env.API}/collections/getallNames`);

    console.log(data)
  return {
    props: {
      collections: data,
    },
  };
}