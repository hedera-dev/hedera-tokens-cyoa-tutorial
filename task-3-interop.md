### Task (3) - Interoperability between HSCS and HTS

In this task, you will use the fungible token that you have previously deployed to Hedera Token Service, and interact with it via Hedera Smart Contract Service.
You will be using viem and JSON-RPC to interact with the token, with interoperability provided through the HTS system contract on HSCS.

👉 Let’s switch to the Gitpod instance, that we have previously set up.

👀 Open **`tokenInterop/script-tokenInterop.js`**
👀 Note the **import** statements at the top, where we’re making use of the **viem** library.
This is a standard EVM library, and can be used to interact with any EVM network such as Ethereum, and with HSCS on Hedera.
We will not be using the Hedera SDK in this script.

👉 Go to the terminal, and enter the following commands:
- `cd tokenInterop`
- type `./script` then press \[tab\] for autocomplete, followed by \[return\]

```
🏁 Welcome to the tokenInterop task!  …
```

This starts running the script, and you will see some initial output that indicates the script has started running, and confirmation that it has parsed some information from the `.env` file.

👀 Next you’ll see a line in purple, with a line underneath it saying:
👉 Hit the \[return\] key when ready to proceed
These pause the execution of the script to make it easy to follow along with what is being executed.

```
🟣 Reminder: Complete both the "token-hts" and "token-hscs" tasks before running this script  …
```

Next we’ll see a reminder.
👀 This is to complete both the **`token-hts`** and **`token-hscs`** tasks before running this script.
It is possible to proceed without doing so too, but you’ll need to specify an existing HTS token’s EVM address, and an ERC20 ABI file.
You can create those manually if you want to.
Of course, it is easier if you complete the `token-hts` and `token-hscs` tasks first, which do this for you.

Take note that in this script we will be interacting with an HTS token, but we will do so via HSCS. Therefore we’ll be using the viem library to construct EVM transactions and queries, instead of using the Hedera SDK.

👉 Hit \[return\] to run this section.

```
🟣 Obtain EVM address of existing HTS fungible token  …
```

We’re ready to begin now.
First up, we’ll obtain the EVM address corresponding to the HTS token.

👉 Hit \[return\] to run this section.

👀 Here we read in an `artefacts.json` file.
This would have been created by the `token-hts` script.
From this, we extract the EVM address of the HTS token.
We use this to print the Hashscan URL of the HTS token.
👉 Use \[command\]+\[click\] or \[control\]+\[click\] to open the token URL in a browser tab.

