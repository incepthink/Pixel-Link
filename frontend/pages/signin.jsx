import React, { useContext, useState } from 'react';
import { StoreContext } from '../utils/Store';
import styles from '../components/Navbar.module.css';
import { useRouter } from 'next/router';
import { loginWithEmail, signupWithEmail, connectToMetamask } from '../utils/user/user'
import AuthLayout from '../components/layouts/AuthLayout';

export default function signin() {
  const { state, dispatch } = useContext(StoreContext);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (e) => {
    e.preventDefault();
    const loginSuccess = await loginWithEmail(dispatch, email, password);
    if (loginSuccess) {
      router.push('/');
    } else {
      console.log("login failed");
    }
  }

  return (
    <AuthLayout signIn={true}>
      <div className='flex flex-col'>
        <div className={'text-2xl h-fit mt-8 ' + styles.arcadeFont}>SIGN IN WITH EMAIL</div>
        <form className='max-w-md w-full mt-8 justify-self-start'>
          <div className="w-full mb-3">
            <label
              className="flex items-center mb-2 text-lg font-thin"
              htmlFor="grid-password"
            >
              <img src="icons/login-icon-mail.png" alt="" className='w-7 h-5 mr-2' />
              <h1>Email</h1>
            </label>
            <input
              type="email"
              className="border-[1px] px-3 py-3 placeholder-gray-400 bg-transparent rounded text-sm font-thin shadow focus:outline-none focus:ring w-full"
              placeholder="someone@example.com"
              style={{ transition: "all .15s ease" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full mb-3">
            <label
              className="flex items-center mb-2 text-lg font-thin"
              htmlFor="grid-password"
            >
              <img src="icons/login-icon-lock.png" alt="" className='w-7 h-5 mr-2' />
              <h1>Password</h1>
            </label>
            <input
              type="password"
              className="border-[1px] px-3 py-3 placeholder-gray-400 bg-transparent rounded text-sm font-thin shadow focus:outline-none focus:ring w-full"
              placeholder="password"
              style={{ transition: "all .15s ease" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full mt-12 text-white text-lg p-3 px-8 border-[1px] border-custom-blue bg-custom-blue/20 rounded-sm flex justify-between"
            onClick={login}>
            <h1>
              Sign In
            </h1>
            <h1>
              -{">"}
            </h1>
          </button>
        </form>
        <div className='mt-4'>
          <h1>Don't have an account? <a className='text-custom-blue' href='/signup'>Sign Up</a></h1>
        </div>
      </div>
    </AuthLayout>
  );
}
