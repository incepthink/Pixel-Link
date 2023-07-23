import React, { useContext, useState } from "react";
import { StoreContext } from "../../utils/Store";
import Link from "next/link";
import styles from "../../components/Navbar.module.css";
import { useRouter } from "next/router";
import { signupWithEmail, connectToMetamask } from "../../utils/user/user";
import AuthLayout from "../../components/layouts/AuthLayout";
import signInStyles from "../signin/styles.module.scss";

const signup = () => {
  const { state, dispatch } = useContext(StoreContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signup = async (e) => {
    e.preventDefault();
    const signupSuccess = await signupWithEmail(
      dispatch,
      email,
      password,
      confirmPassword
    );
    if (signupSuccess) {
      router.push("/");
    } else {
      console.log("signup failed");
    }
  };

  return (
    <AuthLayout login={false}>
      <div className={"text-2xl h-fit mt-4 " + styles.arcadeFont}>
        SIGN UP WITH EMAIL
      </div>
      <div className={"text-sm mt-6 "}>
        No crypto wallet required to hold your NFT's!
      </div>
      <div className={"text-sm "}>
        Make your account with its very own custodial wallet and hold your
        NFT's.
      </div>
      <form className="max-w-xs w-full mt-4">
        <div className="w-full mb-3">
          <label
            className="flex items-center mb-2 text-lg font-thin"
            htmlFor="grid-password"
          >
            <img
              src="icons/login-icon-mail.png"
              alt=""
              className="w-7 h-5 mr-2"
            />
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
            <img
              src="icons/login-icon-lock.png"
              alt=""
              className="w-7 h-5 mr-2"
            />
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
        <div className="w-full mb-3">
          <label
            className="flex items-center mb-2 text-lg font-thin"
            htmlFor="grid-password"
          >
            <img
              src="icons/login-icon-lock.png"
              alt=""
              className="w-7 h-5 mr-2"
            />
            <h1>Confirm Password</h1>
          </label>
          <input
            type="password"
            className="border-[1px] px-3 py-3 placeholder-gray-400 bg-transparent rounded text-sm font-thin shadow focus:outline-none focus:ring w-full"
            placeholder="password"
            style={{ transition: "all .15s ease" }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className={signInStyles.signInButton} onClick={signup}>
          <h1>Sign Up</h1>
          <h1>-{">"}</h1>
        </button>
      </form>
    </AuthLayout>
  );
};

export default signup;
