import Cookies from 'js-cookie';
import axios from 'axios';
import notify from '../notify';
import Router from 'next/router';
import { ethers } from 'ethers';


export const logoutHandler = (dispatch) => {
    console.log('Loggin out');
    dispatch({ type: 'UNSET_USER' });
    Cookies.remove('user');
    dispatch({ type: 'UNSET_JWT' });
    Cookies.remove('jwt');
    Router.push('/');
    // console.log('user',state.user)
};

export const loginWithEmail = async (dispatch, email, password) => {
  if (email.length === 0 || password.length === 0) {
    return notify('Please fill the login form', 'info');
  }

  try {
    const res = await axios
      .post(`${process.env.API}/user/login`, {
        email,
        password,
      })
    var inThirtyMins = new Date(new Date().getTime() + 30 * 60 * 1000);
    console.log('res', res)
    dispatch({
      type: 'SET_USER',
      payload: res.data.user_instance,
      time: inThirtyMins,
    });

    Cookies.set('user', JSON.stringify(res.data.user_instance));

    dispatch({
      type: 'SET_JWT',
      payload: res.data.token,
      time: inThirtyMins,
    });

    Cookies.set('jwt', res.data.token);
    notify('Logged In', 'success');
    return true;
  } catch (err) {
    if (err?.response?.data?.message) {
      notify(err?.response?.data?.message, 'error');
    } else {
      notify(err.message, 'error');
    }
    return false;
  }
}
  
export const signupWithEmail = async (dispatch, email, password, confirmPassword) => {
  if (password !== confirmPassword) {
    console.log(password, confirmPassword);
    notify('Passwords do not match', 'error');
    return;
  }
  try {
    const res = await axios
      .post(`${process.env.API}/user/signup`, {
        email,
        password,
      })
    var inThirtyMins = new Date(new Date().getTime() + 30 * 60 * 1000);
    console.log('res', res)
    dispatch({
      type: 'SET_USER',
      payload: res.data.user_instance,
      time: inThirtyMins,
    });

    Cookies.set('user', JSON.stringify(res.data.user_instance));

    dispatch({
      type: 'SET_JWT',
      payload: res.data.token,
      time: inThirtyMins,
    });

    Cookies.set('jwt', res.data.token);
    notify('Signed Up', 'success');
    return true;
  } catch (err) {
    if (err?.response?.data?.message) {
      notify(err?.response?.data?.message, 'error');
    } else {
      notify(err.message, 'error');
    }
    return false;
  }
}

export const connectToMetamask = async (dispatch) => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    console.log('No metamask');
    notify('Please use a browser with Metamask', 'info');
    return;
  }

  // const chainId = 137;
  // const requrestNetworkSuccess = await requestNetwork(chainId);
  // if (!requrestNetworkSuccess) {
  //   console.log("Not able to change network");
  //   return;
  // }

  try {
    const web3 = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await web3.send('eth_requestAccounts', []);
    const signer = web3.getSigner();
    console.log('Account:', await signer.getAddress());
    const message = await axios
      .get(`${process.env.API}/user/getToken`)
      .then((res) => {
        console.log(res);
        return res.data.message;
      });

    const verifiedMessage = await axios.post(
      `${process.env.API}/user/verifyToken`,
      {
        address: await web3.getSigner().getAddress(),
        signature: await web3.getSigner().signMessage(message),
      }
    );

    const signerAddress = await web3.getSigner().getAddress();

    if (verifiedMessage.data.message === 'Token verified') {
      const userBackend = await axios
        .get(`${process.env.API}/user/getUser/${signerAddress}`)
        .then((res) => {
          console.log(res);
          return res.data;
        })
        .catch((err) => {
          console.log(err);
        });

      // add token to user object

      // console.log('user',userBackend);

      var inThirtyMins = new Date(new Date().getTime() + 30 * 60 * 1000);

      dispatch({
        type: 'SET_USER',
        payload: userBackend,
        time: inThirtyMins,
      });

      Cookies.set('user', JSON.stringify(userBackend));

      dispatch({
        type: 'SET_JWT',
        payload: verifiedMessage.data.token,
        time: inThirtyMins,
      });

      Cookies.set('jwt', verifiedMessage.data.token);
      notify('Connected to Metamask', 'success');
      return true;
    }
  } catch (err) {
    if (err?.response?.data?.message) {
      notify(err?.response?.data?.message, 'error');
    } else {
      notify(err.message, 'error');
    }
    return false;
  }
};

export const addEmail = async (dispatch, state, email, password, confirmPassword) => {
  if (email.length === 0 || password.length === 0 || confirmPassword.length === 0) {
    notify('Please fill the required details', 'info');
    return;
  }

  if (password !== confirmPassword) {
    notify('Passwords do not match', 'info');
    return;
  }

  try {
    const res = await axios.post(`${process.env.API}/user/addEmail`, {
      user_Id: state.user.id,
      email,
      password,
    })
    var inThirtyMins = new Date(new Date().getTime() + 30 * 60 * 1000);

    dispatch({
      type: 'SET_USER',
      payload: res.data.user_instance,
      time: inThirtyMins,
    });
    Cookies.set('user', JSON.stringify(res.data.user_instance));

    dispatch({
      type: 'SET_JWT',
      payload: res.data.token,
      time: inThirtyMins,
    });
    Cookies.set('jwt', res.data.token);

    notify('Email Added!', 'success');
    return true;
  } catch (err) {
    if (err?.response?.data?.message) {
      notify(err?.response?.data?.message, 'error');
    } else {
      notify(err.message, 'error');
    }
    return false;
  }
}

export const addWallet = async (dispatch, state) => {
  if (!window.ethereum || !window.ethereum.isMetaMask) {
    console.log('No metamask');
    notify('Please use a browser with Metamask', 'info');
    return;
  }

  const chainId = 137;
  const requrestNetworkSuccess = await requestNetwork(chainId);
  if (!requrestNetworkSuccess) {
    console.log("Not able to change network");
    return;
  }

  try {
    const web3 = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await web3.send('eth_requestAccounts', []);
    const signerAddress = await web3.getSigner().getAddress();
    console.log('Account:', signerAddress);

    const userBackend = await axios.post(`${process.env.API}/user/addWallet`, {
    user_Id : state.user.id,
    wallet_address: signerAddress,
    })
    console.log(userBackend);
    

    var inThirtyMins = new Date(new Date().getTime() + 30 * 60 * 1000);

    dispatch({
    type: 'SET_USER',
    payload: userBackend.data.user_instance,
    time: inThirtyMins,
    });
    Cookies.set('user', JSON.stringify(userBackend));

    dispatch({
    type: 'SET_JWT',
    payload: userBackend.data.token,
    time: inThirtyMins,
    });
    Cookies.set('jwt', userBackend.data.token);
    notify('Wallet Address Added!', 'success');
    return true;
  } catch (err) {
    console.log(err);
    if (err?.response?.data?.message) {
      notify(err?.response?.data?.message, 'error');
    } else {
      notify(err.message, 'error');
    }
    return false;
  }
}

const requestNetwork = async (chainId) => {
  console.log(window.ethereum.networkVersion);
  if (window.ethereum.networkVersion !== chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexValue(chainId) }]
      });
    } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
      console.log(err);
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Polygon Mainnet',
              chainId: ethers.utils.hexValue(chainId),
              nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
              rpcUrls: ['https://polygon-rpc.com/']
            }
          ]
        });
      } else {
        notify(err.message, 'error');
        return false;
      }
    }
  }
  return true;
}
