const { getNamedAccounts, ethers } = require("hardhat");

const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

async function getWeth() {
	const { deployer } = await getNamedAccounts();
	const signer = await ethers.provider.getSigner();

	// console.log(ethers);
	const iWeth = await ethers.getContractAt("IWeth", WETH_ADDRESS, signer);

	// console.log(signer);
	// console.log("---------------------------------------------------------");
	// console.log(deployer);

	const tx = await iWeth.deposit({ value: ethers.parseEther("0.02") });
	await tx.wait(1);

	const wethBalance = await iWeth.balanceOf(deployer);
	console.log(`Got ${wethBalance.toString()} WETH`);

	// // LP address
	// // LP addresses provider - 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
	// // deposit some liquidity

	// const lendingPool = await getLendingPoolAdd(signer);
	// // console.log(lendingPool);

	// await approveERC20(
	// 	WETH_ADDRESS,
	// 	signer,
	// 	lendingPool.target,
	// 	ethers.parseEther("0.02")
	// );
	// console.log("DEPOSITING....");
	// await lendingPool.deposit(
	// 	WETH_ADDRESS,
	// 	ethers.parseEther("0.002"),
	// 	signer,
	// 	0
	// );
	// console.log("DEPOSITED!");
}

// async function getLendingPoolAdd(signer) {
// 	const lendingPoolAddressesProvider = await ethers.getContractAt(
// 		"ILendingPoolAddressesProvider",
// 		"0xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
// 		signer
// 	);

// 	const lendingPoolAdd = await lendingPoolAddressesProvider.getLendingPool();
// 	const lendingPool = await ethers.getContractAt(
// 		"ILendingPool",
// 		lendingPoolAdd,
// 		signer
// 	);
// 	// console.log(lendingPool);
// 	return lendingPool;
// }

// async function approveERC20(
// 	erc20Address,
// 	account,
// 	spenderAddress,
// 	amountToSpend
// ) {
// 	const erc20 = await ethers.getContractAt("IERC20", erc20Address, account);

// 	console.log("ARGS ", spenderAddress, amountToSpend);
// 	const tx = await erc20.approve(spenderAddress, amountToSpend);
// 	await tx.wait(1);
// 	console.log("Approved!");
// }

module.exports = { getWeth };
