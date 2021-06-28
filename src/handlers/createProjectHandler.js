function schema() {
  return {
    body: {
      type: "object",
      properties: {
        ownerId: {
          type: "string",
        },
        reviewerId: {
          type: "string",
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
      await walletService.getWallet(req.body.ownerId),
      await walletService.getWallet(req.body.reviewerId),
    );
  };
}

module.exports = { schema, handler };
