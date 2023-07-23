import Link from 'next/link';
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import axios from 'axios';
import Cookies from 'js-cookie';
import designStyles from './home/effects.module.scss';

import { StoreContext } from '../utils/Store';

import styles from './Navbar.module.css';
import SignupModal from './Modal/SignupModal';
import LoginModal from './Modal/LoginModal';

import { logoutHandler, connectToMetamask } from '../utils/user/user';
import HashCaseLogo from './others/HashCaseLogo';
import SelectChainModal from './Modal/SelectChainModal';

const navStyles = {
  navDiv: ' flex justify-center items-center fixed w-full',
  navBar: ' bg-green-800 backdrop-blur-lg',
  closedNavIcon: 'w-[25px] h-[2px] bg-white my-1.5 duration-500',
};

const dropdownStyles = {
  items:
    'cursor-pointer text-md flex justify-start items-center border-b  border-slate-400  mx-3 hover:text-blue-100 font-thin py-2',
};

const Navbar = () => {
  const { state, dispatch } = useContext(StoreContext);

  const [dropDownMenu, setDropDownMenu] = useState(false);

  const [activeItem, setActiveItem] = useState('/');

  const [hoverOverConnect, setHoverOverConnect] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showSigninModal, setShowSigninModal] = useState(false);
  const [showchainModal, setshowchainModal] = useState(false);




  const { pathname } = useRouter();
  const router = useRouter();

  const loginStyles = {
    action:
      'border-[1px] p-4 lg:px-8 text-white text-xs lg:text-sm border-white ' +
      null,
    option:
      'text-xs w-full uppercase my-1 py-2 hover:bg-custom-blue/75 ' +
      null,
    optionMobile:
      'border-[1px] py-3 text-white text-xs border-white w-full ' +
      null,
    hoverDiv: `${hoverOverConnect ? 'opacity-100' : ' opacity-0'} ${
      router.pathname === '/' ? 'hidden' : ''
    } font-normal w-full text-center absolute top-14 shadow-2xl rounded-lg bg-custom-blue/25 list-none uppercase transition-all border-[1px] border-t-0 rounded-t-none`,
    loggedInOptions: 'bg-red-200',
    hoverDivMobile:
      'flex flex-col font-normal gap-y-8 w-full text-center list-none uppercase',
  };

  useEffect(() => {
    setActiveItem(pathname);
    // console.log(state.user);
  }, [pathname]);


  const metaMaskLoginHandler = async () => {
    const connectSuccessful = await connectToMetamask(dispatch);
  };

  const getNavClasses = (menuItem) => {
    if (menuItem == activeItem) {
      return ' bg-[#00C2FF] font-bold w-screen text-center md:w-fit md:font-normal md:bg-transparent';
    } else {
      return '';
    }
  };

  const menuItems = (onClickFunction) => {
    return (
      <>
        <div
          className={'p-4 md:p-0' + getNavClasses('/')}
          onClick={onClickFunction}
        >
          <Link href='/'>
            <a>HOME</a>
          </Link>
        </div>
        <div
          className={'p-4 md:p-0' + getNavClasses('/about')}
          onClick={onClickFunction}
        >
          {/* <Link href='/about'>
            <a>ABOUT</a>
          </Link> */}
        </div>
        <div
          className={'p-4 md:p-0' + getNavClasses('/catalog')}
          onClick={onClickFunction}
        >
          <Link href='/catalog'>
            <a>CATALOGUE</a>
          </Link>
        </div>
      </>
    );
  };

  const NavbarDropdown = () => {
    return (
      <div className='w-full'>
        <ul>
          <span className=' text-xl font-semibold font-manrope  pb-2 mx-2 '>
            My Account
          </span>
        </ul>

        <ul>
          <div className=' text-md flex justify-start items-center mt-2'>
            <div className='px-2'>
              <img src='/images/user/userImg.png' alt='img' className='w-7 ' />
            </div>
            <div className=' text-[#ffffffbf] text-[16px]'>
              {state?.user?.wallet_address ? (
                <>
                  {state.user.wallet_address.slice(0, 4)}...
                  {state.user.wallet_address.slice(-3)}
                </>
              ) : state?.user?.email ? (
                <>{state.user.email}</>
              ) : (
                <>CONNECTED</>
              )}
            </div>
          </div>
        </ul>

        <ul>
          <Link href='/user/myNfts'>
            <div className={dropdownStyles.items}>
              <div className='px-2'>
                <img src='/images/navbar/nft.png' alt='img' className='w-5 ' />
              </div>
              <div>My NFTs</div>
            </div>
          </Link>
        </ul>

        {/* <ul>
          <Link href='/user'>
            <div className={dropdownStyles.items}>
              <div className='px-2'>
                <img src='/images/navbar/user.png' alt='img' className='w-5 ' />
              </div>
              <div>Profile</div>
            </div>
          </Link>
        </ul>

        <ul>
          <Link href='/user/orders'>
            <div className={dropdownStyles.items}>
              <div className='px-2'>
                <img
                  src='/images/navbar/order.png'
                  alt='img'
                  className='w-5 '
                />
              </div>
              <div>My Orders</div>
            </div>
          </Link>
        </ul> */}

        <div className='relative'>
          <div
            className={` absolute left-24 bottom-12 ${designStyles.glowingDotSmall}`}
          ></div>
        </div>

        <ul
          onClick={(e) => logoutHandler(dispatch)}
          className='cursor-pointer text-md flex justify-end mt-4 px-4 items-center'
        >
          <div className='px-2'>
            <img
              src='/images/navbar/logouticon.png'
              alt='img'
              className='w-4 '
            />
          </div>

          <button className={loginOptions.option}>Logout</button>
        </ul>
      </div>
    );
  };

  const loginOptions = () => {
    return (
      <div className=' md:text-sm text-xs  font-semibold  text-right text-white flex'>
        {/* {(state.user && Object.keys(state.user).length != 0) ? (
          <>
            <div className='mx-5 cursor-pointer hover:bg-slate-200 rounded-full  '>
              <Link href='/user'>
                <img className='w-12 py-2 px-2 h-12 mr-4 cursor-pointer' src='/images/user/user.png' />
              </Link>
            </div>
          </>
        ) : null} */}

        {state?.user ? (
          <div
            className='relative flex items-center '
            // onMouseEnter={() => setHoverOverConnect(true)}
            onMouseLeave={() => setHoverOverConnect(false)}
          >
            <div>
            <Link href='/user/myNfts'>
              <button
                // onClick={(e) => e.preventDefault()}
                className={`flex border-[1px] px-4 py-3 lg:px-8 text-white text-[14px] border-white items-center  ' + ${null}`}
              >
                {/* {state?.user?.wallet_address ? (
                <>
                  {state.user.wallet_address.slice(0, 4)}...
                  {state.user.wallet_address.slice(-3)}
                </>
              ) : state?.user?.email ? (
                <span className=' w-32 inline-block overflow-hidden text-ellipsis '>
                  {state.user.email}
                </span>
              ) : (
                <>CONNECTED</>
              )} */}
                <span className=''>My Wallet</span>
                {/* <span className='ml-4 rounded-full p-2 bg-white/20 hover:bg-white/50 transition-all'>
              <img
                src='/images/homepage/dropdown.png'
                alt='img'
                className='w-4 '
              />
              </span> */}
              </button>
            </Link>
            </div>
            <button
              onClick={(e) => e.preventDefault()}
              className={`flex ml-1  ' + ${null}`}
              onMouseEnter={() => setHoverOverConnect(true)}
              // onMouseLeave={() => setHoverOverConnect(false)}
            >
              <span className='ml-4 rounded-full p-2 bg-white/20 hover:bg-white/50 transition-all'>
                <img
                  src='/images/homepage/dropdown.png'
                  alt='img'
                  className='w-4 '
                />
              </span>
            </button>
            {/* // padding class */}
            <div
              className={`${
                hoverOverConnect ? 'h-14 ' : 'h-0  '
              }  opacity-0  w-full  absolute top-10  shadow-2xl`}
            ></div>

            <div
              className={`${
                hoverOverConnect
                  ? 'opacity-100 translate-y-0 '
                  : ' opacity-0 -translate-y-16 h-0  '
              } bg-[#0a5978]/80 transition-all  font-normal w-full overflow-hidden  absolute top-24 shadow-2xl rounded-lg  list-none  ${
                styles.dropdownTransitions
              } text-left p-3 min-w-[250px] ease-out `}
            >
              <NavbarDropdown />
            </div>
          </div>
        ) : (
          <div
            className='relative'
            onMouseEnter={() => setHoverOverConnect(true)}
            onMouseLeave={() => setHoverOverConnect(false)}
          >
            <button
              className={loginStyles.action}
              onClick={(e) => {
                e.preventDefault();
                //check if home page
                if (router.pathname === '/') {
                  router.push('/signin');
                }
              }}
            >
              SIGN IN
            </button>
            <div className={loginStyles.hoverDiv}>
              <button
                onClick={metaMaskLoginHandler}
                className={loginStyles.option}
              >
                Connect Wallet
              </button>
              <button
                onClick={() => setShowSigninModal(true)}
                className={loginStyles.option}
              >
                Login with email
              </button>
              <button
                onClick={() => setShowSignupModal(true)}
                className={loginStyles.option}
              >
                Signup with email
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  //check if user is empty and logout if empty
  try {
    if (state.user && Object.keys(state.user).length == 0) {
      dispatch({ type: 'UNSET_USER' });
      Cookies.remove('user');
      dispatch({ type: 'UNSET_JWT' });
      Cookies.remove('jwt');
    }
  } catch (error) {
    console.log(error);
  }

  return (
    <>
      <SignupModal
        showModal={showSignupModal}
        setshowModal={setShowSignupModal}
      />
      <LoginModal
        showModal={showSigninModal}
        setshowModal={setShowSigninModal}
      />
      <SelectChainModal showModal={showchainModal} setShowModal={setshowchainModal} />
      <div
        className={
          ' z-30 duration-300 ease-in' +
          navStyles.navDiv +
          (dropDownMenu ? ' bg-black/75 md:bg-transparent' : '')
        }
      >
        <nav
          className={
            'w-full  md:p-4 p-4' +
            navStyles.navBar +
            (dropDownMenu ? ' h-screen md:h-fit' : '')
          }
        >
          <div className='flex items-center justify-between w-full'>
            <HashCaseLogo />
            <div className='flex md:hidden items-center gap-x-8'>
              {/* <a href='https://twitter.com/hash_case' target='_blank' className=''>
                <img src='/icons/twitter.png' alt='twitter' className='w-8 h-8' />
              </a> */}
              <div className='flex justify-center items-center md:hidden'>
                <div
                  className='inline-block cursor-pointer'
                  onClick={() => setDropDownMenu((oldState) => !oldState)}>
                  <div
                    className={
                      navStyles.closedNavIcon +
                      (dropDownMenu
                        ? ' -rotate-45 translate-x-[6px] translate-y-[4px]'
                        : '')
                    }
                  />
                  <div
                    className={
                      dropDownMenu ? 'opacity-0' : navStyles.closedNavIcon
                    }
                  />
                  <div
                    className={
                      navStyles.closedNavIcon +
                      (dropDownMenu
                        ? ' rotate-45 translate-x-[6px] -translate-y-[4px]'
                        : '')
                    }
                  />
                </div>
              </div>
            </div>

            <div
              className={
                'hidden md:flex gap-x-6 lg:gap-x-16 md:mx-4 mx-8 text-white text-xs lg:text-sm items-center ' +
                null
              }
            >
              {menuItems()}
            </div>
            <div className='hidden md:flex items-center gap-x-8'>
              {/* <a href='https://twitter.com/hash_case' target='_blank'>
                <img src='/icons/twitter.png' alt='twitter' className='w-8 h-8' />
              </a> */}
              <button
              onClick={(e) => setshowchainModal(true)}
              className={`flex ml-1  text-white'`}
              // onMouseLeave={() => setHoverOverConnect(false)}
            >
              <span className='ml-4 rounded-full p-2 bg-white/20 hover:bg-white/50 transition-all'>
              {/* Select Chain */}
              
              🔗
              </span>
            </button>
              {/* <div className='rounded-lg bg-white px-2'></div> */}
              {loginOptions()}
            </div>
          </div>
          {!dropDownMenu ? null : (
            <>
              <div className='md:hidden flex flex-col justify-center items-center mt-14 gap-y-6 text-white'>
                {menuItems(() => {
                  setDropDownMenu(false);
                })}
              </div>
              <div className='md:hidden flex justify-center text-white mt-8 p-8 border-t-[1px] border-white'>
                <div className='w-full max-w-xs'>
                  {state.user ? <NavbarDropdown /> : (
                    <div className={loginStyles.hoverDivMobile}>
                      <button
                        onClick={metaMaskLoginHandler}
                        className={loginStyles.optionMobile}>
                        Connect Wallet
                      </button>
                      <button
                        onClick={() => setShowSigninModal(true)}
                        className={loginStyles.optionMobile}
                      >
                        Login with email
                      </button>
                      <button
                        onClick={() => setShowSignupModal(true)}
                        className={loginStyles.optionMobile}
                      >
                        Signup with email
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
