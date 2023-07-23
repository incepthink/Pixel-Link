import React from "react";

/*
NFT Essentials is a platform that allows projects and brands to add utility to their NFTs.

Using out novel ‘Custodial Wallet’ solution, we can allow users to access their NFTs without ever having to create a web3 account.
 
Our goal is to create a decentralised ownership of luxury items which ensures authenticity, warranty, and becomes a utility token to a now verified and gated community that still retains the ability to stay anonymous
 
Our web and mobile app will bring together
 
• Updates
• Warranties
• Certificates of Authentication
• Rewards & Utility
all in 1 single place
*/

const styles = {
  paraText: "text-lg leading-tight my-14",
  header: "text-2xl leading-tight my-8 text-center",
  listItem:
    "text-lg leading-tight mx-4 my-8 rounded-full bg-sky-900 px-4 py-3 ",
  highlighted: "text-blue-400",
  underlined: "underline decoration-4 decoration-blue-400",
};

const AboutUs = () => {
  return (
    <div className="m-0 p-0 text-white">
      {/* <h1 className="font-bold text-4xl font-gotham_pro text-center">
        CONTACT US
      </h1> */}
      <div className="w-full h-[32vh] bg-catalogue-background-1 bg-cover flex justify-center items-end">
        <div className="w-full max-w-md flex flex-col items-center p-4">
          <h1 className="text-3xl my-2 arcade-font">Hash Case</h1>
          <h1 className="my-1 text-center font-manrope text-xl text-gray-300">
          A platform for projects and brands to add utility to their
              NFT’s
          </h1>
        </div>
      </div>
      <div className="w-screen h-fit m-0 px-8 md:px-12 lg:px-16 xl:px-32 mx-auto text-white">
        {/* <div className=" flex justify-center items-end">
          <div className="w-full max-w-md flex flex-col items-center p-4">
            <h1 className={"text-3xl my-2 " + FontStyles.arcadeFont}>
              Hash Collect
            </h1>
            <h1 className="my-2 text-center font-manrope text-xl text-gray-300">
              A platform that allows projects and brands to add utility to their
              NFT’s
            </h1>
          </div>
        </div> */}

        <div className="flex  justify-between items-center px-10">
          <div className="w-1/2 text-xl">
            Using out novel Custodial Wallet solution, we can allow users to
            access their NFTs{" "}
            <span className="text-sky-400">
              without ever having to create a web3 account.
            </span>
          </div>
          <div className="w-1/2">
            <img src="https://hash-collect.s3.ap-south-1.amazonaws.com/website/about1.png" />
          </div>
        </div>

        <div className="flex  justify-between items-center px-10 flex-row-reverse">
          <div className="w-1/2 text-xl">
            Our goal is to create{" "}
            <span className="text-sky-400">
              {" "}
              a decentralised ownership of luxury items
            </span>
            which ensures authenticity, warranty, and becomes a utility token to
            a now verified and gated community that still retains the ability to
            stay anonymous. without ever having to create a web3 account.
          </div>
          <div className="w-1/2">
            <img src="https://hash-collect.s3.ap-south-1.amazonaws.com/website/about-2.png" />
          </div>
        </div>

        <div className="flex flex-col justify-between pb-28">
          <div>
            <div className={styles.header}>
              Our <span className={styles.underlined}>Web</span> and{" "}
              <span className={styles.underlined}>Mobile App</span> Will Bring
              Together
            </div>

            <ul className="m-8 justify-around flex  list-none text-uppercase text-xl">
              <li className={styles.listItem}>Updates</li>
              <li className={styles.listItem}>Warranties</li>
              <li className={styles.listItem}>
                Certificates of Authentication
              </li>
              <li className={styles.listItem}>Rewards & Utility</li>
            </ul>

            <div className={styles.header}>All In 1 Single Place!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
