const { ethers, upgrades } = require("hardhat");

async function main() {

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

    const factoryContract = await ethers.getContractFactory('SvcDexFactory')
    let factory = await factoryContract.deploy()
    await factory.deployed();

    console.log(factory.address)


    const wmatic_address = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'
    const factory_address = '0xE857086AF5889e9A59d7Bed75A3082548386a842'

    const routerContract = await ethers.getContractFactory('SvcDexRouter01')
    let router = await routerContract.deploy(factory_address, wmatic_address)
    await router.deployed()

    console.log(router.address)

    // const pairContract = await ethers.getContractFactory('SvcDexPair')
    // let pair = await pairContract.deploy()
    // await pair.deployed()

    // console.log(pair.address)

}

main()
    .then(() => {
        console.log("complete");
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });


