// contracts/DataStore.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./libraries/Utils.sol";

contract DataStore {
  event AddedContract(string indexed name, address indexed _address, uint indexed categoryId);
  event AddedContractCategory(string indexed name);

  struct Contract {
    string name;
    address _address;
    uint categoryId;
  }

  Contract[] public contracts;
  string[] public contractCategories;

  constructor () {
    addContractCategory('uniswap_factory');
    addContractCategory('uniswap_router');
    addContractCategory('masterChef');
    addContractCategory('miniChefV2');
  }

  function addContract (string memory name, address _address, uint categoryId) external {
    require(!hasContract(_address), "Contract exists");
    contracts.push(Contract(name, _address, categoryId));
    emit AddedContract(name, _address, categoryId);
  }
  function addContractCategory (string memory category) public {
    require(!hasContractCategory(category), "Category exists");
    contractCategories.push(category);
    emit AddedContractCategory(category);
  }

  function hasContract (address _address) internal view returns(bool) {
    uint contractsCount = contracts.length;
    uint i;

    for (i = 0; i < contractsCount; i++) {
      if (_address == contracts[i]._address) {
        return true;
      }
    }
    return false;
  }
  function hasContractCategory (string memory category) internal view returns(bool) {
    uint contractCategoriesCount = contractCategories.length;
    uint i;

    for (i = 0; i < contractCategoriesCount; i++) {
      if (Utils._stringCompare(Utils._toLower(contractCategories[i]), Utils._toLower(category))) {
        return true;
      }
    }
    return false;
  }
  function getContractCategory (uint id) external view returns(string memory category) {
    category = contractCategories[id];
    return category;
  }
  function getContractCategoryIdFromName (string memory name) external view returns (uint val) {
    uint catLen = contractCategories.length;
    uint i;

    for (i = 0; i < catLen; i++) {
      if (
        Utils._stringCompare(
          Utils._toLower(contractCategories[i]),
          Utils._toLower(name)
        )
      ) {
        val = i;
        return val;
      }
    }
  }
  function getAllContracts () external view returns(Contract[] memory) {
    return contracts;
  }
  function getAllContractCetgories () external view returns(string[] memory _categories) {
    return contractCategories;
  }
  function getContractsByCategory (uint catId) external view returns(Contract[] memory _contracts) {
    uint total = contracts.length;
    uint i;
    uint numIncluded;
    for(i = 0; i < total; i++) {
      // _categories[i] = contractCategories[i];
      if (contracts[i].categoryId == catId) {
        numIncluded++;
      }
    }
    _contracts = new Contract[](numIncluded);
    uint tally;

    for(i = 0; i < total; i++) {
      if (tally == numIncluded) continue;
      // _categories[i] = contractCategories[i];
      if (contracts[i].categoryId == catId) {
        
        _contracts[tally] = contracts[i];
        tally++;

      }
    }
    return _contracts;
  }
  function contractsLength () external view returns(uint) {
    return contracts.length;
  }
}