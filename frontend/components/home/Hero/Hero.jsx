import React from "react";

import InformationHero from "../InformationHero";
import styles from "./Hero.module.css";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
// import { heroParticleEffects } from "../constants";
import designStyles from "../effects.module.scss";
import Link from "next/link";

export default function Hero() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const scrollToContactUs = () => {
    const elem = document.getElementById("contact-us");
    window.scrollTo({
      top: elem.offsetTop,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="hidden h-[90vh] md:grid grid-cols-7 font-manrope relative w-[99.2vw]">
        <div className="absolute h-full w-full   ">
          {/* <Particles
            id="tsparticles"
            className="absolute w-full"
            init={particlesInit}
            options={heroParticleEffects}
          /> */}
        </div>
        <div className=" z-20 col-span-5 h-full  flex flex-col justify-center items-center">
          <div className="relative">
            <div
              className={` absolute -top-16 -left-32 ${designStyles.glowingDotPinkSmall}`}
            ></div>
          </div>
          <div className="w-[85%] max-w-5xl px-14 flex flex-col justify-center">
            <div className="mt-20 grid grid-cols-4 justify-center">
              <div
                className={
                  "col-span-3   text-xl lg:text-4xl text-white " +
                  null
                }
              >
                Add a Utility Layer to your {" "}
                <span className="text-green-400">Valuable Assets</span>
              </div>
              <div className="col-span-2 text-lg text-gray-200  my-4">
              Pixel Link enables you to add a 'utility later chain' to your existing 'store of value chain', which makes the utility modular and secures against further dilution of your circulating supply
              </div>
              <div className="col-span-3 flex items-center">
                <button
                  onClick={scrollToContactUs}
                  className={
                    // 'font-thin rounded-sm bg-gradient-to-r from-[#4A99D3] to-[#00A1D3] p-4 my-6 text-xs text-white  ' +
                    styles.heroButton
                  }
                >
                  GET STARTED
                </button>
                <Link href="/about">
                  <h1 className="text-white font-light p-6 text-xs">
                    Learn more -&gt;
                  </h1>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="relative col-span-2 h-full  bg-cover bg-center md:flex flex-col justify-center">
          <div className="relative">
            <div
              className={` absolute -top-40 -left-32 `}
            ></div>
          </div>
          <img
            src="https://hash-collect.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2023-07-23+at+10.11.33.jpeg"
            alt="img"
            className="absolute mt-20 md:-left-24 -left-32 lg:-left-52 w-[450px]"
          />
        </div>
      </div>

      <div className={"w-full md:hidden grid grid-rows-3 font-manrope"}>
        <div className="row-span-1 relative bg-home-background-3 bg-cover bg-center flex w-full justify-center ">
          <img
            src="https://hash-collect.s3.ap-south-1.amazonaws.com/website/hero.png"
            alt="img"
            className="absolute -bottom-40 w-60"
          />
        </div>
        <div className="row-span-2 bg-cover bg-center flex flex-col px-4 text-center">
          <div className="mt-40 justify-center">
            <div
              className={
                "leading-relaxed tracking-tighter text-lg text-white " +
                null
              }
            >
              Add a Utility Layer to your {" "}
              <span className="text-sky-400">Valuable Assets</span>
            </div>
            <div className="text-sm text-gray-300 font-thin my-2">
            Pixel Link enables you to add a 'utility later chain' to your existing 'store of value chain', which makes the utility modular and secures against further dilution of your circulating supply
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              <button
                className={
                  "font-thin rounded-sm bg-gradient-to-r from-[#4A99D3] to-[#00A1D3] p-4 my-6 text-xs text-white " +
                  null
                }
              >
                GET STARTED
              </button>
              <h1 className="text-white font-light p-6 text-xs">
                Learn more -&gt;
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-4 flex justify-center items-center">
        {/* <InformationHero /> */}
      </div>
    </>
  );
}
