function schema() {
  return {
    params: {
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
    const sponsorWallet = walletService.getWallet(req.body.sponsorId);
    const amount = parseInt(req.body.amount);
    const result = await contractInteraction.fundProject(req.params.id, sponsorWallet, amount);

    reply.code(200).send(result);
  };
}

module.exports = { schema, handler };
