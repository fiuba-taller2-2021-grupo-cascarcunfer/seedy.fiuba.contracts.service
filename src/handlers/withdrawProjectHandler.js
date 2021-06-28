function schema() {
  return {
    params: {
      type: "object",
      properties: {
        stage: {
          type: "integer",
        },
      },
    },
    required: ["stage"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req, reply) {
    const result = await contractInteraction.withdraw(req.params.id, req.params.stage);
    reply.code(200).send(result);
  };
}

module.exports = { schema, handler };
