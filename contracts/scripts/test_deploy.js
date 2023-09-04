const { ethers, upgrades } = require("hardhat");

async function main() {

    var exchangeRouter;
    var exchangeFactory;
    var wBNB;


    var [owner] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("SvcDexFactory");

    exchangeFactory = await Factory.deploy(owner.address);
    await exchangeFactory.deployed();

    console.log(await exchangeFactory.INIT_CODE_PAIR_HASH());

    console.log("exchange factory", exchangeFactory.address);

    //deploy wBNB contract for test

    const WBNB = await ethers.getContractFactory("WBNB");
    wBNB = await WBNB.deploy();
    await wBNB.deployed();

    console.log("wBNB", wBNB.address);

    //deploy router contract for test

    const Router = await ethers.getContractFactory("SvcDexRouter01");
    exchangeRouter = await Router.deploy(
        exchangeFactory.address,
        wBNB.address
    );
    await exchangeRouter.deployed();
    console.log("exchange router", exchangeRouter.address);

    const svcContract = await ethers.getContractFactory("SVC");
    let svc = await svcContract.deploy();
    await svc.deployed();

    console.log(svc.address);

    const wethContract = await ethers.getContractFactory("WETH");
    let weth = await wethContract.deploy();
    await weth.deployed();

    console.log(weth.address);


    const wbtcContract = await ethers.getContractFactory("WBTC");
    let wbtc = await wbtcContract.deploy();
    await wbtc.deployed();

    console.log(wbtc.address);



}

main()
    .then(() => {
        console.log("complete");
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });

// 0xE857086AF5889e9A59d7Bed75A3082548386a842
// 0xDfec65ceD3dB351E3a8C4e1fB5094802cb3feFF6


// 0x40ae465CC90c636Ea0Ff123f91924d222F513a6E
// 0x46D7484dd2E05F4108192Fd0c6431c8e24511C23
// 0xd3FCc4593470257Ab924950B5d83aeE611708533
