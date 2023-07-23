import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../utils/Store';
import AlertModal from '../../components/Modal/AlertModal';
import LoadingModal from '../../components/Modal/LoadingModal';
import ClaimNft from '../../components/claimNft/ClaimNft';
import ClaimWithWalletModal from '../../components/Modal/ClaimWithWalletModal';
import AddEmailModal from '../../components/Modal/AddEmailModal';
import AddWalletModal from '../../components/Modal/AddWalletModal';
import notify from '../../utils/notify';
import { NftTypes } from '../../config/models';
import ClaimUtility from '../../components/claimNft/claimUtility';

export default function viewNFT({ product, variations }) {
  const { state, dispatch } = useContext(StoreContext);
  const [isNftLocallyAdded, setisNftLocallyAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState(product.price);
  const [userWallet, setUserWallet] = useState('');
  const [isNftClaimedToWallet, setIsNftClaimedToWallet] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [showAddEmailModal, setShowAddEmailModal] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);

  const router = useRouter();

  const jwt = state.jwt;
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

  const mint = async () => {

    try {
      // console.log(await signer.getAddress());
      const signer = provider.getSigner();
      // setaddress(await signer.getAddress());
      let nftaddress= "0xsdhjgfljhksdfgljdf"
      let contract = new ethers.Contract(nftaddress, ABI, signer);
      // console.log(contract);
      let address = await signer.getAddress();
      // let gas = await contract.estimateGas.mint(num, {
      //   value: priceInWei,
      // });
      // gas = gas.mul(3);
      // gas = gas.div(2);
      // // console.log(gas.toNumber());
      // // return;
      // //transaction
      let transaction = await contract.mint(num, {
        value: priceInWei,
        // gasLimit: gas,
      });
      await transaction.wait();
      console.log(transaction);
    } catch (err) {
      console.log(err);
      setShowMintedModal(false);
    }
  };



  const onClaimWithEmail = async () => {

    // if (product.collection.type !== NftTypes.SIGNABLE) {
    //   notify('This NFT is not claimable', 'info');
    //   return;
    // }

    if (!state.user) {
      notify('Please sign in to claim this NFT', 'info');
      return;
    }

    if (!state?.user?.email) {
      setShowAddEmailModal(true);
      return;
    }

    setIsLoading(true);

    try {
      // submitOrder();
      mint();
    } catch (err) {
      if (err?.response?.data?.message) {
        notify(err?.response?.data?.message, 'error');
      } else {
        notify(err.message, 'error');
      }
    }
    setIsLoading(false);
  };

  const onClaimToWallet = async () => {
    if (!state.user) {
      notify('Please sign in to claim this NFT', 'info');
      return;
    }

    if (!state?.user?.wallet_address) {
      setShowAddWalletModal(true);
      return;
    }

    setIsLoading(true);
    try {
      let res = await axios.post(`${process.env.API}/localnft/claimtowallet`, {
        user_id: state.user.id,
        nft_id: product.id,
        wallet_address: state.user.wallet_address,
        toDelete: false,
        price
      });
      console.log('SUCCESS', res);
      setTransactionHash(res.data.transactionHash);
      setUserWallet(res.data.wallet_address);
      setIsNftClaimedToWallet(true);
      notify('NFT claimed successfully!', 'success');
    } catch (err) {
      if (err?.response?.data?.message) {
        notify(err?.response?.data?.message, 'error');
      } else {
        notify(err.message, 'error');
      }
    }
    setIsLoading(false);
  };

  const handlePrice = (e) => {
    
    setPrice(e.target.value);
  }

  return (
    <div className='max-w-screen w-full font-gothom_pro'>
      
      <AddEmailModal showModal={showAddEmailModal} setshowModal={setShowAddEmailModal} />
      
      <AddWalletModal showModal={showAddWalletModal} setshowModal={setShowAddWalletModal} />
      
      <AlertModal
        showModal={isNftLocallyAdded}
        setShowModal={setisNftLocallyAdded}
        text='NFT added to Local Wallet. Claim it to your crypto wallet any time!'
        type='success'
        confirmButtonText='View your NFTs'
        onConfirm={() => router.push('/user/myNfts')}
      />
      
      <ClaimWithWalletModal
        showModal={isNftClaimedToWallet}
        setShowModal={setIsNftClaimedToWallet}
        userWallet={userWallet}
        transactionHash={transactionHash}
        onConfirm={(e) => router.push('/user/myNfts')}
      />
      
      <LoadingModal showModal={isLoading} />
      
      <ClaimUtility 
        product={product} 
        onClaimWithEmail={onClaimWithEmail} 
        onClaimToWallet={onClaimToWallet}  
        handlePrice={handlePrice} 
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  const { data: product } = await axios.get(
    `${process.env.API}/merchandise/singleMerch/${id}`
  );

  console.log(product);

  return {
    props: {
      product,
    },
  };
}
