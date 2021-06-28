const ethers = require("ethers");
const { Wallet } = require("../mongodb");
const { toWei } = require("../services/helpers");

const getDeployerWallet = ({ config }) => () => {
  const provider = config.networkProvider();
  return ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
};

const createWallet = ({ config }) => async () => {
  const provider = config.networkProvider();
  const wallet = ethers.Wallet.createRandom().connect(provider);
  return (
    await new Wallet({
      address: wallet.address,
      privateKey: wallet.privateKey,
    }).save()
  ).asObj();
};

const getWalletsData = () => async () => {
  return (await Wallet.find({})).map(item => item.asObj());
};

const getWalletData = ({ config }) => async id => {
  const account = await Wallet.getById(id);
  const provider = config.networkProvider();
  const wallet = new ethers.Wallet(account.privateKey, provider);
  const balance = (await provider.getBalance(wallet.address)).toString();
  return { ...account.asObj(), balance };
};

const transfer = async ({ from, to, amount }) => {
  const tx = { to: to.address, value: amount };
  await from.signTransaction(tx);
  await from.sendTransaction(tx);
};

const getWallet = ({ config }) => async index => {
  const account = await Wallet.getById(index);
  const provider = config.networkProvider();
  const wallet = new ethers.Wallet(account.privateKey, provider);
  return wallet;
};

const fundWallet = ({ config }) => async (walletId, amount) => {
  const account = await Wallet.getById(walletId);
  const provider = config.networkProvider();
  const from = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
  const to = new ethers.Wallet(account.privateKey, provider);

  const tx = {
    to: to.address,
    value: toWei(amount),
  };

  await from.signTransaction(tx);
  await from.sendTransaction(tx);

  const balance = (await provider.getBalance(to.address)).toString();
  return { ...account.asObj(), balance };
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
  fundWallet: fundWallet({ config }),
});
