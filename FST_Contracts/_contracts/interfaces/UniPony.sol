pragma solidity ^0.6.12;


import './interfaces/IERC20.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IUniswapV2Factory.sol';
import './interfaces/IUniswapV2Pair.sol';
import './libraries/UniswapV2Library.sol';

contract UniPony {
  
  event Transfer (
    address owner,
    address spender,
    uint amount,
    bool success
  );
  address owner;
  constructor () public {
    owner = msg.sender;
  }
  receive() external payable {}
  fallback() external payable {}

  function transferTest (uint amount, address _token) external payable {
    bool success;
    IERC20 token = IERC20(_token);
    require(amount > 0, "You need to sell at least some tokens");
    uint256 allowance = token.allowance(msg.sender, address(this));
    require(allowance >= amount, "Check the token allowance");
    // bool success = token.transferFrom(msg.sender, address(this), amount);


  try token.transferFrom(msg.sender, address(this), amount) returns (bool _success) {
    success = _success;
      emit Transfer (
        msg.sender,
        address(this),
        amount,
        success
      );
   } catch Error(string memory /*reason*/) {
    success = false;
      emit Transfer (
        msg.sender,
        address(this),
        amount,
        success
      );
    // special handling depending on error message possible
  } catch (bytes memory /*lowLevelData*/) {
    success = false;
      emit Transfer (
        msg.sender,
        address(this),
        amount,
        success
      );
  }

  // if (success) {
  //   // handle success case
  // } else {
  //    // handle failure case without reverting
  // }



    // if (!success) {
    //   emit Transfer (
    //     msg.sender,
    //     address(this),
    //     allowance,
    //     amount,
    //     success
    //   );

    // } else {

    //   msg.sender.transfer(amount);
    //   emit Transfer (
    //     msg.sender,
    //     address(this),
    //     allowance,
    //     amount,
    //     success
    //   );
    // }

    // IERC20(token).allowance(msg.sender, address(this));
    // IERC20(token).increaseAllowance(address(this), amountIn);
    // IERC20(token).transferFrom(msg.sender, address(this), amountIn);
  }
  function interactWithToken(address tokenAddress, uint256 amount) external payable {
    IERC20 token = IERC20(tokenAddress);
    bool success;
    
    require(amount > 0, "You need to sell at least some tokens");
    // uint256 allowance = token.allowance(msg.sender, address(this));
    // require(allowance >= amount, "Check the token allowance");

    try token.transferFrom(msg.sender, address(this), amount) returns (bool _success) {
      success = _success;
    } catch Error(string memory /*reason*/) {
      success = false;
      // special handling depending on error message possible
    } catch (bytes memory /*lowLevelData*/) {
      success = false;
    }

    if (success) {
       emit Transfer (
        msg.sender,
        address(this),
        amount,
        success
      );
     // handle success case
    } else {
      // handle failure case without reverting
       emit Transfer (
        msg.sender,
        address(this),
        amount,
        success
      );
   }
  }
  function swapTokens (
    address _factory, 
    address _router, 
    uint amountIn, 
    uint amountOutMin, 
    address[] calldata path, 
    address to, 
    uint deadline
  ) public {
    IUniswapV2Factory factory = IUniswapV2Factory(_factory);
    IUniswapV2Router02 router = IUniswapV2Router02(_router);

    require(path[0] != path[1], 'Can not swap a token for itself...');

    IERC20(path[0]).approve(address(router), amountIn);
    if (path[0] == address(0)) {
      router.swapExactETHForTokensSupportingFeeOnTransferTokens(
          amountOutMin,
          path,
          to,
          deadline
      );

    }
    if (path[1] == address(0)) {
      router.swapExactTokensForETHSupportingFeeOnTransferTokens(
          amountIn,
          amountOutMin,
          path,
          to,
          deadline
      );

    }
    else {
      router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
          amountIn,
          amountOutMin,
          path,
          to,
          deadline
      );
    }


  }
  function getAmountsOut (address _router, uint amountIn, address[] memory path) public view returns (uint[] memory amounts) {
    IUniswapV2Router02 router = IUniswapV2Router02(_router);
    return router.getAmountsOut(amountIn, path);
  }

}

