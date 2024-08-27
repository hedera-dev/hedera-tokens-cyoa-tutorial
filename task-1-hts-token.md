### Task (1) - HTS FungibleCommon Token

In this task, you will deploy a new fungible token on Hedera Token Service, and transfer it from one account to another.
You will be using the Hedera SDK, and use Javascript.
No Solidity or smart contracts necessary\!

👉 Let’s switch to the Gitpod instance, that we have previously set up.

👉 Let’s begin this task by opening the file `**token-hts/script-token-hts.js**`.
This is the script that we’re going to run.
👀 Note the **import** statements at the top, where we’re making use of the **Hedera SDK** library.

👉 Go to the terminal, and enter the following commands:
- `cd token-hts`
- type `./script` then press \[tab\] for autocomplete, followed by \[return\]

```
🏁 Welcome to the tokenHts task\!  …
```

This starts running the script.
👀 You will see some initial output that indicates the script has started running,
and confirmation that it has parsed some information from the `.env` file.

Next you’ll see a line in **purple**, with a line underneath it saying:
👉 Hit the \[return\] key when ready to proceed
These pause the execution of the script to make it easy to follow along with what is being run.
Specifically, so that you can match up which lines of code are about to be executed next.
For example, the logger lines which correspond to the output in the terminal.

```
🟣 Configuring new HTS token  …
```

Next up we’ll be configuring the new HTS token.
👀 For this, we’ll use **`TokenCreateTransaction`** from the Hedera SDK.
Each of the chained methods under it set specific properties of the token about to be created.
👀 The **`setTokenType`** method is the most consequential, as it determines whether you get a fungible token, similar to ERC20, or a non-fungible token, similar to ERC721.
👀 The **`setTokenName`** and **`setTokenSymbol`** methods set the name and symbol properties. These are display properties of the token: What you will see in a wallet’s user interface or a block explorer’s user interface.
👀 The **`setInitialSupply`** method is used to set the amount of tokens that will be minted, and the **`setDecimals`** method is used to set how precisely dividable the token should be. Here, with 1 million for initial supply and 2 for decimals, we’re expecting 10 thousand units. Think of it as similar to 1 million cents being the same as 10 thousand dollars.
👀 The **`setTreasuryAccountId`** method sets the account which will receive the initial supply of the tokens upon mint. In this case the main operator account.
👀 The **`setAdminKey`** method sets the account which will be able to modify the properties/ configuration of the token after the mint. In this case we’re using the private key of a different account.

👀 What all this does is to create a transaction, and we extract a **transaction ID** from this, and print that.
For EVM developers, this is equivalent to a transaction hash.

👉 Hit \[return\] to run this section.

You see that happen instantly because nothing has happened on the network.
This transaction only exists locally.

```
🟣 Transaction for new HTS token  …
```

Now we have our local transaction, it is ready to be submitted to the network.
To do so, we’ll need to first sign it using the private keys of the accounts involved, then submit it to the network, then await a transaction receipt.

👉 Hit \[return\] to run this section.

In this case, both the operator account and the admin account need to sign this transaction, thanks to both of them being involved in the **`TokenCreateTransaction`** configuration.
Therefore, we have a multisig going on here.

👀 To do so, we’ll use the **`signTransaction`** method with each of the private keys.
👀 Then use the **`addSignature`** method twice on the `TokenCreateTransaction`, and obtain a signed transaction.
👀 Subsequently, we use the **`execute`** method on the signed transaction to get a submitted transaction. This means that the Hedera Testnet has received the signed transaction and the network nodes are validating it, running it through the Hashgraph consensus algorithm, and finally adding it to the blockchain.
👀 Finally, we use the **`getReceipt`** method on the submitted transaction to obtain the transaction receipt.
This transaction receipt will contain the status of the transaction - we’re expecting a “success” status here - as well as the ID of any entities created, in this case, the token ID.
👀 We extract this **token ID** from the receipt, and print a Hashscan URL.
Hashscan being the network explorer.
👉 Use \[command\]+\[click\] or \[control\]+\[click\] to open the token URL in a browser tab.

