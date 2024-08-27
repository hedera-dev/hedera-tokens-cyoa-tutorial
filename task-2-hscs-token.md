### Task (2) - HSCS ERC20 Token

In this task, you will deploy a new fungible token on Hedera Smart Contract Service, and transfer it from one account to another.
You will be using viem, solc, JSON-RPC, and Solidity to create, compile, deploy, verify, and interact with the token.

👉 Let’s switch to the Gitpod instance, that we have previously set up.

👀 Let’s begin this task by opening the file **`token-hscs/script-token-hscs.js`**.
This is the script that we’re going to run.

👀 Note the **import** statements at the top, where we’re making use of the **viem** library.
This is a standard EVM library, called viem, and can be used to interact with any EVM network such as Ethereum, and with HSCS on Hedera.
We will *not* be using the Hedera SDK in this script.

👉 Go to the terminal, and enter the following commands:
- `cd token-hscs`
- type `./script` then press \[tab\] for autocomplete, followed by \[return\]

```
🏁 Welcome to the tokenHscs task!  …
```

This starts running the script.
👀 You will see some initial output that indicates the script has started running, and confirmation that it has parsed some information from the `.env` file.

👀 Next you’ll see a line in purple, with a line underneath it saying:
👉 Hit the \[return\] key when ready to proceed
These pause the execution of the script to make it easy to follow along with what is being run.
Specifically, so that you can match up which lines of code are about to be executed next.

Note that instead of initialising a `client` object via the Hedera SDK,
👀 We’ll be initialising the `client` object in this script using the **`createWalletClient`** method from viem.
To do so, we pass in the operator account credentials, a config for the Hedera Testnet, which will include things like chain ID, and a transport configuration which essentially points to the Hedera JSON-RPC Relay instance that is hopefully running in the background.

```
🟣 Checking Solidity smart contract source code  …
```

In the next section, we’ll be checking Solidity smart contract source code.
👉 Let’s open the file named **`my_token.sol`**.
This is a very minimal ERC20 implementation.

👉 Hit \[return\] to run this section.

👀 We print out the first few characters of that file as a quick sense check.

```
🟣 Loading EVM bytecode + ABI (solc outputs)  …
```

Next let’s load the EVM bytecode + ABI (solc outputs)
This is going to error because we have not yet compiled the Solidity file, and therefore the `.abi` and the `.bin` files that the script expects are not available on disk.
👀 … and we should see the error.

To rectify this, let’s compile the Solidity file, and then re-run the script.
👉 In the terminal, enter the command: `npm run compile-smart-contract`
👉 Once this is done, enter `./script` then press \[tab\] for autocomplete, followed by \[return\] to run the script again.

👀 This time, since the files are there, we’ll get past that error, and it prints out the first few characters of each of those files.

```
🟣 Checking JSON-RPC endpoint liveness  …
```

Next we’ll perform a quick check for JSON-RPC endpoint liveness.
In other words, is the Hedera JSON-RPC Relay working?
👀 The code here makes 2 RPC requests that get the latest **block number** on the network, and the **balance** of our operator account.

👉 Hit \[return\] to run this section.

👀 It prints those values after receiving responses.
👀 Just FYI, you can check on the RPC relay terminal and see its log output in case anything goes awry here.
👀 Back in the main terminal, we see that we’ve received the responses and these values for block number and balance have been printed.

We’re now satisfied that the RPC endpoint is indeed live.

```
🟣 Submit EVM transaction over RPC to deploy bytecode  …
```

We’ve got the bytecode to deploy in hand, and the RPC connection running, so we’re ready to deploy the smart contract.
To do so, we submit an EVM transaction over RPC.

👉 Hit \[return\] to run this section.

👀 We use the **`deployContract`** method on the client, and pass in the **bytecode**, the **ABI**, and the **constructor arguments**. Which in this case are the token symbol and token name.
👀 This returns the **transaction hash**, and we use that to print the Hashscan URL for the deployment transaction.

👀 Right after, we use the **`getTransactionReceipt`** method, passing in the transaction hash, and from this, obtain the transaction receipt.
This contains the smart contract’s deployed address, and we use that to print its Hashscan URL.
👉 Use \[command\]+\[click\] or \[control\]+\[click\] to open the URL for the deployment address in a browser tab.

