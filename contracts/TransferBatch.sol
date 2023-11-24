// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * @title TransferBatch contract
 * @author Rishabh Sharma
 * @notice Contract for batch transfers developed as a test task 
 */
contract TransferBatch {
    /// @notice we need an upper bound for loops based on the gas consumption of transfers,
    ///         or else the transaction will run out of gas. We can identify this value by running tests.
    uint256 public upperBound;

    /// @notice the token contract of transfers
    IERC20 public tokenAddress;
    
    /**
     * @notice constructor to set the initial values
     * @param _tokenAddress address of the token contract
     * @param _upperBound maximum size of the array
     */
    constructor (address _tokenAddress, uint256 _upperBound) {
        if (_tokenAddress == address(0)) {
            revert('Token Address cannot be Zero');
        }

        if (_upperBound == 0) {
            revert('Upper bound cannot be Zero');
        }

        tokenAddress = IERC20(_tokenAddress);
        upperBound = _upperBound;
    }

    /**
     * @dev function to call multiple token transfers within a single transaction
     * @param _to array of receiver addresses
     * @param _amounts array of transfer amounts
     */
    function transferBatch(address[] calldata _to, uint256[] calldata _amounts) external {
        uint256 length = _to.length;
        if (length > upperBound || length != _amounts.length) {
            revert('Invalid Input');
        }

        uint256 index;
        while(index < length) {
            tokenAddress.transfer(_to[index], _amounts[index]);
            index++;
        }
    }
}