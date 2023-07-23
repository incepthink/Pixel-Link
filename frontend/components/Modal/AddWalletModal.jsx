import React, { useState, useContext } from 'react';
import { StoreContext } from '../../utils/Store';
import { addWallet } from '../../utils/user/user';
import GenericModal from './GenericModal';

const styles = {
  button: "bg-custom-blue text-white text-sm font-bold uppercase px-6 py-3 rounded w-full max-w-xs",
}

export default function AddWalletModal({ showModal, setshowModal }) {

  const { state, dispatch } = useContext(StoreContext);

  // * Set Show Modal does not work without using this dummyState
  const [dummyState, setDummyState] = useState("");

  const metaMaskLoginHandler = async () => {
    const connectSuccessful = await addWallet(dispatch, state);
    if (connectSuccessful) {
      setshowModal(false);
    } else {
      console.log("failed to add wallet");
    }
  };

  if (showModal)

    return (
      <GenericModal heading='add wallet' showModal={showModal} setshowModal={setshowModal}>
        <div className="text-center mt-6">
          <button
            className={styles.button}
            type="button"
            style={{ transition: "all .15s ease" }}
            onClick={metaMaskLoginHandler}
          >
            Add Wallet
          </button>
        </div>
      </GenericModal>
    )
  else return <></>
}
