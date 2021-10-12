// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

import "./Banker.sol";
import "./FraktalDefiGovernor.sol";
import "./FraktalDefiServicesToken.sol";
import "./DataStore.sol";

contract FraktalDefiServices is Ownable, AccessControl {
  Banker public banker;
  DataStore public dataStore;
  FraktalDefiGovernor public governor;
  FraktalDefiServicesToken public fraktalDefiServicesToken;
  TimelockController public locker;

  constructor (address _weth) {
    // banker = new Banker(_weth);
    // dataStore = new DataStore();
    // fraktalDefiServicesToken = new FraktalDefiServicesToken();
    // locker = new TimelockController(lockerTimeout, proposers, executors);
    // governor = new FraktalDefiGovernor(fraktalDefiServicesToken, locker);
  }
}