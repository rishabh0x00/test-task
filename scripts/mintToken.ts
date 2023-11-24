import {Web3} from 'web3';
import {network, ethers} from 'hardhat';
import {contractAddress, contractABI} from "./helper/tokenConfig.json";

const amount = process.env.MINT_AMOUNT;

async function main() {
  if (network.name !== 'bsc') {
    throw new Error('network should be bsc');
  }

  if (amount === undefined) {
    throw new Error('amount not specified')
  }

  const users = await ethers.getSigners(); // using user account to mint
  const web3 = new Web3(process.env.URL_BSC)

  // Replace 'yourPrivateKey' with the private key of the account performing the mint operation
  const privateKey = `${process.env.PRIVATE_KEY}`; 
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  // Creating contract instance
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  try {
      const mintTx = contract.methods.mint(users[0].address, amount);
      const gas = await mintTx.estimateGas({from: account.address});
      const gasPrice = await web3.eth.getGasPrice();
      const data = mintTx.encodeABI();
      const nonce = await web3.eth.getTransactionCount(account.address);

      const signedTx = await web3.eth.accounts.signTransaction({
          to: contractAddress,
          data,
          gas,
          gasPrice,
          nonce,
          chainId: 97 // BSC Testnet Chain ID
      }, privateKey);

      const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
      console.log(`Minted ${amount} tokens to ${users[0].address}. Transaction Hash: ${receipt.transactionHash}`);
  } catch (error) {
      console.error('Error minting tokens:', error);
  }
};

main().catch((e) => console.error(e));
