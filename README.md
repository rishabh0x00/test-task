# Test Task Solution

1. Install Packages 

   `yarn`

2. Setup requires values after copying `env.example` file into a new `.env` file
   
3. Compile code

   `yarn compile`

4. Run tests
   * All tests
      `yarn test`
   * Specific test
      `yarn test <path-to-test-file>`

5. Run Scripts(work only for bsc network)
   * fetch totalSupply
      `npx hardhat run  scripts/getTotalSupply.ts --network bsc`
   * mint tokens
      `npx hardhat run  scripts/mintToken.ts --network bsc`
