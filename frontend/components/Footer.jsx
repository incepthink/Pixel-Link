
import React from "react";
import Link from "next/link";
import moduleStyles from "./Footer.module.css";
import HashCaseLogo from "./others/HashCaseLogo";

const styles = {
  navItems: "font-thin"
}

export default function Footer() {
  return (
    <footer className="max-w-screen w-full flex flex-col border-t-1 border-gray-800 bg-black text-white justify-center items-center">
      <div className="max-w-6xl w-full p-8 flex flex-col gap-y-8 md:flex-row md:justify-between">
        <HashCaseLogo />

        <div className={"grid grid-cols-3 justify-center md:grid-cols-5 md:justify-between items-center gap-3 md:gap-4 lg:gap-16 " + moduleStyles.manropeFont}>
          <Link href="/">
            <a className={styles.navItems}>HOME</a>
          </Link>
          <Link href="/about">
            <a className={styles.navItems}>ABOUT</a>
          </Link>
          <Link href="/collections">
            <a className={styles.navItems}>CATALOGUE</a>
          </Link>
          <Link href="/">
            <a className={styles.navItems}>CONTACT</a>
          </Link>
          <Link href="/claimlocalnft/3">
            <a className={styles.navItems}>CLAIM NFT</a>
          </Link>
        </div>
      </div>

      <div className="border-b-[0.5px] border-gray-800 w-[40%]" />

      <div className="flex flex-row justify-center items-center text-center p-8">
        <span className={"text-gray-300 font-thin text-xs mb-2 font-gothom_pro tracking-wide" + moduleStyles.manropeFont}>
          Copyright 2022 
        </span>
      </div>
    </footer>
  );
}
