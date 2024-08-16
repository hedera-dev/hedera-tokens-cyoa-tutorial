# Hedera Tokens Tutorial CYOA

Choose-your-own-Adventure: Mint and Transfer tokens the EVM way and the Hedera-native way.

<a href="https://gitpod.io/?autostart=true&editor=code&workspaceClass=g1-standard#https://github.com/hedera-dev/hedera-tokens-cyoa-tutorial" target="_blank" rel="noreferrer">
  <img src="./img/gitpod-open-button.svg" />
</a>

Create a fungible token using Hedera Token Service.
Create an ERC20 token using Hedera Smart Contract Service.
Discover how these 2 services can interoperate.
This is a hands-on session - all you need are a browser and a github account.

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
1. “Enter your operator account (ECDSA) private key”
   - Leave blank to accept the default, is to use the first account generated from the seed phrase from earlier.
1. “Please ensure that you have funded ${EVM_ADDRESS}”
   - The value of `${EVM_ADDRESS}` will be `0x` followed by hexadecimal characters - copy this value to your clipboard.
   - If you are using this EVM address for the first time, you will need to fund it. Otherwise just hit `[return]` right away, and move to the next step.
   - In a new browser window/ tab, visit [faucet.hedera.com](https://faucet.hedera.com).
   - Paste the address into the text input field, press the “receive” button, pass the captcha challenge, press the “confirm” button, and wait for the transaction to complete.
   - Switch back to the browser window/ tab with Gitpod running in it.
   - Hit the `[return]` key
1. “Do you wish to overwrite the .env file with the above?”
   - Type “y”, and hit the `[return]`  key

### Task (1) - HTS FungibleCommon token

What you will accomplish:

In this task, you will deploy a new fungible token on Hedera Token Service, and transfer it from one account to another.
You will be using the Hedera SDK, and use Javascript.
No Solidity or smart contracts necessary!

Steps:

1. cd tokenHts
1. ./script [tab] [return]
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

1. cd tokenHscs
1. ./script [tab] [return]
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

1. cd tokenInterop
1. ./script [tab] [return]
1. Reminder: Complete both the "tokenHts" and "tokenHscs" tasks before running this script
1. Initial output
1. Obtain EVM address of existing HTS fungible token
1. Loading ABI (solc outputs)
1. Checking JSON-RPC endpoint liveness
1. Submit EVM transaction over RPC to transfer HTS token balance (HSCS interoperability)
1. Submit EVM request over RPC to query token balance
1. Summary metrics

## How to use this repo

### As a tutorial reader

1. Open the tutorial repo in Gitpod
   - Option A: Click the large **Open in Gitpod** button at the top of the README of the tutorial repo
   - Option B: Enter `https://gitpod.io/?autostart=false#` followed by the Github URL of the tutorial
     - e.g. if the tutorial repo is `https://github.com/my-username/my-new-tutorial`,
       the URL to navigate to would be `https://gitpod.io/?autostart=false#https://github.com/my-username/my-new-tutorial`
1. Wait for the Gitpod spinner
1. In the VS code terminal, you should see 3 terminals, `rpcrelay_pull`, `rpcrelay_run`, and `main`
1. You do not need to use the `rpcrelay_pull` and `rpcrelay_run` terminals, let them run in the background
1. In the `main` terminal, which is the one that displays by default, a script will interactively prompt you
1. Follow the instructions in the script and copy-paste values or accept its default suggestions
   - Note that the written tutorial should have specific instructions for this
1. After the script has completed, open the `.env` file to inspect its contents
1. If the tutorial involves the use of JSON-RPC, run `./init/05-rpcrelay-smoketest.sh` and check that
   it does output the latest block from Hedera Testnet
1. Congratulations, you can now move on to the tutorial proper! 🎉

### As a tutorial author (initialise)

1. `git clone` this repo
1. Create a new git remote - e.g. new repo on Github
1. `git rm remote` of the existing git remote (this repo)
1. `git add remote` of the new git remote (your new repo)
1. `npm install`
1. Update the title and description in `README.md`
1. Update the URL in `href` for the `<a />` tag surrounding the **Open in Gitpod**
   SVG button at the top of `README.md`
1. If you have modified the prompt scripts
   - Add instructions specific to how to answer the `main` script prompts to
   the `README.md` or wherever the tutorial text is published
   - State how to answer based on the **portal flow** vs the **faucet flow**, at minimum
   - Additionally, state any specific instructions pertaining to the tutorial
1. Run `./init/06-metrics-topic.js foobarbaz`,
   to generate a new HCS topic where metrics will be logged for this tutorial repo,
   replacing `foobarbaz` with the intended memo for your topic
1. `git commit` and `git push` to your new git remote (your new repo)
1. Verify that there are no start up errors in Gitpod.
1. If there are are issue encountered on Gitpod that do not occur on your computer
   - Investigate to find the underlying cause, adn fix it
   - Then reiterate to test if this has been resolved

### As a tutorial author (main content)

Note: **Do not** modify any of the `*.sample` files in the root directory.
Likewise also do not modify any files inside the `util` directory.

1. Add new files necessary for your tutorial
   - Optionally you may wish to skip boilerplate steps and scaffold instead
   - To do so run `npm run scaffold-task-from-base-template foobar`,
     replacing `foobar` with the intended name of a task in your tutorial
1. `git commit` and `git push` to your new git remote (your new repo)
1. Follow the steps in "as a tutorial reader" above, and verify that the tutorial is functional in Gitpod.
1. If there are are issues encountered on Gitpod that do not occur on your computer
   - Investigate to find the underlying cause, adn fix it
   - Then reiterate to test if this has been resolved

### As a tutorial maintainer

1. In the root dir of the existing demo repo, run `npm run update-from-base-template`
   - This copies several files from the base template into your existing demo repo
   - See the implementation in `util/09-npx-bin.js` for the exact list of files that are copied
1. Be sure to review all `diff`'s prior to committing
1. `git commit` and `git push` to your new git remote (your new repo)
1. Follow the steps in "as a tutorial reader" above, and verify that the tutorial is functional in Gitpod.
1. If there are are issues encountered on Gitpod that do not occur on your computer
   - Investigate to find the underlying cause, adn fix it
   - Then reiterate to test if this has been resolved

## TODOs

In this repo

- [ ] change dir names from camelCase to snake-case
- [ ] change address used in the RPC liveness check to use the operator account
- [ ] when printing partial file, add `(truncated)` after `...`

Upstream, in base template

- [ ] output the file and line number for each section in the terminal output
- [ ] add another type of section heading for reminder

In accompanying written tutorial

- [ ] copy the section headings within written tutorial
- [ ] use emojis to indicate actions within the written tutorial
- [ ] add explanation for  numbers in the ABI summary (count)

## Author

[Brendan Graetz](https://blog.bguiz.com/)

## Licence

MIT
