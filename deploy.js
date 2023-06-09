/* Compile And Push To Eth Network */
const fs = require("fs");
const path = require("path");
const solc = require("solc");
const Web3 = require("Web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config();

const privateKey = process.env["PRIVATE_KEY"]; /* YOUR PRIVATE KEY ... */
const infuraProjectId = process.env["INFURA_PROJECT_ID"]
const providerOrUrl = "https://goerli.infura.io/v3/" + infuraProjectId; /* GOERLI ENDPOINT */

const provider = new HDWalletProvider(privateKey, providerOrUrl);
const web3 = new Web3(provider);
const content = fs.readFileSync("./BloctoAssignment2.sol", "utf8"); /* PATH TO CONTRACT */

const input = {
  language: "Solidity",
  sources: {
    "BloctoAssignment2.sol": { content },
  },
  settings: {
    outputSelection: { "*": { "*": ["*"] } },
  },
};

function findImports(relativePath) {
  //my imported sources are stored under the node_modules folder!
  const absolutePath = path.resolve(__dirname, 'node_modules', relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  return { contents: source };
}

(async () => {
  /* 1. Get Ethereum Account */
  const [account] = await web3.eth.getAccounts();
  
  /* 2. Compile Smart Contract */
  const result = solc.compile(JSON.stringify(input), { import: findImports })
  const { contracts } = JSON.parse(result);
  
  const contract = contracts["BloctoAssignment2.sol"].BloctoAssignment2;
  
  /* 2. Extract Abi And Bytecode From Contract */
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;
  
  const metadataFolderIpfsCID = "QmWK4nupu7h2JN36eGJyhoueSxCJrvmkpmQCuogEJELaFH";
  
  /* 3. Send Smart Contract To Blockchain */
  const { _address } = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [`https://ipfs.io/ipfs/${metadataFolderIpfsCID}/`] })
    .send({ from: account, gas: 8000000 });
  
  console.log("Contract Address =>", _address);
  process.exit()
})();