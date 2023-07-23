import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios';
import { StoreContext } from '../../utils/Store';
import AlertModal from '../../components/Modal/AlertModal';
import LoadingModal from '../../components/Modal/LoadingModal';
import LoginModal from '../../components/Modal/LoginModal';
import SignupModal from '../../components/Modal/SignupModal';
import { NftTypes } from '../../config/models';
import NftSignatureBox from '../../components/NftSignatureBox/NftSignatureBox';
import ClaimNft from '../../components/claimNft/ClaimNft';
import AddEmailModal from '../../components/Modal/AddEmailModal';
import notify from '../../utils/notify';

const link = ({ link, product }) => {
  const router = useRouter()
  const { state, dispatch } = useContext(StoreContext);
  const { user, jwt } = state;
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
  // console.log(product)

  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [nftsClaimed, setNftsClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const onClaimWithEmail = async () => {
    if (!state?.user?.id) {
      notify('Please sign in', 'info');
      return;
    } else if (!state?.user?.email) {
      notify('Please add your email', 'info');
      setShowAddEmailModal(true);
      return;
    }

    if (product.collection?.type !== NftTypes.SIGNABLE) {
      notify("You can't claim this!", 'info');
      return;
    }

    setIsLoading(true);
    try {
      // submitOrder();
      console.log(user.email);
      const data = await axios.post(`${process.env.API}/otl/claim?details=${link}`, {
        user_email: user.email,
        user_id: user.id,
      });
      setNftsClaimed(true)
    } catch (err) {
      if (err?.response?.data?.message) {
        notify(err?.response?.data?.message, 'error');
      } else {
        notify(err.message, 'error');
      }
    }
    setIsLoading(false);
  };

  const signIn = async () => {
    setShowLoginModal(true);
  }

  const signUp = async () => {
    setShowSignupModal(true);
  }

  return (
    <div className='max-w-screen-xl p-5 mx-auto container font-gothom_pro  '>
      <AddEmailModal showModal={showAddEmailModal} setshowModal={setShowAddEmailModal} />
      <LoginModal showModal={showLoginModal} setshowModal={setShowLoginModal} />
      <SignupModal showModal={showSignupModal} setshowModal={setShowSignupModal} />
      <AlertModal
        showModal={nftsClaimed}
        setShowModal={setNftsClaimed}
        text='NFT added to Local Wallet. Claim it to your crypto wallet any time!'
        type='success'
        confirmButtonText='View your NFTs'
        onConfirm={() => router.push('/catalog')}
      />
      <LoadingModal showModal={isLoading} />
      <ClaimNft product={product} onClaimWithEmail={onClaimWithEmail} signIn={signIn} signUp={signUp} />
    </div>
  )
}


export default link;

export async function getServerSideProps(context) {
  const { link } = context.query;
  // console.log(link);
  let product = "";

  try {
    const { data } = await axios.get(`${process.env.API}/otl/getDetails?details=${link}`);
    // console.log(data);
    product = data.merch;
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      link,
      product,
    },
  };
}