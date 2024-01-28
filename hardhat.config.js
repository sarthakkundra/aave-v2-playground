require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy");
require("dotenv").config();

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: {
		compilers: [
			{ version: "0.8.19" },
			{ version: "0.4.19" },
			{ version: "0.6.12" },
			{ version: "0.6.0" },
		],
	},
	networks: {
		hardhat: {
			chainId: 31337,
			forking: {
				url: MAINNET_RPC_URL,
			},
		},
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
	},
};
