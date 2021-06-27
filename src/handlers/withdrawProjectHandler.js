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
    reply.code(403).send("NotImplemented");
  };
}

module.exports = { schema, handler };
