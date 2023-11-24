import 'dotenv/config';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import "@nomicfoundation/hardhat-ethers";
import {HardhatUserConfig} from 'hardhat/config';

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    sepolia: {
      chainId: 11155111,
      url: process.env.URL_SEPOLIA,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
    polygon: {
      chainId: 137,
      url: process.env.URL_POLYGON,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
    bsc: {
      chainId: 56,
      url: process.env.URL_BSC,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.20',
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
          },
        },
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    user: 1,
  },
};

export default config;
