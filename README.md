# Hedera Tokens Tutorial CYOA

Choose-your-own-Adventure: Mint and Transfer tokens the EVM way and the Hedera-native way.

<a href="https://gitpod.io/?autostart=true&editor=code&workspaceClass=g1-standard#https://github.com/hedera-dev/hedera-tokens-cyoa-tutorial" target="_blank" rel="noreferrer">
  <img src="./img/gitpod-open-button.svg" />
</a>

## What you will learn

- Create a fungible token in Javascript using Hedera Token Service (HTS).
- Create an ERC20 token in Solidity using Hedera Smart Contract Service (HSCS).
- Discover how these 2 services can interoperate.

This is a hands-on session - all you need are a browser and a github account.

## Video Walkthrough

[![](https://i.ytimg.com/vi/LcRmhBkRNcs/maxresdefault.jpg)](https://www.youtube.com/watch?v=LcRmhBkRNcs&list=PLjyCRcs63y83i7c9A4UJxP8BYcTgpjqTJ&index=22)

Watch a video demonstration walking through this entire tutorial!

## How to run

1. Click on the "run on Gitpod" button above.
1. Wait for Gitpod to load, this should take less than 10 seconds
1. In the VS code terminal, you should see 3 terminals, `get_deps`, `rpcrelay_run`, and `main`
1. You do not need to use the `get_deps` and `rpcrelay_run` terminals, let them run in the background
1. In the `main` terminal, which is the one that displays by default, a script will interactively prompt you
1. Congratulations, you can now move on to the sequences! 🎉

## Sequences

This repo contains the code required for several different ways to create and transfer tokens on Hedera.

### Setup script

What you will accomplish:

1. Answer interactive prompts in a terminal to construct a `.env` file
1. Generate accounts using a BIP-39 seed phrase (optional)
1. Fund one of those accounts using the Hedera Testnet Faucet (optional)

Steps:

1. “Enter a BIP-39 seed phrase”
   - Leave blank to accept the default, which is to generate a new seed phrase.
   - Read more about [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
     and [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki).
1. “Enter a number of accounts to generate from your BIP-39 seed phrase”
   - Leave blank to accept the default, which is to generate several accounts.
1. “Enter your preferred JSON-RPC endpoint URL”
   - Leave blank to accept the default,
   - This value defaults to something that matches the patterns`https://7546-*.gitpod.io/`
1. “Enter your operator account private key”
   - Leave blank to accept the default, is to use the first account generated from the seed phrase from earlier.
   - Note that this needs to be an ECDSA secp256k1 private key, and it should be in hexadecimal encoded format
1. “Please ensure that you have funded ${EVM_ADDRESS}”
   - The value of `${EVM_ADDRESS}` will be `0x` followed by hexadecimal characters - copy this value to your clipboard.
   - If you are using this EVM address for the first time, you will need to fund it. Otherwise just hit `[return]` right away, and move to the next step.
   - In a new browser window/ tab, visit [`faucet.hedera.com`](https://faucet.hedera.com).
   - Paste the address into the text input field, press the “receive” button, pass the captcha challenge, press the “confirm” button, and wait for the transaction to complete.
   - Switch back to the browser window/ tab with Gitpod running in it.
   - Hit the `[return]` key
1. “Do you wish to overwrite the .env file with the above?”
   - Type “y”, and hit the `[return]`  key
1. Open the `.env` file, and check that it has been updated.

### Task (1) - HTS FungibleCommon token

What you will accomplish:

In this task, you will deploy a new fungible token on Hedera Token Service, and transfer it from one account to another.
You will be using the Hedera SDK, and use Javascript.
No Solidity or smart contracts necessary!

Steps:

1. `cd token-hts`
1. `./script` [tab] [return]
1. Initial output
1. Configuring new HTS token
1. Transaction for new HTS token
1. Configuring token association
1. Submitting token association transaction
1. Configuring token transfer
1. Submitting token transfer transaction
1. Summary metrics

### Task (2) - HSCS ERC20 token

What you will accomplish:

In this task, you will deploy a new fungible token on Hedera Token Service, and transfer it from one account to another.
You will be using the Hedera SDK, and use Javascript.
No Solidity or smart contracts necessary!

Steps:

1. `cd token-hscs`
1. `npm run compile-smart-contract`
1. `./script` [tab] [return]
1. Initial output
1. Checking Solidity smart contract source code
1. Loading EVM bytecode + ABI (solc outputs)
1. Checking JSON-RPC endpoint liveness
1. Submit EVM transaction over RPC to deploy bytecode
1. Submit EVM transaction over RPC to transfer token balance
1. Submit EVM request over RPC to query token balance
1. Summary metrics

### Task (3) - Interoperability between HSCS and HTS

What you will accomplish:

In this task, you will use the fungible token that you have previously deployed to Hedera Token Service, and interact with it via Hedera Smart Contract Service.
You will be using viem and JSON-RPC to interact with the token, with interoperability provided through the HTS system contract.

Steps:

1. `cd token-interop`
1. `./script` [tab] [return]
1. Reminder: Complete both the "tokenHts" and "tokenHscs" tasks before running this script
1. Initial output
1. Obtain EVM address of existing HTS fungible token
1. Loading ABI (solc outputs)
1. Checking JSON-RPC endpoint liveness
1. Submit EVM transaction over RPC to transfer HTS token balance (HSCS interoperability)
1. Submit EVM request over RPC to query token balance
1. Summary metrics

## Maintaining this repo

1. In the root dir of the existing demo repo, run `npm run update-from-base-template`
   - This copies several files from the base template into your existing demo repo
   - See the implementation in `util/09-npx-bin.js` in the base template repo
     for the exact list of files that are copied
1. Be sure to review all `diff`s prior to committing
1. `git commit`
   - The output of `npm run update-from-base-template` will include a suggested commit message
1. `git push` to your new git remote (your new repo)
1. Follow the steps in the tutorial above, and verify that the tutorial is functional in Gitpod.
1. If there are are issues encountered on Gitpod that do not occur on your computer
   - Investigate to find the underlying cause, and fix it
   - Then reiterate to test if this has been resolved

## Author

[Brendan Graetz](https://blog.bguiz.com/)

## Licence

MIT
