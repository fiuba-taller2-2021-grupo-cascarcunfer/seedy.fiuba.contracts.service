const ethers = require("ethers");

const toWei = number => {
  return ethers.utils.parseEther(number.toString());
};

module.exports = { toWei };
