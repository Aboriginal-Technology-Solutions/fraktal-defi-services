// contracts/Banker.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./libraries/Utils.sol";
import "./interfaces/IUniswapV2.sol";
import "./interfaces/IWETH.sol";
import "./DataStore.sol";

contract Banker is ERC1155, ERC1155Holder, DataStore {
  // DataStore dataStore;
  IWETH WETH;
  mapping(address => mapping(address => uint)) userTokenBalances;
  // uint256 public constant GOLD = 0;
  // uint256 public constant SILVER = 1;
  // uint256 public constant THORS_HAMMER = 2;
  // uint256 public constant SWORD = 3;
  // uint256 public constant SHIELD = 4;
  uint256 public constant FGOV = 0;
  uint256 public constant FSHARES = 0;
  constructor(address _weth) ERC1155("https://game.example/api/item/{id}.json") {
    WETH = IWETH(_weth);
    // dataStore = new DataStore();
    _mint(msg.sender, FGOV, 1000000*10**18, "");
    _mint(msg.sender, FSHARES, 1000000*10**18, "");
    // _mint(msg.sender, SILVER, 10**27, "");
    // _mint(msg.sender, THORS_HAMMER, 1, "");
    // _mint(msg.sender, SWORD, 10**9, "");
    // _mint(msg.sender, SHIELD, 10**9, "");
  }

  receive () external payable {}
  fallback () external payable {}

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC1155Receiver) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function tokenDeposit (address token, uint amount) external payable {
    address user = msg.sender;
    if (token == address(WETH)) token = Utils.ZERO_ADDRESS; 
    require(IERC20(token).balanceOf(user) >= amount, "Insufficient balance");
    userTokenBalances[user][token] += amount;
    IERC20(token).transferFrom(user, address(this), amount);
  }

  function tokenWithdrawal (address token, uint amount) external {
    address user = msg.sender;
    require(userTokenBalances[user][token] >= amount, "Insufficient balance");
    userTokenBalances[user][token] -= amount;
    IERC20(token).transfer(user, amount);
  }

  function ethDeposit (uint amount) external payable {
    address payable user = payable(msg.sender);
    address token = Utils.ZERO_ADDRESS;

    require(user.balance >= amount, "Insufficient balance");
    require(msg.value >= amount, "Insufficient balance");
    userTokenBalances[user][token] += amount;
    
    WETH.deposit{value: msg.value}();
  }

  function ethWithdrawal (uint amount) external {
    address payable user = payable(msg.sender);
    address token = Utils.ZERO_ADDRESS;

    require(userTokenBalances[user][token] >= amount, "Not enough funds in contract for you withdrawal");
    userTokenBalances[user][token] -= amount;
    WETH.withdraw(amount);
    (bool success,) = user.call{value: amount}("");
    require(success, "Failed to send ETH");
  }
  function getUserTokenBalance (address token) external view returns(uint) {
    address user = _msgSender();
    return userTokenBalances[user][token];
  }

  function getBestPriceRoutersTotal (address token0, address token1) external view returns(uint numResults) {
    uint uniswapV2Router02 = this.getContractCategoryIdFromName("uniswapV2Router02");
    Contract[] memory _routers = this.getContractsByCategory(uniswapV2Router02);
    uint i;

    {
      for (i = 0; i < _routers.length; i++) {
        IUniswapV2Router02 router = IUniswapV2Router02(_routers[i]._address);
        IUniswapV2Factory factory = IUniswapV2Factory(router.factory());
        // address pair = factory.getPair(token0, token1);
        if (factory.getPair(token0, token1) != Utils.ZERO_ADDRESS) numResults++;
      }
    }

  }
  function getBestPrice (address token0, address token1, uint amount) external view returns(
    address[] memory routers,
    uint[] memory amounts
  ) {
    uint i;
    uint uniswapV2Router02 = this.getContractCategoryIdFromName("uniswapV2Router02");
    Contract[] memory _routers = this.getContractsByCategory(uniswapV2Router02);
    uint tally;
    uint numResults = this.getBestPriceRoutersTotal(token0, token1);
    address[] memory path = new address[](2);
    path[0] = token0;
    path[1] = token1;

    IUniswapV2Router02 router;
    IUniswapV2Factory factory;

    routers = new address[](numResults);
    amounts = new uint[](numResults);
    {
      for (i = 0; i < numResults; i++) {
        router = IUniswapV2Router02(_routers[i]._address);
        factory = IUniswapV2Factory(router.factory());
        // address pair = factory.getPair(token0, token1);
        if (factory.getPair(token0, token1) != Utils.ZERO_ADDRESS) {
          uint[] memory amountsOut = router.getAmountsOut(amount, path);
          routers[tally] = address(router);
          amounts[tally] = amountsOut[1];
        }
      }
    }
    return (routers, amounts);
  }
}