👀 In the new browser tab, we can see the [`hashscan.io/testnet/contract/`](http://hashscan.io/testnet/token/) followed by the smart contract ID.
👀 If we look at the “**Contract Bytecode**” section, we’ll see a wall of hexadecimal text, this is the EVM bytecode.
It is good to know that that is there, but that is not particularly useful to us.
👀 For example, if we scroll down, we’ll see a section named “**Events**”, but it is very hard to make sense of anything here.

👉 Let’s switch back to Gitpod.

```
🟣 Verify smart contract via Sourcify  …
```

There is a solution to this, which is to verify the smart contract.
Verification is the idea that you submit the source code of the smart contract to the network explorer, which will then independently verify if that smart contract source code corresponds to the EVM bytecode that has already been deployed to this particular address.
If verification passes, in addition to the EVM bytecode that was previously already there,  the network explorer should now also be able to display the ABI and the Solidity source code.
Hashscan, the network explorer that we’re using, exposes an API to do this programmatically, via its own implementation of Sourcify.
👀 This has been wrapped up into a utility function called **`verifyOnSourcify`** for us, and we can check out what it does under the hood if we like.

👉 After verification is successful, let’s go back to the same Hashscan browser tab for the smart contract that we opened earlier, for the smart contract that we’ve just deployed.
👉 Let’s refresh this page.
👀 If we look in the “**Contract Bytecode**” section now, we’ll see that something has changed.
👀 Note also that “**Verification Status**” is “Full Match”
Now we’ll see that we have those additional tabs for “ABI” and “Source”, and clicking on those:
👀 We can see the **ABI** presented as an interactive form.
👀 We can also see the Solidity source code.

👀 If we look in the “**Events**” section now, we’ll notice that something has changed here too.
Instead of arbitrary hexadecimal values here, we see the names of the events, and the parsed values of the event parameters.
This is possible, because the verification process submits the original Solidity source code (the `.sol` file) plus the compiler settings (the `.metadata.json` file).
This allows Hashscan to have not only the source code, but also the ABI.

Verification makes this smart contract page on Hashscan much more useful and user friendly.

👉 Let’s switch back to Gitpod.

```
🟣 Submit EVM transaction over RPC to transfer token balance  …
```

Now we have our ERC20 token’s smart contract deployed on Hedera Testnet, and verified on Hashscan to boot!
It’s time to interact with it.
Let’s start by transferring some tokens from our operator account to another account.
We do so by submitting an EVM transaction over RPC.

👉 Hit \[return\] to run this section.

👀 We use the **`writeContract`** method on the client, and pass in the **deployed address** of the smart contract, its **ABI**, the **function name**, and the **function arguments**.
Which in this case are the to address, and the amount of tokens to transfer.
👀 This returns the **transaction hash**, and we use that to print the Hashscan URL for this smart contract function invocation transaction.
In other words, the transfer transaction.
👉 Use \[command\]+\[click\] or \[control\]+\[click\] to open the transfer transaction URL in a browser tab.

👀 In the new browser tab, we can see the [`hashscan.io/testnet/transaction/`](http://hashscan.io/testnet/token/) followed by the transaction ID.
👀 We see that the “Type” is **`ETHEREUM TRANSACTION`**.

> Note that this is because all transactions within the EVM in HSCS need to be translated/ proxied into Hedera-native transactions.
> This is accomplished via the Hedera JSON-RPC Relay.
> See [HIP-482](https://hips.hedera.com/hip/hip-482) for more about the architecture of the JSON-RPC relay system

👀 We also see that status as **`SUCCESS`**, which means that the smart contract function invocation was successful, and the intended state change has indeed occurred.

👀 In the “**Contract Result**” section, we see all of the fields of an EVM transaction… Highlighting a few of them:
👀 The “**From**” address is the operator account, the “**To**” address is the smart contract address of the ERC20 token.
👀 The “**Signature**” identifies which function on the smart contract is being invoked.
👀 The “**Input**” lists the parameters passed into this smart contract function - in this case the recipient account, and the amount of tokens.
👀 Note that the the “**To**” field on the transaction is **not** the same as the recipient field in the function arguments, these are sometimes mixed up.
👀 The “**Output**” lists the return values from this smart contract function - in this case true, as the transfer was successful.

👀 In the “**Events**” section we see an event log.
👀 The first field is the signature hash, which identifies the event - in this case **`Transfer`**.
👀 The remaining fields are the parameters of the events - in this case the **`from`** address, the **`to`** address, and the **`value`** number.
The event logs are searchable on fields that have topics on them (and not on fields that do not) - in this case by event type, `from`, and `to`, but not by `value`.

👉 Let’s switch back to Gitpod.

At this point, we have interacted with the network twice, and both times we have changed the state of the network.
The first time was to deploy a new smart contract.
The second time was to invoke a function on that smart contract.
But this is not the only type of interaction possible - we can also interact with the network without changing its state.
In other words, simply querying its state.

```
🟣 Submit EVM request over RPC to query token balance  …
```

Let’s do just that by submitting an EVM request to query the balance of the token.
To do so, we submit an EVM query over RPC.

👉 Hit \[return\] to run this section.

👀 We use the **`readContract`** method on the client, and pass in the **address**, the **ABI**, the **function name**, and the **function arguments**.
The function name is **`balanceOf`**.
👀 The **function argument** is the EVM address of the accounts that just received the tokens during the previous `transfer` smart contract function invocation transaction.
👀 This returns a **query result object**, which in this case is a single number, the token balance of the account.
👀 If this is your first time running this script, the value should be **`100n`**.
Note that the `n` suffix is Javascript notation for [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) which is used to represent the [`uint256`](https://docs.soliditylang.org/en/latest/types.html#integers) type from Solidity, because the regular `Number` in Javascript cannot represent numbers that large.

```
🎉 tokenHscs task complete!  …
```

We see that our token HSCS task is complete!

Congratulations on making it this far!
