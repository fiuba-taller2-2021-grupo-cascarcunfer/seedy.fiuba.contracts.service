const ethers = require("ethers");
const accounts = [];

const getDeployerWallet = ({ config }) => () => {
  const provider = config.networkProvider();
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = ({ config }) => async () => {
  const provider = config.networkProvider();
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  accounts.push({
    address: wallet.address,
    privateKey: wallet.privateKey,
  });
  const result = {
    id: accounts.length,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
  return result;
};

const getWalletsData = () => () => {
  return accounts;
};

const getWalletData = ({ config }) => async index => {
  const systemWallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic);
  const provider = config.networkProvider();
  const wallet = new ethers.Wallet(accounts[index - 1].privateKey, provider);

  console.log("systemwallet", (await provider.getBalance(systemWallet.address)).toString());
  const tx = { to: wallet.address, value: 10 };
  await systemWallet.signTransaction(tx);
  const systemWalletConnected = systemWallet.connect(provider);
  await systemWalletConnected.sendTransaction(tx);

  const balance = (await provider.getBalance(wallet.address)).toString();
  return { wallet, balance };
};

const getWallet = ({ config }) => index => {
  const provider = config.networkProvider();
  const wallet = new ethers.Wallet(accounts[index - 1].privateKey, provider);
  return wallet;
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
});
