import {Web3} from 'web3';
import {network, ethers} from 'hardhat';
import {abi} from "./helper/tokenABI.json";

// fetching contract address from env, this can be modified use take values from any input
const tokenAddress = process.env.TOKEN_ADDRESS;

async function main() {
  if (network.name !== 'bsc') {
    throw new Error('network should be bsc');
  }

  if (tokenAddress === undefined) {
    throw new Error('contract address not specified')
  }

  console.log('Fetching total supply for contract deployed at ', tokenAddress)

  const users = await ethers.getSigners();
  const web3 = new Web3(process.env.URL_BSC)
  const tokenContract = new web3.eth.Contract(abi, tokenAddress)

  tokenContract.methods.totalSupply().call({
    from: users[0].address,
  }).then((result) => {
    console.log(result)
  })
};

main().catch((e) => console.error(e));