👀 In the new browser tab, we can see the [`hashscan.io/testnet/token/`](http://hashscan.io/testnet/token/) followed by the token ID.
This page shows us all the properties of the token that we have just created using the `TokenCreateTransaction` via the Hedera SDK in our script thus far.
👀 We see **`tokenHts coin`** as the token name, and **`TOKENHTS`** as the token symbol.
👀 The **treasury account** is our operator account.
👀 The entire minted balance of 10 thousand tokens has been sent to the operator account.

👉 Switching back to Gitpod, in the terminal

👀 We see that the script has also written an **`artefacts.json`** file to disk.
This is not necessary in this task, and is intended to be used in the interoperability task instead.
So we’ll come back to this later.

```
🟣 Configuring token association  …
```

In the next section, we’ll configure token association.
In EVM, when you have an ERC20 token, for example, you can transfer it to any account that you wish to - whether the recipient is aware of it or not.
With HTS tokens, however, this is not the case: A recipient account essentially needs to whitelist which tokens they wish to transact with, and this concept is called “token association”.
👀 We’ll use **`TokenAssociateTransaction`** for this.
This transaction is far simpler than the previous one, and we only need to configure 2 properties.
👀 Use the **`setAccountId`** method to set the recipient account.
👀 Use the **`setTokenIds`** method to set the token ID of the token that we have just created.

👉 Hit \[return\] to run this section.

We print the transaction ID to the terminal.

```
🟣 Submitting token association transaction  …
```

As before, we now have our local transaction ready to submit to the network.

👉 Hit \[return\] to run this section.

Again, we’ll begin by signing it using the private keys of the accounts involved, then submitting it to the network, then awaiting a transaction receipt.
👀 This time, we only need one signature, for the recipient account, and thus call the **`sign`** method on the `TokenAssociateTransaction`.
👀 The subsequent **`execute`** and **`getReceipt`** methods follow the same pattern as before.
We extract the transaction status and print it out.
We also print the Hashscan URL of the transaction.
👉 Use \[command\]+\[click\] or \[control\]+\[click\] to open the URL in a browser tab.

👀 In the new browser tab, we can see the [`hashscan.io/testnet/transaction/`](http://hashscan.io/testnet/token/) followed by the transaction ID.
👀 This page shows us all the properties of the **`TokenAssociateTransaction`** via the Hedera SDK in our script thus far.
👀 We see the type as **`TOKEN ASSOCIATE`**, and a status of **`SUCCESS`**.

👉 Let’s switch back to Gitpod

```
🟣 Configuring token transfer  …
```

Our next task is to configure a token transfer.
To do so, we’ll use **`TransferTransaction`** from the Hedera SDK.

If you have done an HBAR transfer before, you’ll notice that it is the same transaction type for both tokens and cryptocurrency.
👀 Instead of calling the `addHbarTransfer`, we’ll use the **`addTokenTransfer`** method instead.
👀 For each, we need to specify the **token ID**, the **account ID** or **address**, and an **amount**.
We use negative numbers for debited amounts, and positive numbers for credited amounts.
As long as the debits and credits add up to the same total, and they tally for the same token, the transaction is valid.
👀 In this case the operator account is the **sender**, and the other account is the **recipient**.
👀 The sent amount is **100**, and the received amount of the same token is **100**, and that tallies, so all good\!

👉 Hit \[return\] to run this section.

👀 This creates the transaction locally, and we print out the **transaction ID**.

```
🟣 Submitting token transfer transaction  …
```

As before, we now have our local transaction ready to submit to the network.
Again, we’ll begin by signing it using the private keys of the accounts involved, then submitting it to the network, then awaiting a transaction receipt.

👉 Hit \[return\] to run this section.

👀 We call the **`sign`**, the **`execute`** and the **`getReceipt`** methods, following the same pattern as before.
👀 We extract the **transaction status** and print it out.
We also print the Hashscan URL of the transaction.
👉 Use \[command\]+\[click\] or \[control\]+\[click\] to open the URL in a browser tab.

👀 In the new browser tab, we can see the [`hashscan.io/testnet/transaction/`](http://hashscan.io/testnet/token/) followed by the transaction ID.
This page shows us all the properties of the `TransferTransaction` via the Hedera SDK in our script thus far.
👀 We see the type as **`CRYPTO TRANSFER`**, and a status of **`SUCCESS`**.
👀 Under the transfers section at the bottom, you’ll see “**Hbar Transfers**” which show the transaction fees being paid to the Hedera Testnet network nodes.
👀 You’ll also see “**Token Transfers**”, which shows that `1.00` of `TOKENHTS` -  100 units with 2 decimal places - has been sent from the operator account to the other account.

👉 Let’s switch back to Gitpod

```
🎉 tokenHts task complete!  …
```
We see that our token HTS task is complete!

Congratulations on making it this far!
