import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SpecialCard.module.css";
import Image from "next/image";

export default function SpecialCard() {
  const [special, setSpecial] = useState({});

  const [loading, setLoading] = useState(true);

  const getSpecial = async () => {
    const special = await axios
      .get("/backend/collections/getSponsored")
      .then((res) => {
        if (res.data && res.data.msg) {
          setLoading(false);
          return;
        }
        setSpecial(res.data);
        console.log(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    getSpecial();
  }, []);

  return (
    <>
      <div
        className={
          "lg:ml-11 lg:mr-64 w-5/6  rounded-lg  lg:mt-40 lg:mb-40 grid grid-cols-5 " +
          styles.root
        }
      >
        <div className="col-span-3 flex-col flex lg:mt-16 ">
          <span className="font-semibold text-4xl font-bebas lg:ml-20 lg:mt-9 ">
            TOY FACES
          </span>
          <span className=" text-base font-gotham_pro lg:ml-20 lg:mt-9">
            Toy Faces are a diverse set of non-generative portraits created one
            at a time by Amrit Pal Singh. The project started in February 2021
            and has done over 160+ ETH in primary sales. There are only 43 Toy
            Face NFTs on-chain.
          </span>
          <span className="text-base font-gotham_pro lg:ml-20 lg:mt-9">
            Active Markets: Foundation | SuperRare | OpenSea
          </span>

          <span className="text-base font-gotham_pro lg:ml-20 lg:mt-9 lg:mb-20">
            Creator: Amrit Pal Singh
          </span>
        </div>
        <div className="col-span-1 col-start-5 absolute     lg:top-[2800px]  lg:left-[850px]">
          <div className={"flex flex-col float-left lg:mr-4 " + styles.card1}>
            <Image
              src="/images/homepage/paid_featured/1.jfif"
              width={300}
              height={300}
              className="rounded-lg shadow-lg "
            />
            <div className="flex flex-col text-center">
              <span className="text-sm font-gotham_pro   lg:mt-3 ">
                Super, Single, Secondary
              </span>
              <span className="text-lg font-bold font-gotham_pro  lg:mt-1 ">
                Masala Toy Face
              </span>
              <span className="text-sm font-gotham_pro  ">
                Sold for 2.3 ETH
              </span>
            </div>
          </div>
          <div className={"flex flex-col float-left  lg:mr-4 w-fit relative"}>
            <div
              className={
                "absolute w-full h-full rounded-lg  z-10 " + styles.card2
              }
            ></div>
            <Image
              src="/images/homepage/paid_featured/2.jfif"
              width={300}
              height={300}
              className={"rounded-lg shadow-lg "}
            />
            <div className="flex flex-col text-center">
              <span className="text-sm font-gotham_pro   lg:mt-3 ">
                Super, Single, Secondary
              </span>
              <span className="text-lg font-bold font-gotham_pro  lg:mt-1 ">
                Masala Toy Face
              </span>
              <span className="text-sm font-gotham_pro  ">
                Sold for 2.3 ETH
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
