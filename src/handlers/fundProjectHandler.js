function schema() {
  return {
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    },
    body: {
      type: "object",
      properties: {
        amount: {
          type: "integer",
        },
      },
    },
    required: ["amount"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const sponsorWallet = await walletService.getWallet(req.body.sponsorId);
    const amount = parseInt(req.body.amount);
    const result = await contractInteraction.fundProject(req.params.id, sponsorWallet, amount);
    reply.code(200).send(result);
  };
}

module.exports = { schema, handler };
