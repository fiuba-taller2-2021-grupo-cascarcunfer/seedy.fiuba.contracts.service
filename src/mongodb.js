const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  address: String,
  privateKey: String,
});

walletSchema.statics.getById = function (id) {
  return this.findById(mongoose.Types.ObjectId(id)).exec();
};

walletSchema.method("asObj", function () {
  var obj = this.toObject();
  obj.id = obj._id;
  delete obj._id;
  return obj;
});

const Wallet = mongoose.model("Wallet", walletSchema);
const projectSchema = new mongoose.Schema({
  id: Number,
  ownerWalletId: mongoose.Types.ObjectId,
  reviewerWalletId: mongoose.Types.ObjectId,
  stagesCost: [Number],
  hash: String,
});

projectSchema.statics.getById = function (id) {
  return this.findOne({ id: id }).exec();
};

projectSchema.method("asObj", function () {
  return this.toObject();
});

const Project = mongoose.model("Project", projectSchema);

const connect = async (retries, uri) => {
  await mongoose
    .connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(value => console.log(`Connected to mongodb. ${value}`))
    .catch(err => {
      console.log(`An error occurred connecting to mongodb. ${err}`);
      if (retries && retries > 0) {
        const timeout = (2 ^ retries) * 1000;
        console.log(`Retrying to connect to mongodb in ${timeout} millis`);
        setTimeout(() => connectMongo(retries - 1, uri), timeout);
      } else {
        return process.exit(22);
      }
    });
};

module.exports = { Wallet, Project, connect };
