const { getWeth } = require("./getWeth");
const { getNamedAccounts, ethers } = require("hardhat");
const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

async function main() {
	await getWeth();
	const signer = await ethers.provider.getSigner();
	const { deployer } = await getNamedAccounts();

	// LP address
	// LP addresses provider - 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
	// deposit some liquidity

	const lendingPool = await getLendingPoolAdd(signer);
	// console.log(lendingPool);

	await approveERC20(
		WETH_ADDRESS,
		signer,
		lendingPool.target,
		ethers.parseEther("0.02")
	);
	console.log("DEPOSITING....");
	await lendingPool.deposit(WETH_ADDRESS, ethers.parseEther("0.02"), signer, 0);
	console.log("DEPOSITED!");

	const { totalDebtETH, availableBorrowsETH } = await getBorrowUserData(
		lendingPool,
		signer
	);

	const daiPrice = await getDaiPrice();
	console.log(availableBorrowsETH.toString(), daiPrice.toString());
	const amountDaiToBorrow =
		availableBorrowsETH.toString() * 0.95 * (1 / Number(daiPrice));
	console.log(
		`You can borrow ${amountDaiToBorrow} DAI, ${typeof amountDaiToBorrow}`
	);

	const amountDaiToBorrowWei = ethers.parseEther(amountDaiToBorrow.toString());
	console.log(
		"AMOUNT DAI TO BORROW WEI ",
		amountDaiToBorrowWei,
		typeof amountDaiToBorrowWei
	);
	await borrowDai(
		"0x6B175474E89094C44Da98b954EedeAC495271d0F",
		lendingPool,
		amountDaiToBorrowWei,
		deployer
	);
	await getBorrowUserData(lendingPool, signer);
}

async function borrowDai(
	daiAddress,
	lendingPool,
	amountDaiToBorrowWei,
	account
) {
	const borrowTx = await lendingPool.borrow(
		daiAddress,
		amountDaiToBorrowWei,
		1,
		0,
		account
	);
	await borrowTx.wait(1);
	console.log("You've borrowed!");
}

async function getDaiPrice() {
	const daiEthPriceFeed = await ethers.getContractAt(
		"AggregatorV3Interface",
		"0x773616E4d11A78F511299002da57A0a94577F1f4"
	);

	const price = (await daiEthPriceFeed.latestRoundData())[1];
	return price;
}

async function getLendingPoolAdd(signer) {
	const lendingPoolAddressesProvider = await ethers.getContractAt(
		"ILendingPoolAddressesProvider",
		"0xb53c1a33016b2dc2ff3653530bff1848a515c8c5",
		signer
	);

	const lendingPoolAdd = await lendingPoolAddressesProvider.getLendingPool();
	const lendingPool = await ethers.getContractAt(
		"ILendingPool",
		lendingPoolAdd,
		signer
	);
	// console.log(lendingPool);
	return lendingPool;
}

async function approveERC20(
	erc20Address,
	account,
	spenderAddress,
	amountToSpend
) {
	const erc20 = await ethers.getContractAt("IERC20", erc20Address, account);

	console.log("ARGS ", spenderAddress, amountToSpend);
	const tx = await erc20.approve(spenderAddress, amountToSpend);
	await tx.wait(1);
	console.log("Approved!");
}

async function getBorrowUserData(lendingPool, account) {
	const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
		await lendingPool.getUserAccountData(account);

	console.log({ totalCollateralETH, totalDebtETH, availableBorrowsETH });
	return { totalDebtETH, availableBorrowsETH };
}
main()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
