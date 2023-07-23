import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/router";
import { StoreContext } from "../../utils/Store";

import axios from "axios";

const styles = {
  textInput: "p-3  bg-slate-900 border-1  border-t-0 border-gray-200 form-field h-full rounded-lg"
}

const CheckoutForm = () => {

  let addressForm = {}
  if (typeof window !== 'undefined') {
    // console.log('entered if loop')
    addressForm = JSON.parse(window.localStorage.getItem('addressForm'))
  }
  const router = useRouter();

  console.log(router.query.id);

  const { state, dispatch } = useContext(StoreContext);

  const user = state.user;

  const token = state.jwt;


  // console.log(user.user_instance, token);

  return (
    <Formik
      initialValues={addressForm ? addressForm : {
        country: "",
        state: "",
        city: "",
        street_address_1: "",
        street_address_2: "",
        name: "",
        phone: "",
      }}

      validate={(values) => {
        const errors = {};
        if (!values.country) {
          errors.country = "Required";
        }
        if (!values.state) {
          errors.state = "Required";
        }
        if (!values.city) {
          errors.city = "Required";
        }
        if (!values.street_address_1) {
          errors.street_address_1 = "Required";
        }
        if (!values.name) {
          errors.name = "Required";
        }
        if (!values.phone) {
          errors.phone = "Required";
        }

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        // alert(JSON.stringify(values, null, 2));
        console.log("env", process.env.API)
        try {
          const res = await axios.post(
            `${process.env.API}/shippings/newShipping`,
            {
              ...values,
              user_id: user.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );


          // console.log(values)
          window.localStorage.setItem('addressForm', JSON.stringify(values))

          if (1) {
            dispatch({
              type: "SET_ADDRESS_ID",
              payload: res.data.shipping_id,
            });

            router.push("/checkout");
          }
        } catch (err) {
          console.log(err);
        }

        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit} className="mt-8 text-white">
          <p className="font-medium mb-2">Name</p>
          <div className="grid grid-cols-1 gap-x-5 lg:grid-cols-2  mt-2">
            <input
              type="text"
              name="name"
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Jhon Doe"

              className={styles.textInput}
              id=""
            />
            <PhoneInput
              country={"us"}
              inputProps={{
                name: "phone",
                className:  "rounded-lg form-field bg-slate-900 w-[100%] h-[100%]  p-3 px-12 text-white",
              }}
              className={styles.textInput}
              value={values.phone}
              onBlur={handleBlur}
              onChange={(_, __, e) => handleChange(e)}
            />
            <span className="text-red-400">
              {errors.name && touched.name && errors.name}
            </span>
            <span className="text-red-400">
              {errors.phone && touched.phone && errors.phone}
            </span>
          </div>
          <p className="font-medium mb-2 mt-2">Shipping Address</p>
          <CountryDropdown
            name="country"
            className={styles.textInput}
            value={values.country}
            onBlur={handleBlur}
            onChange={(_, e) => handleChange(e)}
            whitelist={
              ["US", "CA", "GB", "IN"]
            }
          />
          <span className="text-red-400">
            {errors.country && touched.country && errors.country}
          </span>

          <div className="grid lg:grid-cols-2 gap-x-4 mt-3 ">
            <RegionDropdown
              country={values.country}
              name="state"
              defaultOptionLabel="Select State"
            className={styles.textInput}
              value={values.state}
              onBlur={handleBlur}
              onChange={(_, e) => handleChange(e)}
            />
            <input
              type="text"
              name="city"
              placeholder="Enter City"
              className={styles.textInput}
              value={values.city}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <span className="text-red-400">
              {errors.state && touched.state && errors.state}
            </span>
            <span className="text-red-400">
              {errors.city && touched.city && errors.city}
            </span>
          </div>
          <div className="grid lg:grid-cols-2 gap-x-4 mt-2 bg-transparent">
            <input
              type="text"
              name="street_address_1"
              value={values.street_address_1}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Street Address 1"
              className={styles.textInput}
              id=""
            />

            <input
              type="text"
              value={values.street_address_2}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Street Address 2"
              name="street_address_2"
              className={styles.textInput}
            />
            <span className="text-red-400">
              {errors.street_address_1 &&
                touched.street_address_1 &&
                errors.street_address_1}
            </span>
          </div>


          <button
            type="submit"
            className={`mt-5 text-white font-bold px-8 py-3  w-fit text-lg rounded-lg ${isSubmitting ? "bg-gray-400" : "bg-custom-blue"
              }`}
            disabled={isSubmitting}
          >
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
};

export default CheckoutForm;
