function schema() {
  return {
    params: {
      type: "object",
      properties: {
        sponsorId: {
          type: "integer",
        },
        amount: {
          type: "integer",
        },
      },
    },
    required: ["sponsorId", "amount"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const sponsorWallet = await walletService.getWallet(req.body.sponsorId);
    const body = await contractInteraction.sponsorProject(req.params.id, sponsorWallet, req.body.amount);
    reply.code(200).send(body);
  };
}

module.exports = { schema, handler };
