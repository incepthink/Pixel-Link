import { createContext, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';

export const StoreContext = createContext();

const initialState = {
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {},
  jwt: Cookies.get('jwt') || '',
  cart: [],
  addressID: Cookies.get('addressID') || '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      console.log('Setting User', action.payload);
      return {
        ...state,
        user: action.payload,
      };
    case 'UNSET_USER':
      console.log('Removing User');
      return {
        ...state,
        user: null,
      };
    case 'SET_JWT':
      return {
        ...state,
        jwt: action.payload,
      };
    case 'UNSET_JWT':
      return {
        ...state,
        jwt: '',
      };
    case 'ADD_TO_CART':
      console.log("Setting cart",action.payload )
      return {
        ...state,
        // Only add one product at a time
        cart: [action.payload],
        // cart: [...state.cart, action.payload],
      };
    case 'EMPTY_CART':
      return {
        ...state,
        cart: [],
      };
    case 'SET_ADDRESS_ID':
      return {
        ...state,
        addressID: action.payload,
      };
    case 'UNSET_ADDRESS_ID':
      return {
        ...state,
        addressID: '',
      };

    default:
      return state;
  }
}

export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //   // Access localStorage
  //   console.log('CART', localStorage.getItem('cart'));
  //   dispatch({
  //         type: "ADD_TO_CART",
  //         payload: localStorage.getItem('cart'),
  //       })
  // }
  // useEffect(() => {
  //   const ISSERVER = typeof window === 'undefined';

  //   if (!ISSERVER) {
  //     console.log("CART ->",JSON.parse(localStorage.getItem('cart'))[0])
  //     dispatch({
  //       type: 'ADD_TO_CART',
  //       payload: JSON.parse(localStorage.getItem('cart'))[0],
  //     });
  //   }
  // }, []);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {props.children}
    </StoreContext.Provider>
  );
};
