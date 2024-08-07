// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.17;

library Math {
    function safeAdd(uint256 x, uint256 y) internal pure returns (uint256) {
        uint256 z = x + y;
        require(z >= x, "math-add-overflow");
        return z;
    }
    function safeSub(uint256 x, uint256 y) internal pure returns (uint256) {
        uint256 z = x - y;
        require(z <= x, "math-sub-underflow");
        return z;
    }
}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract MyToken is IERC20 {
    uint256 public constant decimals = 18;
    string public name;
    string public symbol;
    uint256 public totalSupply;

    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) private allowances;

    function getChainId() public view returns(uint256) {
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        return chainId;
    }

    constructor(string memory _symbol, string memory _name) {
        symbol = _symbol;
        name = _name;
        mint(msg.sender, 1_000_000_000_000_000_000_000_000);
    }

    function transfer(address dst, uint256 wad) external returns (bool) {
        return transferFrom(msg.sender, dst, wad);
    }

    function transferFrom(address src, address dst, uint256 wad) public returns (bool) {
        require(balances[src] >= wad, "insufficient-balance");
        if (src != msg.sender && allowances[src][msg.sender] != type(uint256).max) {
            require(allowances[src][msg.sender] >= wad, "insufficient-allowances");
            allowances[src][msg.sender] = Math.safeSub(allowances[src][msg.sender], wad);
        }
        balances[src] = Math.safeSub(balances[src], wad);
        balances[dst] = Math.safeAdd(balances[dst], wad);
        emit Transfer(src, dst, wad);
        return true;
    }

    function mint(address usr, uint256 wad) public {
        balances[usr] = Math.safeAdd(balances[usr], wad);
        totalSupply = Math.safeAdd(totalSupply, wad);
        emit Transfer(address(0), usr, wad);
    }

    function burn(address usr, uint256 wad) public {
        require(balances[usr] >= wad, "insufficient-balance");
        if (usr != msg.sender && allowances[usr][msg.sender] != type(uint256).max) {
            require(allowances[usr][msg.sender] >= wad, "insufficient-allowances");
            allowances[usr][msg.sender] = Math.safeSub(allowances[usr][msg.sender], wad);
        }
        balances[usr] = Math.safeSub(balances[usr], wad);
        totalSupply    = Math.safeSub(totalSupply, wad);
        emit Transfer(usr, address(0), wad);
    }

    function approve(address usr, uint256 wad) external returns (bool) {
        allowances[msg.sender][usr] = wad;
        emit Approval(msg.sender, usr, wad);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return allowances[owner][spender];
    }

    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }
}
