import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../utils/Store";

export default function index() {
  const { state, dispatch } = useContext(StoreContext);
  useEffect(() => {
    dispatch({
      type: "EMPTY_CART",
    });
  }, []);

  return (
    <div className="flex h-full justify-center items-center">
      Your order was a success!
    </div>
  );
}
