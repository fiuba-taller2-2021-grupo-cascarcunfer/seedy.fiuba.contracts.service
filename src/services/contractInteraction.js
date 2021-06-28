const ethers = require("ethers");
const { toWei } = require("../services/helpers");

const projects = {};

const createProject = ({ config }) => async (deployerWallet, stagesCost, ownerWallet, reviewerWallet) => {
  const provider = config.networkProvider();
  const seedyfiuba = new ethers.Contract(config.contractAddress, config.contractAbi, deployerWallet);
  const tx = await seedyfiuba.createProject(stagesCost.map(toWei), ownerWallet.address, reviewerWallet.address);
  const receipt = await tx.wait(1);
  const firstEvent = receipt && receipt.events && receipt.events[0];
  if (firstEvent && firstEvent.event == "ProjectCreated") {
    const projectId = firstEvent.args.projectId.toNumber();
    const project = {
      projectId,
      stagesCost,
      ownerWallet: ownerWallet,
      reviewerWallet: reviewerWallet,
      hash: tx.hash,
    };
    projects[projectId] = project;
    return project;
  } else {
    throw new Error(`Project not created in tx ${tx.hash}`);
  }
};

const getProject = ({ config }) => async id => {
  const provider = config.networkProvider();
  const seedyfiuba = new ethers.Contract(config.contractAddress, config.contractAbi, provider);

  console.log(`Getting project ${id}: ${projects[id]}`);
  console.log("projects", await seedyfiuba.projects(id));
  return projects[id];
};

const fundProject = ({ config }) => async (projectId, sponsorWallet, amount) => {
  const provider = config.networkProvider();
  const seedyfiuba = new ethers.Contract(config.contractAddress, config.contractAbi, sponsorWallet);
  const tx = await seedyfiuba.fund(projectId, { value: toWei(amount) });
  const receipt = await tx.wait(1);
  const firstEvent = receipt && receipt.events && receipt.events[0];
  return firstEvent;
};

const withdrawProject = ({ config, walletService }) => async (projectId, stageIndex) => {
  const provider = config.networkProvider();
  const ownerWallet = walletService.getWallet(projects[projectId].ownerWallet.privateKey, provider);
  const seedyfiuba = new ethers.Contract(config.contractAddress, config.contractAbi, ownerWallet);
  const tx = await seedyfiuba.withdraw(projectId, stateIndex);
  const receipt = await tx.wait(1);
  const firstEvent = receipt && receipt.events && receipt.events[0];
  return firstEvent;
};

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
  fundProject: fundProject(dependencies),
  withdrawProject: withdrawProject(dependencies),
});
