import React, { useContext, useState } from 'react';
import { StoreContext } from '../../utils/Store';
import GenericModal from './GenericModal';
import { addEmail } from '../../utils/user/user';
import LoadingModal from './LoadingModal';

const styles = {
  label: "block text-gray-300 text-sm font-bold mb-2",
  input: "px-3 py-3 placeholder-gray-400 text-gray-100 bg-transparent border-[1px] border-gray-500 text-sm shadow focus:outline-none focus:ring w-full",
  button: "bg-custom-blue text-white text-sm font-bold uppercase px-6 py-3 rounded w-full max-w-xs",
}

export default function AddEmailModal({ showModal, setshowModal }) {
  const { state, dispatch } = useContext(StoreContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const addEmailHandler = async () => {
    setLoading(true);
    const addEmailSuccess = await addEmail(dispatch, state, email, password, confirmPassword);
    if (addEmailSuccess) {
      setshowModal(false);
    } else {
      console.log("failed to add email");
    }
    setLoading(false);
  }

  if (showModal)
    return (
      <>
        <GenericModal heading={"add email"} setshowModal={setshowModal}>
          <form className='w-full px-8'>
            <div className="relative w-full mb-3">
              <label
                className={styles.label}
                htmlFor="grid-password"
              >
                Email
              </label>
              <input
                type="email"
                className={styles.input}
                placeholder="Email"
                style={{ transition: "all .15s ease" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative w-full mb-3">
              <label
                className={styles.label}
                htmlFor="grid-password"
              >
                Password
              </label>
              <input
                type="password"
                className={styles.input}
                placeholder="Password"
                style={{ transition: "all .15s ease" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="relative w-full mb-3">
              <label
                className={styles.label}
                htmlFor="grid-password"
              >
                Confirm Password
              </label>
              <input
                type="password"
                className={styles.input}
                placeholder="Password"
                style={{ transition: "all .15s ease" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="text-center mt-6">
              <button
                className={styles.button}
                type="button"
                style={{ transition: "all .15s ease" }}
                onClick={addEmailHandler}
              >
                Add Email
              </button>
            </div>
          </form>
        </GenericModal>
        <LoadingModal showModal={loading} />
      </>
    );
  else return <></>;
}