👀 In the new browser tab, we can see the [`hashscan.io/testnet/token/`](http://hashscan.io/testnet/token/) followed by the EVM address of the token.
👀 We see that its type is “**Fungible Token**”, and all the properties of the token from when it was originally created using `TokenCreateTransaction`.

👉 Let’s switch back to Gitpod, and continue running the script in the main terminal.

```
🟣 Loading ABI (solc outputs)  …
```

Secondly, we read an ERC20 ABI file.

👉 Hit \[return\] to run this section.

This would have been created by compiling the `.sol` file in the `token-hscs` directory.
We parse this from JSON to an object.

👀 You should see output like this:.

```
constructor (1): (unnamed)
event (2): Approval, Transfer
function (13): allowance, approve, balanceOf, balances, burn, decimals, getChainId, mint, name, symbol, totalSupply, transfer, transferFrom
```

The numbers indicate the count of each category.
For example, that there are 2 events present in the ABI.

```
🟣 Checking JSON-RPC endpoint liveness  …
```

Next we’ll perform a quick check for JSON-RPC endpoint liveness.
In other words, is the Hedera JSON-RPC Relay working?

👀 The code here makes 2 RPC requests that get the latest **block number** on the network, and the **balance** of our operator account.

👉 Hit \[return\] to run this section.

It prints those values after receiving responses.
👀 Just FYI, you can check on the **RPC relay terminal** and see its log output in case anything goes awry here.
👀 Back in the **main terminal**, we see that we’ve received the responses and these values for block number and balance have been printed.
We’re now satisfied that the RPC endpoint is indeed live.

Now we have the HTS token’s EVM address on Hedera Testnet, and an ERC20 ABI.
It’s time to interact with it via HSCS.

>
>

> Note that the reason this interoperability between HTS and HSCS is even possible,
> is because there is a system contract (sometimes also known as “precompiled contract”) for HTS available on HSCS.
> This allows HTS functionality to be invoked via HSCS.
> See [HIP-206](https://hips.hedera.com/hip/hip-206),
> titled “Hedera Token Service Precompiled Contract for Hedera Smart Contract Service” for more details on this.
>
> However the exposed interface of the HTS system contract corresponds to the interface of HTS itself.
> Notably, this is different from, and therefore incompatible with,
> the interface for fungible tokens specified in ERC20.
>
> Thankfully HSCS also provides a “facade redirect” facility,
> which performs the necessary translations/ proxies from an ERC20 smart contract function invocation
> to the equivalent HTS system contract function invocation.
> This allows us to interact with the HTS token’s EVM address directly using the ERC20 ABI,
> as if there were an actual ERC20 smart contract deployed to that address.
> See [HIP-218](https://hips.hedera.com/hip/hip-218),
> titled “Smart Contract Interactions with Hedera Token Accounts” for more details about this.

```
🟣 Submit EVM transaction over RPC to transfer HTS token balance (HSCS interoperability)  …
```

Now that we know why this works, let’s perform a transfer transaction, and see it in action!
We’ll transfer some tokens from our operator account to another account.
We do so by submitting an EVM transaction over RPC.

👉 Hit \[return\] to run this section.

👀 We use the **`writeContract`** method on the client, and pass in the **EVM address** of the HTS token, the ERC20 **ABI**, the **function name**, and the **function arguments**.
👀 The function name is **`transfer`**.
👀 The function arguments are the EVM address of the **recipient account**, and the **amount** of tokens to transfer.
👀 This returns the transaction hash, and we use that to print the Hashscan URL for this smart contract function invocation transaction.
In other words, the transfer transaction.
Once again, note that there is no smart contract deployed at this address, the only thing that exists there is the HTS token.
The only reason that this transaction is able to work is because of the HTS system contract in HSCS, as per HIP-206, and the “facade redirect” facility, as per [HIP-218](https://hips.hedera.com/hip/hip-218), described earlier.
👉 Use \[command\]+\[click\] or \[control\]+\[click\] to open the transfer transaction URL in a browser tab.

👀 In the new browser tab, we can see the [`hashscan.io/testnet/transaction/`](http://hashscan.io/testnet/token/) followed by the transaction hash.
👀 We see that the “Type” is **`ETHEREUM TRANSACTION`**.

> Note that this is because all transactions within the EVM in HSCS need to be translated/ proxied into Hedera-native transactions.
> This is accomplished via the Hedera JSON-RPC Relay.
> See [HIP-482](https://hips.hedera.com/hip/hip-482) for more about the architecture of the JSON-RPC relay system

👀 We also see that status as **`SUCCESS`**, which means that the smart contract function invocation was successful, and the intended state change has indeed occurred.

👀 In the “**Contract Result**” section, we see all of the fields of an EVM transaction… Highlighting a few of them:
👀 The “**From**” address is the operator account, the “**To**” address is the EVM address of the HTS token.
👀 The “**Signature**” identifies which function on the smart contract is being invoked.
👀 The “**Input**” lists the parameters passed into this smart contract function - in this case the recipient account, and the amount of tokens.
👀 Note that the the “**To**” field on the transaction is **not** the same as the recipient field in the function arguments, these are sometimes mixed up.
👀 The “**Output**” lists the return values from this smart contract function - in this case true, as the transfer was successful.

👀 In the “**Events**” section we see an event log.
👀 The first field is the **signature hash**, which identifies the event - in this case **`Transfer`**.
👀 The remaining fields are the parameters of the events - in this case the **`from`** address, the **`to`** address, and the **`value`** number.
The event logs are searchable on fields that have topics on them (and not on fields that do not) - in this case by event type, `from`, and `to`, but not by `value`.

👀 If you have completed the `token-hscs` task prior to this, you will notice something different in the “**Call Trace**” section.
This difference is small, and perhaps easy to miss, but very much significant.
👀 We can see that underneath the main **`CALL`**, there is a **`DELEGATECALL`**.
This is where we see HIP-206 and HIP-218 in action.
👀 Look at the “**From**” and “**To**” EVM addresses in each line.
👀 First, the `CALL` is from our **operator account** to the **HTS token** address.
But there is no smart contract at this address, and so the “facade redirect” of HIP-218 kicks in.
👀 This is what triggers the **`DELEGATECALL`**, which is from the **HTS token** address to the **HTS system contract** (`0x0167`).
This is where the execution goes from HSCS to HTS, as per HIP-206, and the equivalent of `TransferTransaction` with `addTokenTransfer` from the Hedera SDK gets executed, and therefore HTS tokens move from our operator account to the other account.

👀 One other thing that we may have noticed is in the “**Transfers**” section, there were only some values for “**Hbar Transfers**”, which show the payment of transaction fees.
However, there were no values for “Token Transfers”, as we may have expected, since this transaction resulted in HTS tokens being transferred.
This happens because, as seen from the `CALL` and `DELEGATECALL` in the “Call Trace” section, there was a child transaction.
👀 This transaction, the parent transaction, has a type of **`ETHEREUM TRANSACTION`**, and it has one child transaction of type **`CRYPTO TRANSFER`**.
👀 Next to “**Child Transactions**”, we see `#1 CRYPTO TRANSFER` (with `TOKENHTS` next to it).
👉 Let’s click on it to navigate to the child transaction.
👀 On this page, we see that the “Type” is **`CRYPTO TRANSFER`**.
👀 We also see, in the “**Transfers**” section, the values for “**Token Transfer**”, which shows **`1.00`** - 100 units with 2 decimal places - of **`TOKENHTS`** being sent from the **operator account** to the **other account**.

👉 Next, let’s switch back to Gitpod, enter the main terminal again.

```
🟣 Submit EVM request over RPC to query token balance  …
```

👀 We’ll use the **`readContract`** method on the client, and pass in the **address**, the **ABI**, the **function name**, and the **function arguments**.
👀 The function name is **`balanceOf`**.
👀 The function argument is the **EVM address** of the accounts that just received the tokens during the previous `transfer` smart contract function invocation transaction.

👉 Hit \[return\] to run this section.

👀 This returns a **query result object**, which in this case is a single number, the token balance of the account.
👀 If this is your second time performing a transfer of this HTS token, the value should be `**200n**`.
Note that the `n` suffix is Javascript notation of [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) which is used to represent the [`uint256`](https://docs.soliditylang.org/en/latest/types.html#integers) type from Solidity, because the regular `Number` in Javascript cannot represent numbers that large.

```
🎉 tokenInterop task complete!  …
```

We see that our token HTS-HSCS interoperability task is complete!

Congratulations on making it this far!
