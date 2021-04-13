pragma solidity ^0.6.6;

contract AccuFarmer {
  address public owner;
  address private creator;
  IUniswapV2Factory factory;
  IMasterFarmer farmer;
  IUniswapV2Router02 router;
  enum Actions {swap}
  // event Action {
  //   Actions action;
  // }
  constructor (address _factory, address _farmer, address _router) public {
    factory = IUniswapV2Factory(_factory);
    farmer = IMasterFarmer(_farmer);
    router = IUniswapV2Router02(_router);

    creator = msg.sender;
    owner = creator;
  }
  function transferOwner (addres _newOwner) public {
    require(msg.sender == owner, 'Unathorized usage!');

    owner = _newOwner;
  }
  // This will remove the only owner 
  function revokeOwner () public {
    owner = 0x0;
  }

  function swap (address token0, address token1, uint amt0, uint amt1, uint dealine) public {
    
  }

  function swapToLiquidity () public {}
  function ethToLiquidity () public {}
  function swapToFarm () public {}
  function ethToFarm () public {}
  function addLiquity () public {}
  function removeLiquidity () public {}
  function harvest (uint _id) public {}
  function farm (address lpToken, uint amt) public {}

  function pending (uint _id, address _user) public returns (uit) {
    return farmer.pendingReward(_id, _user);
  }
  
}