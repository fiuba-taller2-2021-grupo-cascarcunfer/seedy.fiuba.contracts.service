const ethers = require("ethers");
const { toWei } = require("../services/helpers");
const { Project } = require("../mongodb");

const createProject = ({ config }) => async (deployerWallet, stagesCost, ownerWallet, reviewerWallet) => {
  const provider = config.networkProvider();
  const seedyfiuba = new ethers.Contract(config.contractAddress, config.contractAbi, deployerWallet);
  const tx = await seedyfiuba.createProject(stagesCost.map(toWei), ownerWallet.address, reviewerWallet.address);
  const receipt = await tx.wait(1);
  const firstEvent = receipt && receipt.events && receipt.events[0];
  if (firstEvent && firstEvent.event == "ProjectCreated") {
    const projectId = firstEvent.args.projectId.toNumber();
    const project = new Project({
      stagesCost,
      ownerWalletId: ownerWallet.id,
      reviewerWalletId: reviewerWallet.id,
      id: projectId,
      hash: tx.hash,
    });
    return (await project.save()).asObj();
  } else {
    throw new Error(`Project not created in tx ${tx.hash}`);
  }
};

const getProject = ({ config }) => async id => {
  const provider = config.networkProvider();
  const seedyfiuba = new ethers.Contract(config.contractAddress, config.contractAbi, provider);
  const project = await Project.getById(id);
  const [state] = await seedyfiuba.projects(id);
  return { ...project.asObj(), state: { 0: "FUNDING", 1: "CANCELED", 2: "IN_PROGRESS", 3: "COMPLETED" }[state] };
};

const fundProject = ({ config }) => async (projectId, sponsorWallet, amount) => {
  const project = await Project.getById(projectId);

  const provider = config.networkProvider();
  const seedyfiuba = new ethers.Contract(config.contractAddress, config.contractAbi, sponsorWallet);
  const tx = await seedyfiuba.fund(projectId, { value: toWei(amount) });
  const receipt = await tx.wait(1);
  const firstEvent = receipt && receipt.events && receipt.events[0];

  return { ...project.asObj(), ...firstEvent };
};

const withdrawProject = ({ config, walletService }) => async (projectId, stageIndex) => {
  const project = await Project.getById(projectId);
  const account = await Project.getById(project.ownerWalletId);

  const provider = config.networkProvider();
  const ownerWallet = walletService.getWallet(account.privateKey, provider);
  const seedyfiuba = new ethers.Contract(config.contractAddress, config.contractAbi, ownerWallet);
  const tx = await seedyfiuba.withdraw(projectId, stateIndex);
  const receipt = await tx.wait(1);
  const firstEvent = receipt && receipt.events && receipt.events[0];

  return { ...project.asObj(), ...firstEvent };
};

module.exports = dependencies => ({
  createProject: createProject(dependencies),
  getProject: getProject(dependencies),
  fundProject: fundProject(dependencies),
  withdrawProject: withdrawProject(dependencies),
});
