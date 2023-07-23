import React from "react";

import styles from "./BestSelling.module.css";

export default function BestSelling() {
  return (
    <div className="flex flex-col ">
      <span className="text-black font-gothom_pro mt-12 text-3xl font-bold text-center underline-offset-8 underline decoration-slate-300">
        Best Selling
      </span>

      <div className="grid grid-cols-2 gap-4 lg:mx-32 lg:mt-20">
        <div
          className={
            "col-span-1 lg:w-[600px] lg:h-[693px] bg-t-shirt-1 bg-cover bg-center flex relative   "
          }
        >
          <div
            className={"absolute w-full h-full rounded-lg  z-10 " + styles.card}
          ></div>
          <div className="self-end flex flex-col z-20">
            <span className="text-black font-bold font-gothom_pro mt-12 md:text-2xl text-lgbase lg:ml-12 ">
              Awesome T-Shirt
            </span>
            <span className="text-black font-gothom_pro  md:text-base text-sm  ml-8">
              Bored Ape T-Shirt
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-x-6 gap-y-5">
          <div className="col-span-1 lg:w-[303px] lg:h-[502px] bg-t-shirt-2 bg-center bg-cover bg-no-repeat flex  relative">
            <div
              className={
                "absolute w-full h-full rounded-lg  z-10 " + styles.card
              }
            ></div>
            <div className="self-end flex flex-col z-20">
              <span className="text-black font-bold font-gothom_pro mt-12 md:text-2xl text-lbase  lg:ml-12 ">
                Awesome T-Shirt
              </span>
              <span className="text-black font-gothom_pro md:text-base text-sm  ml-8">
                Bored Ape T-Shirt
              </span>
            </div>
          </div>

          <div className="col-span-1 lg:w-[303px] lg:h-[502px] bg-t-shirt-3 bg-center bg-cover bg-no-repeat flex  relative">
            <div
              className={
                "absolute w-full h-full rounded-lg  z-10 " + styles.card
              }
            ></div>
            <div className="self-end flex flex-col z-20">
              <span className="text-black font-bold font-gothom_pro mt-12 md:text-2xl text-lbase lg:ml-12 ">
                Awesome T-Shirt
              </span>
              <span className="text-black font-gothom_pro md:text-base text-sm  ml-8">
                Bored Ape T-Shirt
              </span>
            </div>
          </div>

          <div className="col-span-1 lg:w-[303px] lg:h-[171px] bg-t-shirt-4 bg-center bg-cover bg-no-repeat flex  relative">
            <div
              className={
                "absolute w-full h-full rounded-lg  z-10 " + styles.card
              }
            ></div>
            <div className="self-end flex flex-col z-20">
              <span className="text-black font-bold font-gothom_pro mt-12 md:text-2xl text-lbase lg:ml-12 ">
                Awesome T-Shirt
              </span>
              <span className="text-black font-gothom_pro md:text-base text-sm  ml-8">
                Bored Ape T-Shirt
              </span>
            </div>
          </div>
          <div className="col-span-1 lg:w-[303px] lg:h-[171px] bg-t-shirt-5 bg-center bg-cover bg-no-repeat flex  relative">
            <div
              className={
                "absolute w-full h-full rounded-lg  z-10 " + styles.card
              }
            ></div>
            <div className="self-end flex flex-col z-20">
              <span className="text-black font-bold font-gothom_pro mt-12 md:text-2xl text-base  lg:ml-12 ">
                Awesome T-Shirt
              </span>
              <span className="text-black font-gothom_pro md:text-base text-sm ml-8">
                Bored Ape T-Shirt
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
