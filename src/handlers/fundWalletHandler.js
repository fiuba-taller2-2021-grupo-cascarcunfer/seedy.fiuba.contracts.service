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
    const result = await walletService.fundWallet(req.params.id, parseInt(req.body.amount));
    reply.code(200).send(result);
  };
}

module.exports = { schema, handler };
