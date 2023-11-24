import {Web3} from 'web3';
import {network, ethers} from 'hardhat';
import {abi} from "./helper/tokenABI.json";

// fetching contract address and amount from env, this can be modified use take values from any input
const tokenAddress = process.env.TOKEN_ADDRESS;
const amount = process.env.MINT_AMOUNT;

async function main() {
  if (network.name !== 'bsc') {
    throw new Error('network should be bsc');
  }

  if (tokenAddress === undefined || amount === undefined) {
    throw new Error('contract address or amount not specified')
  }

  const users = await ethers.getSigners();
  const web3 = new Web3(process.env.URL_BSC)

  console.log('Minting ', amount, ' tokens for user')
  const tokenContract = new web3.eth.Contract(abi, tokenAddress)

  /// the caller should have a minter privileges 
  tokenContract.methods.mint(users[0].address, amount).send({
    from: users[0].address
  }).catch((e) => {
    console.log(e);
  });
};

main().catch((e) => console.error(e));
