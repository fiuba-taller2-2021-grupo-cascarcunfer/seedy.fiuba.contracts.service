function schema() {
  return {
    params: {
      type: "object",
      properties: {
        ownerId: {
          type: "integer",
        },
        reviewerId: {
          type: "integer",
        },
        stagesCost: {
          type: "array",
          minItems: 1,
          Items: { type: "number" },
        },
      },
    },
    required: ["ownerId", "reviewerId", "stagesCost"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    return await contractInteraction.createProject(
      walletService.getDeployerWallet(),
      req.body.stagesCost,
      walletService.getWallet(req.body.ownerId),
      walletService.getWallet(req.body.reviewerId),
    );
  };
}

module.exports = { schema, handler };
