const getWalletData = require("./handlers/getWalletHandler");
const getWalletsData = require("./handlers/getWalletsHandler");
const createWallet = require("./handlers/createWalletHandler");
const createProject = require("./handlers/createProjectHandler");
const getProject = require("./handlers/getProjectHandler");
const fundWallet = require("./handlers/fundWalletHandler");
const fundProject = require("./handlers/fundProjectHandler");
const withdrawProject = require("./handlers/withdrawProjectHandler");

function getWalletsDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallet",
    schema: getWalletsData.schema(config),
    handler: getWalletsData.handler({ config, ...services }),
  };
}

function getWalletDataRoute({ services, config }) {
  return {
    method: "GET",
    url: "/wallet/:id",
    schema: getWalletData.schema(config),
    handler: getWalletData.handler({ config, ...services }),
  };
}

function fundWalletDataRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallet/:id/funds",
    schema: fundWallet.schema(config),
    handler: fundWallet.handler({ config, ...services }),
  };
}

function createWalletRoute({ services, config }) {
  return {
    method: "POST",
    url: "/wallet",
    schema: createWallet.schema(config),
    handler: createWallet.handler({ config, ...services }),
  };
}

function createProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/project",
    schema: createProject.schema(config),
    handler: createProject.handler({ config, ...services }),
  };
}

function getProjectRoute({ services, config }) {
  return {
    method: "GET",
    url: "/project/:id",
    schema: getProject.schema(config),
    handler: getProject.handler({ config, ...services }),
  };
}

function fundProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/project/:id/funds",
    schema: fundProject.schema(config),
    handler: fundProject.handler({ config, ...services }),
  };
}

function withdrawProjectRoute({ services, config }) {
  return {
    method: "POST",
    url: "/project/:id/withdraw",
    schema: withdrawProject.schema(config),
    handler: withdrawProject.handler({ config, ...services }),
  };
}

module.exports = [
  getWalletsDataRoute,
  getWalletDataRoute,
  createWalletRoute,
  createProjectRoute,
  getProjectRoute,
  fundWalletDataRoute,
  fundProjectRoute,
  withdrawProjectRoute,
];
