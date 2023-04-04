require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("@nomiclabs/hardhat-ethers")
require("@openzeppelin/hardhat-upgrades");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    networks: {
        localhost: {
            url: "http://127.0.0.1:8545"
        },
        mainnet: {
            url: "https://mainnet.infura.io/v3/5e076bb0b7c7496c85e7ad46e7ed6ce7",
            accounts: [
                process.env.PRIVATE_KEY
            ]
        },
        goerli: {
            url: "https://goerli.infura.io/v3/c33b476922cb4b47ac4fdaa71daded76",
            accounts: [
                process.env.PRIVATE_KEY
            ]
        },
        mumbai: {
            url: "https://matic-mumbai.chainstacklabs.com",
            accounts: [process.env.PRIVATE_KEY]
        },
        matic: {
            url: "https://polygon-mainnet.public.blastapi.io",
            accounts: [process.env.PRIVATE_KEY]
        }
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: "7AIT7DHQTMN8CB6D6B2MISK7YNFCAYTI64"

        // eth : 29MFTZIIGKCF46RJZJN26WKQ1FTJTF2YRK
        // matic : 7AIT7DHQTMN8CB6D6B2MISK7YNFCAYTI64
    },
    solidity: {
        compilers: [
            {
                version: "0.4.18",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.5.16",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.6.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.6.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.7.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.8.9",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.8.0",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            },
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                }
            }
        ]
    },
    mocha: {
        timeout: 200000
    }
}

