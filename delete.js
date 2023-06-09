const ethers = require("ethers");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const PRIVATE_KEY = process.env["PRIVATE_KEY"];
const CONTRACT_ADDRESS = process.env["DEPLOYE_CONTRACT_ADDRESS"]; // "0x862974e5827333de54a56d3edd93ca300127c911"
const ABI = fs.readFileSync('abi.js', 'utf8');

const infuraApiKeys = {
  projectId: process.env["INFURA_PROJECT_ID"],
  projectSecret: process.env["INFURA_PROJECT_SECRET"],
};
const provider = new ethers.providers.InfuraProvider(5, infuraApiKeys);

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const bloctoAssignmentContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  signer
);

/** transfer NFT */
// const from = "0x85fD692D2a075908079261F5E351e7fE0267dB02";
const to = "0x0000000000000000000000000000000000000001";

const transferToken = async (tokenId) => {
  const userAddress = await signer.getAddress();
  const args = [userAddress, to, tokenId];
  const METHOD = "safeTransferFrom(address,address,uint256)";
  const gasEstimate = await bloctoAssignmentContract.estimateGas[METHOD](
    ...args,
    {
      from: userAddress,
    }
  );
  // console.log(`💥 gasEstimate: ${JSON.stringify(gasEstimate, null, '	')}`)
  const { hash } = await bloctoAssignmentContract[METHOD](...args, {
    from: userAddress,
    gasLimit: gasEstimate,
  });
  console.log(`💥 hash: ${JSON.stringify(hash, null, "	")}`);
};
(async () => {
  for (var i = 1; i <= 28; i++) {
    await transferToken(i);
  }
})();
