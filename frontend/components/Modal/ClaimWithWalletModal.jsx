import { useRouter } from 'next/router'
import React, { userState, useEffect } from 'react'
import GenericModal from './GenericModal'

const styles = {
  button: "bg-custom-blue text-white text-sm font-bold uppercase px-6 py-3 rounded w-full max-w-xs",
}

const ClaimWithWalletModal = ({ transactionHash, userWallet, setShowModal, showModal, onConfirm }) => {
  const router = useRouter()

  if (showModal) {
    return (
      <GenericModal heading={"claimed"} subheading={`NFT Claimed to ${userWallet}`} setshowModal={setShowModal} onClose={() => router.push('/user/myNfts')}>
        <div className='w-full'>
          <h1 className='w-full break-words text-sm'>Transaction Hash: {transactionHash}</h1>
          <div className='mt-12 flex items-center justify-center'>
            <button
              onClick={() => {
                console.log(onConfirm);
                if (onConfirm) {
                  onConfirm();
                }
              }}
              className={styles.button}>
              View My NFTs
            </button>
          </div>
        </div>
      </GenericModal>
    );
  } else return <div></div>;
}

export default ClaimWithWalletModal