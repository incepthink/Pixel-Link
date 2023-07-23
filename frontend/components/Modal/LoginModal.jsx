import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios'
import { StoreContext } from '../../utils/Store';
import Cookies from "js-cookie";
import GenericModal from './GenericModal';
import { loginWithEmail } from '../../utils/user/user';

const styles = {
  label: "block text-gray-300 text-sm font-bold mb-2",
  input: "px-3 py-3 placeholder-gray-400 text-gray-100 bg-transparent border-[1px] border-gray-500 text-sm shadow focus:outline-none focus:ring w-full",
  button: "bg-custom-blue text-white text-sm font-bold uppercase px-6 py-3 rounded w-full max-w-xs",
}

export default function LoginModal({ showModal, setshowModal }) {
  const { state, dispatch } = useContext(StoreContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    const loginSuccess = await loginWithEmail(dispatch, email, password);
    if (loginSuccess) {
      setshowModal(false)
    } else {
      console.log("login failed")
    }
  }


  if (showModal)
    return (
      <GenericModal heading={"sign in"} setshowModal={setshowModal} >
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

          <div className="text-center mt-6 max-w- flex items-center justify-center">
            <button
              className={styles.button}
              type="button"
              style={{ transition: "all .15s ease" }}
              onClick={login}
            >
              Sign In
            </button>
          </div>
        </form>
      </GenericModal>
    );
  else return <></>;
}
