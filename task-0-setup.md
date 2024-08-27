### Task (0) - Set up

Let’s build something using Hedera\!

Here is the plan:

(1) A **FungibleCommon** token using Hedera Token Service (HTS)
(2) An **ERC20** token using Hedera Smart Contract Service (HSCS)
(3) An **interoperability** demonstration using HSCS to interact with an HTS token

You are encouraged to take a “choose your own adventure” approach to this tutorial. You can do them in any order that you prefer.

Recommended order, if you are unfamiliar with Solidity or web3 technology in general:
The HTS task , followed by the HSCS task. Optionally, also consider the interoperability task to cap off this tutorial.

Recommended order, if you are familiar with Solidity or web3 technology, especially EVM development:
The HSCS task , followed by the HTS task. Here too, optionally, also consider the interoperability task to cap off this tutorial.

Before we begin, you’ll need to set up your development environment

[https://github.com/hedera-dev/hedera-tokens-cyoa-tutorial](https://github.com/hedera-dev/hedera-tokens-cyoa-tutorial)

👉 Click on the “open in Gitpod” button

If this is your first time using Gitpod instructions, you will be prompted to:

- Sign in to Gitpod with Github
- Authorise the Gitpod app on your Github account

Subsequently, you will not be prompted to do so again.

⏳ Wait for the Gitpod container to load - this takes up to 10 seconds.

👀 You will see the user interface of the VS code IDE inside of your browser window/ tab itself.
This includes the **file navigation pane** on the left, the **code editor pane** at the top, and the **terminal** at the bottom.

👉 Adjust zoom

The repo is configured such that it will trigger the setup scripts required automatically upon starting.

👀 You’ll notice 3 terminals over at the bottom right.
One for dependencies, another for RPC relay, and finally one for main.
You don’t really need to care about the first two, so just focus on the main terminal.

👀 Speaking of which, after a wait of a few seconds, you should see this output in the main terminal:

```
🏁 Initialise .env file - start  …
```

This setup script interactively prompts you to input values that will configure your application.
In most cases, you can simply accept the default values, so this should be pretty easy.

“Enter a BIP-39 seed phrase”

👉 Leave blank to accept the default, which is to generate a new seed phrase.
Read more about [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) and [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki).

“Enter a number of accounts to generate from your BIP-39 seed phrase”

👉 Leave blank to accept the default, which is to generate several accounts.

“Enter your preferred JSON-RPC endpoint URL”

👉 Leave blank to accept the default, which is to use the Hedera JSON-RPC Relay instance that Gitpod has run for you automatically in the background. If you are running this on your own computer, the default will be [`http://localhost:7546/`](http://localhost:7546/) which you should run manually.

“Enter your operator account (ECDSA) private key”

👉 Leave blank to accept the default, is to use the first account generated from the seed phrase from earlier.

“Please ensure that you have funded ${EVM\_ADDRESS}”

- The value of `${EVM\_ADDRESS}` will be `0x` followed by hexadecimal characters - copy this value to your clipboard.
- If you are using this EVM address for the first time, you will need to fund it. Otherwise just hit `\[return\]` right away, and move to the next step.
- 👉 Copy the EVM address to the clipboard
- 👉 In a new browser window/ tab, visit [https://faucet.hedera.com](https://faucet.hedera.com). Use \[command\]+\[click\] or \[control\]+\[click\] to do so.
👉 Paste the address into the text input field, press the “receive” button, pass the captcha challenge, press the “confirm” button, and wait for the transaction to complete.
- Switch back to the browser window/ tab with Gitpod running in it.
- 👉 Hit the \[return\] key

“Do you wish to overwrite the .env file with the above?”

👉 Open the `.env` file. This is the template or empty file.
👉 Type “y”, and hit the \[return\]  key
👀 Now observe that it has been populated with the values that you have just input (or defaults that you have accepted).

You are now all set up and ready to move on to one of the tasks.
