pragma solidity ^0.7.0;

interface IUniswap {

    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
    
    }

interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    // function transferFrom(address from, address to, uint value) external returns (bool);
    function transferFrom(
      address sender, 
      address recipient, 
      uint256 amount) 
      external 
      returns (bool);
}

contract UniPony {
  IUniswap uniswap;

  constructor(address _uniswap) {
    uniswap = IUniswap(_uniswap);
  }

  function swapTokensForEth(address token, uint amountIn, uint amountOutMin, uint deadline) external {
    IERC20(token).transferFrom(msg.sender, address(this), amountIn);
    address[] memory path = new address[](2);
    path[0] = token;
    path[1] = uniswap.WETH();
    IERC20(token).approve(address(uniswap), amountIn);
    uniswap.swapExactTokensForETH(
      amountIn, 
      amountOutMin, 
      path, 
      msg.sender, 
      deadline
    );
  }
  function quote(uint amountA, uint reserveA, uint reserveB) external view returns (uint amountB) {
    uint amountB = uniswap.quote(amountA, reserveA, reserveB);
  }
  function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external view returns (uint amountOut) {
    uint amountOut =  uniswap.getAmountOut( amountIn,  reserveIn,  reserveOut);
  }
  function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external view returns (uint amountIn) {
    uint amountIn =  uniswap.getAmountIn(amountOut, reserveIn, reserveOut);
  }
  function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts) {
    uint[] memory amounts =  uniswap.getAmountsOut(amountIn, path);
  }
  function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts) {
    uint[] memory amounts = uniswap.getAmountsIn(amountOut, path);
  }

}
