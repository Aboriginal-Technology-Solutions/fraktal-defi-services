// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract Locker is TimelockController {
  constructor (uint lockerTimeout, address[] memory proposers, address[] memory executors) 
  TimelockController(lockerTimeout, proposers, executors) {}
  
}