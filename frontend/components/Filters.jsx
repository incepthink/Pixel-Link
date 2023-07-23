import React, { useState } from "react";
import Image from "next/image";
const Filters = ({ openFilter, setOpenFilter }) => {

  const Separator = () => {
    return (
      <div class="w-full border-t border-gray-300 mt-8 mb-8"></div>
    )
  }

  return (
    <div
      className={`filters transform transition ${openFilter ? "translate-x-0 " : " -translate-x-full "
        }  bg-white w-full z-10 fixed top-5 lg:relative lg:block lg:translate-x-0  lg:w-64 xl:w-80 p-5 h-full`}
    >
      <div className="flex flex-col justify-between border-2 p-4">
        <p className="font-bold text-2xl mt-2">Search</p>
        <div className="flex border-2 p-4 w-full justify-between mt-2">
          <div className="w-full border-r-2">
            Search Bar
          </div>
          <Image src='/icons/search.png' height={25} width={25} />
        </div>
        <Separator />
        <p className="font-bold text-xl mt-2">Popular Tags</p>
        <div className="mt-2 grid grid-cols-2 grid-flow-row-dense gap-2">
          <div className="border-2 px-4 py-2 text-center">Borred Ape</div>
          <div className="border-2 px-4 py-2 text-center"> Ape</div>
          <div className="border-2 px-4 py-2 text-center">Tshirt</div>
          <div className="border-2 px-4 py-2 text-center">Men</div>
        </div>
        <Separator />
        <p className="font-bold text-xl mt-2">Shop by Categories</p>
        <div className="flex flex-col">
          <div className="flex flex-row font-light pt-4 pb-2">
            <p>Women Fashion</p>
          </div>
          <div className="flex flex-row font-light py-2">
            <p>Men Fashion</p>
          </div>
          <div className="flex flex-row font-light py-2">
            <p>Furniture</p>
          </div>
          <div className="flex flex-row font-light py-2">
            <p>Lamp</p>
          </div>
          <div className="flex flex-row font-light py-2">
            <p>Electronics</p>
          </div>
          <div className="flex flex-row font-light py-2">
            <p>Accesories</p>
          </div>
        </div>
        <Separator />
        <p className="font-bold text-xl mt-2">Floor Price</p>
        <div className="flex flex-col">
          <p>Range: <span className="font-semibold"> INR 100 - 350 </span></p>
          slider
          <p className="font-semibold"> INR 100 - 350</p>
        </div>
        <Separator />
        <p className="font-bold text-xl mt-2">Refine By</p>
        <Separator />
        <p className="font-bold text-xl mt-2">Colour</p>
        <Separator />
        <p className="font-bold text-xl mt-2">Size</p>
        <button
          className="block lg:hidden"
          onClick={() => {
            setOpenFilter(false);
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Filters;
