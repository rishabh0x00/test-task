import 'dotenv/config';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import {HardhatUserConfig} from 'hardhat/config';

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    sepolia: {
      url: process.env.URL,
      accounts: [`${process.env.PRIVATE_KEY}`]
    }
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
  },
};

export default config;
