require("dotenv").config();
const network = process.env.NETWORK;
const ethers = require("ethers");
const deployerMnemonic = process.env.MNEMONIC;
const deployArtifact = require(`../deployments/${process.env.NETWORK}/Seedifyuba`);

const networkProvider = process.env.NETWORK_URL
  ? () => new ethers.providers.JsonRpcProvider(process.env.NETWORK_URL)
  : () => new ethers.providers.InfuraProvider(process.env.NETWORK, process.env.INFURA_API_KEY);

module.exports = {
  contractAddress: deployArtifact.address,
  contractAbi: deployArtifact.abi,
  deployerMnemonic,
  networkProvider,
};

console.log(`using ${process.env.NETWORK} network`);
