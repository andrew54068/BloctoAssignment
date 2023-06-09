const ethers = require("ethers");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

const PRIVATE_KEY = process.env["PRIVATE_KEY"];
const CONTRACT_ADDRESS = process.env["DEPLOYE_CONTRACT_ADDRESS"]; // "0xF37a02F497E21be9F4dd9A34C01568aC21578D1a";
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

/** mint NFT */
const METHOD = "mint";
let args = [];
let tokensId = [];
for (var i = 0; i <= 28; i++) {
  tokensId.push(i);
}
args.push(tokensId);
(async () => {
  const userAddress = await signer.getAddress();
  const gasEstimate = await bloctoAssignmentContract.estimateGas[METHOD](
    ...args,
    {
      from: userAddress,
    }
  );
  const { hash } = await bloctoAssignmentContract[METHOD](...args, {
    from: userAddress,
    gasLimit: gasEstimate,
  });
  console.log(`💥 hash: ${JSON.stringify(hash, null, "	")}`);
})();
