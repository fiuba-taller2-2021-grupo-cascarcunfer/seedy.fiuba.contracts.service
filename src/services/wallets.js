const ethers = require("ethers");
const accounts = [];

const getDeployerWallet = ({ config }) => () => {
  const provider = config.networkProvider();
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = ({ config }) => async () => {
  const provider = config.networkProvider();
  const wallet = ethers.Wallet.createRandom().connect(provider);
  const result = {
    id: accounts.length,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
  accounts.push(result);
  return result;
};

const getWalletsData = () => () => {
  return accounts;
};

const getWalletData = ({ config }) => async index => {
  const provider = config.networkProvider();
  const wallet = new ethers.Wallet(accounts[index].privateKey, provider);
  const balance = (await provider.getBalance(wallet.address)).toString();
  return { ...accounts[index], balance };
};

const transfer = async ({ from, to, amount }) => {
  const tx = { to: to.address, value: amount };
  await from.signTransaction(tx);
  await from.sendTransaction(tx);
};

const getWallet = ({ config }) => index => {
  const provider = config.networkProvider();
  const wallet = new ethers.Wallet(accounts[index].privateKey, provider);
  return wallet;
};

const fundWallet = ({ config }) => async (walletId, amount) => {
  const provider = config.networkProvider();
  const from = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
  const to = new ethers.Wallet(accounts[walletId].privateKey, provider);

  const tx = { to: to.address, value: amount };
  await from.signTransaction(tx);
  await from.sendTransaction(tx);

  const balance = (await provider.getBalance(to.address)).toString();
  return { ...accounts[walletId], balance };
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
  fundWallet: fundWallet({ config }),
});
