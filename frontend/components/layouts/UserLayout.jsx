import React from "react";
import UserNavBar from "../UserNavbar";
import { useContext } from "react";
import { StoreContext } from "../../utils/Store";
import { logoutHandler } from "../../utils/user/user";
import { useRouter } from "next/router";

export default function UserLayout({ children }) {
  const { state, dispatch } = useContext(StoreContext);
  const router = useRouter();
  const userInst = state.user;
  // console.log("user", userInst);
  return (
    <div className="w-screen text-white font-manrope">
      <div className="flex justify-center bg-catalogue-background-1 p-4 pt-16 mt-0 bg-cover">
        <div className="flex w-full justify-between items-center max-w-6xl pt-16">
          <div>
            {state?.user?.wallet_address || state?.user?.email ? (
              <div className="relative ">
                <div className={`text-4xl font-bold "`}>
                  {state?.user?.wallet_address ? (
                    <>
                      Wallet: {state.user.wallet_address.slice(0, 5)}...
                      {state.user.wallet_address.slice(-6)}
                    </>
                  ) : state?.user?.email ? (
                    <span className=" text-4xl font-bold ">
                      {state.user.email}
                    </span>
                  ) : (
                    <>User not found</>
                  )}
                </div>
              </div>
            ) : (
              <></>
            )}
            {/* <h1 className='text-2xl text-gray-400 font-light my-4'>Faridabad, India</h1> */}
          </div>
          <button
            className="border-[1px] border-white px-6 py-2"
            onClick={() => {
              logoutHandler(dispatch, router);
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center mt-20">
        <div className="max-w-6xl w-full flex">
          <div className="max-w-sm w-fit">
            <UserNavBar />
          </div>
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
