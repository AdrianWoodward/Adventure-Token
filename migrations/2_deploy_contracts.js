var Adventure = artifacts.require("./Adventure.sol");

module.exports = function (deployer) {
  deployer.deploy(Adventure);
};
