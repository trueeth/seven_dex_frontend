const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { toBigNum, fromBigNum } = require("./utils.js");

let exchangeRouter;
let exchangeFactory;
let wMatic;
let svc;
let wbtc;
let weth



describe("Create Account", () => {

    it("Create Account", async () => {
        [owner] = await ethers.getSigners();
        userWallet = ethers.Wallet.createRandom();
        userWallet = userWallet.connect(ethers.provider);
        let tx = await owner.sendTransaction({
            to: userWallet.address,
            value: ethers.utils.parseUnits("10", 18)
        });
        await tx.wait();
    });

});

describe("contract deploys", () => {

    it("contract deploy", async () => {
        const Factory = await ethers.getContractFactory("SvcDexFactory");

        exchangeFactory = await Factory.deploy();
        await exchangeFactory.deployed();

        console.log(await exchangeFactory.INIT_CODE_PAIR_HASH());

        console.log("exchange factory", exchangeFactory.address);

        //deploy wMatic contract for test

        const WMATIC = await ethers.getContractFactory("WMATIC");
        wMatic = await WMATIC.deploy();
        await wMatic.deployed();

        console.log("wMatic", wMatic.address);

        //deploy router contract for test

        const Router = await ethers.getContractFactory("SvcDexRouter01");
        exchangeRouter = await Router.deploy(
            exchangeFactory.address,
            wMatic.address
        );
        await exchangeRouter.deployed();
        console.log("exchange router", exchangeRouter.address);

        const svcContract = await ethers.getContractFactory("SVC");
        svc = await svcContract.deploy();
        await svc.deployed();

        console.log(svc.address);

        const wethContract = await ethers.getContractFactory("WETH");
        weth = await wethContract.deploy();
        await weth.deployed();

        console.log(weth.address);


        const wbtcContract = await ethers.getContractFactory("WBTC");
        wbtc = await wbtcContract.deploy();
        await wbtc.deployed();

        console.log(wbtc.address);
    });
})

describe("initial settings", () => {

    it("approve svc for router", async () => {
        let tx = await svc.approve(
            exchangeRouter.address,
            toBigNum("100000000", 18)
        );
        await tx.wait();
    });

    it("approve weth for router", async () => {
        let tx = await weth.approve(
            exchangeRouter.address,
            toBigNum("100000000", 18)
        );
        await tx.wait();
    });

    it("approve wbtc for router", async () => {
        let tx = await wbtc.approve(
            exchangeRouter.address,
            toBigNum("100000000", 18)
        );
        await tx.wait();
    });

});

describe("testing", () => {

    it("create pool and add liquidity", async () => {
        // let tx = await exchangeRouter.addLiquidityETH(
        //     svc.address,
        //     toBigNum("100", 18),
        //     0,
        //     0,
        //     owner.address,
        //     '9999999999999',
        //     {
        //         value: ethers.utils.parseUnits("0.1", 18)
        //     }
        // )
        // await tx.wait()

        let tx = await exchangeRouter.addLiquidity(
            svc.address,
            weth.address,
            toBigNum("100", 18),
            toBigNum("100", 18),
            0,
            0,
            owner.address,
            '999999999999999'
        )
        await tx.wait()
        console.log("done")
    });

});

