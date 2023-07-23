import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../utils/Store";
import axios from "axios";
import { useRouter } from "next/router";

export default function OldAddress() {
  const { state, dispatch } = useContext(StoreContext);
  const router = useRouter();
  const user = state.user;
  const token = state.jwt;

  const [address, setAddress] = useState([]);

  useEffect(() => {
    axios
      .get(`/backend/shippings/shipping/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setAddress(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const selectAddress = (id) => {
    dispatch({
      type: "SET_ADDRESS_ID",
      payload: id,
    });

    router.push("/checkout");
  };

  return (
    <div className="flex flex-col mt-5">
      <p className="text-xl font-bold">Old Address</p>

      <div className="flex flex-col mt-5">
        <div className="grid-cols-9 grid gap-5 border-4  p-2">
          <p className=" font-bold">Sr. No.</p>
          <p className=" font-bold">Country</p>
          <p className=" font-bold">State</p>
          <p className=" font-bold">City</p>
          <p className=" font-bold">Street Address 1</p>
          <p className=" font-bold">Street Address 2</p>
          <p className=" font-bold">Name</p>
          <p className=" font-bold">Phone</p>
          <p className=" font-bold"> Select </p>
        </div>
      </div>
      {address.length > 0 ? (
        address.slice(0, 2).map((item, index) => {
          return (
            <div className="flex flex-col mt-5">
              <div className="grid-cols-9 grid gap-5 border-4  p-4">
                <p className=" ">{index + 1}</p>
                <p className="">{item.country}</p>
                <p className=" ">{item.state}</p>
                <p className=" ">{item.city}</p>
                <p className=" ">{item.street_address_1}</p>
                <p className=" ">{item.street_address_2}</p>
                <p className="">{item.name}</p>
                <p className=" ">{item.phone}</p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => {
                    selectAddress(item.shipping_id);
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col mt-5">
          <div className="flex flex-row gap-5 border-4 justify-between p-4">
            <p className="text-xl font-bold">No Address</p>
          </div>
        </div>
      )}
    </div>
  );
}
