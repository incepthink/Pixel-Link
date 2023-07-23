import React from "react";
import styles from "./ContactUs.module.css";
import designStyles from "./effects.module.scss";
import { useRouter } from "next/router";
import TransparentButton from "../../utils/buttons/TransparentButton";

export default function ContactUs() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center m-16 mt-0 font-manrope">
      <div className="max-w-5xl w-[90vw] font-thin flex flex-col text-white items-center justify-centern">
        <h1 className="text-center text-sky-400 text-xl tracking-wide font-thin">Discover More</h1>
        <h1 className="font-medium text-4xl md:text-5xl text-center m-8 mt-2">
          Latest Drop
        </h1>

        <div className="grid grid-cols-2 md:py-8 md:px-20 bg-[#00C2FF]/20 items-center justify-between rounded-sm">
          <div className="flex w-full items-center justify-center col-span-2 md:col-span-1">
            <img src="https://hash-collect.s3.ap-south-1.amazonaws.com/website/home_airdrop.png" alt="img" className="w-60 md:w-full m-4" />
          </div>
          <div className="col-span-2 md:col-span-1 m-4 md:m-6 p-4 md:p-8 px-4 flex flex-col justify-center">
            <h1 className="text-lg md:text-2xl font-semibold tracking-wide">#1178 Reflections</h1>
            <div className="flex items-center">
              <h1 className="font-light text-sm md:text-base my-1 tracking-wide">Marta Marcé</h1>
              <div className="relative">
                <div
                  className={` absolute top-6 left-12 ${designStyles.glowingDotBig}`}
                ></div>
              </div>
              <img
                src="/images/homepage/home_star.png"
                alt="img"
                className="w-4 h-4 mx-2"
              />
            </div>
            <h1 className="my-4 text-xs md:text-sm text-gray-300 tracking-wide leading-loose">
              The balance of painting that allows the power of thought as well as the power of feeling. The capacity to reflect on our own nature, to abstract but also to feel: the rational and sensuous experience
            </h1>
            <button
              className="w-fit my-2 text-xs md:text-base text-white p-3 px-8 border-[1px] border-white rounded-sm">Buy now -{">"}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-[#00C2FF]/20 m-4 mt-12 md:m-16 md:mt-28 p-4 md:py-12 md:px-20 max-w-5xl w-[90vw] grid md:grid-cols-2 gap-y-4 text-white items-center justify-center">
        <div className="text-lg md:text-2xl font-semibold">
          <h1>Have any questions,</h1>
          <h1>Feel free to ask!</h1>
        </div>
        <div className="relative md:place-self-end">
          <div className={` absolute top-6 ${designStyles.glowingDotSmall}`}></div>
          <button
            className="w-fit text-xs md:text-base my-2 text-white p-3 px-8 border-[1px] border-white rounded-sm"
            onClick={() => router.push("/contact")}
            height="60"
            width="180"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
