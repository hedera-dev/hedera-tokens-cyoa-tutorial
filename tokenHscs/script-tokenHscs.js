#!/usr/bin/env node

import fs from 'node:fs/promises';
import {
    createWalletClient,
    http,
    publicActions,
 } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hederaTestnet } from 'viem/chains';
import dotenv from 'dotenv';
import {
    CHARS,
    createLogger,
} from '../util/util.js';

const logger = await createLogger({
    scriptId: 'tokenHscs',
    scriptCategory: 'task',
});

async function scriptTokenHscs() {
    logger.logStart('Welcome to the tokenHscs task!');

    // Read in environment variables from `.env` file in parent directory
    dotenv.config({ path: '../.env' });
    logger.log('Read .env file');

    // Initialise RPC connection via viem
    // Ref: https://github.com/hedera-dev/hedera-code-snippets/blob/main/connect-viem/connect.js
    /*
    Set up a JSON-RPC endpoint for this project to connect to Hedera Testnet.
    Ref: https://docs.hedera.com/hedera/tutorials/more-tutorials/json-rpc-connections/

    Then set that as the value of `RPC_URL` in the `.env` file.
    */
    const rpcUrlHederatestnet = process.env.RPC_URL;
    if (!rpcUrlHederatestnet || !rpcUrlHederatestnet.startsWith('http')) {
        throw new Error(
            'Missing or invalid value in RPC_URL env var',
        );
    }
    const operatorEvmAddressStr = process.env.OPERATOR_ACCOUNT_EVM_ADDRESS;
    const operatorKeyStr = process.env.OPERATOR_ACCOUNT_PRIVATE_KEY;
    if (!operatorEvmAddressStr || !operatorKeyStr) {
        throw new Error('Must set OPERATOR_ACCOUNT_ID and OPERATOR_ACCOUNT_EVM_ADDRESS environment variables');
    }
    const operatorAccount = privateKeyToAccount(operatorKeyStr);
    const client = createWalletClient({
        account: operatorAccount,
        chain: hederaTestnet,
        transport: http(rpcUrlHederatestnet, {
          batch: false,
          timeout: 60_000,
          retryCount: 5,
          retryDelay: 500,
        }),
    }).extend(publicActions);
    logger.log('Using account:', operatorEvmAddressStr);
    logger.log('Using RPC endpoint:', rpcUrlHederatestnet);

    // // Initialise the operator account
    // const operatorIdStr = process.env.OPERATOR_ACCOUNT_ID;
    // const operatorKeyStr = process.env.OPERATOR_ACCOUNT_PRIVATE_KEY;
    // if (!operatorIdStr || !operatorKeyStr) {
    //     throw new Error('Must set OPERATOR_ACCOUNT_ID and OPERATOR_ACCOUNT_PRIVATE_KEY environment variables');
    // }
    // const operatorId = AccountId.fromString(operatorIdStr);
    // const operatorKey = PrivateKey.fromStringECDSA(operatorKeyStr);
    // client = Client.forTestnet().setOperator(operatorId, operatorKey);
    // logger.log('Using account:', operatorIdStr);

    // Solidity ERC20 minimal impl
    await logger.logSectionWithWaitPrompt('Checking Solidity smart contract source code');
    const myTokenSource = await fs.readFile(`my_token.sol`, { encoding: 'utf8' });
    logger.log('Source code smart contract Solidity:', myTokenSource.substring(0, 32), CHARS.HELLIP);

    // solc compile + generate ABI
    await logger.logSectionWithWaitPrompt('Loading EVM bytecode + ABI (solc outputs)');
    const solidityFileNamePrefix = 'my_token_sol_';
    const myTokenAbiStr = await fs.readFile(`${solidityFileNamePrefix}MyToken.abi`, { encoding: 'utf8' });
    const myTokenEvmBytecode = await fs.readFile(`${solidityFileNamePrefix}MyToken.bin`, { encoding: 'utf8' });
    logger.log('Compiled smart contract ABI string:', myTokenAbiStr.substring(0, 32), CHARS.HELLIP);
    logger.log('Compiled smart contract EVM bytecode:', myTokenEvmBytecode.substring(0, 32), CHARS.HELLIP);
    const myTokenAbi = JSON.parse(myTokenAbiStr);
    logger.log('Compiled smart contract ABI parse:', myTokenAbi);

    // check JSON-RPC relay
    await logger.logSectionWithWaitPrompt('Checking JSON-RPC endpoint liveness');
    const [blockNumber, balance] = await Promise.all([
        client.getBlockNumber(),
        client.getBalance({
            address: '0x7394111093687e9710b7a7aeba3ba0f417c54474',
        }),
    ]);
    logger.log('block number', blockNumber);
    logger.log('balance', balance);

    // EVM deployment transaction via viem
    await logger.logSectionWithWaitPrompt('Submit EVM transaction over RPC to deploy bytecode');
    const deployTxHash = await client.deployContract({
        abi: myTokenAbi,
        bytecode: myTokenEvmBytecode,
        // constructor(string memory _symbol, string memory _name)
        args: [
            logger.scriptId.toUpperCase(),
            `${logger.scriptId} coin`,
        ],
        account: operatorAccount,
    });
    logger.log('Deployment transaction hash:', deployTxHash);
    const deployTxHashscanUrl = `https://hashscan.io/testnet/transaction/${deployTxHash}`;
    logger.log(
        'Deployment transaction Hashscan URL:\n',
        ...logger.applyAnsi('URL', deployTxHashscanUrl),
    );

    const deployTxReceipt = await client.getTransactionReceipt({
        hash: deployTxHash,
    });
    const deployAddress = deployTxReceipt.contractAddress;
    logger.log('Deployment transaction address:', deployAddress);
    const deployAddressHashscanUrl = `https://hashscan.io/testnet/contract/${deployAddress}`;
    logger.log(
        'Deployment address Hashscan URL:\n',
        ...logger.applyAnsi('URL', deployAddressHashscanUrl),
    );

    // EVM transfer transaction via viem
    await logger.logSectionWithWaitPrompt('Submit EVM transaction over RPC to transfer token balance');
    // TODO

    // EVM balance query via viem
    await logger.logSectionWithWaitPrompt('Submit EVM request over RPC to query token balance');
    // TODO

    logger.logComplete('tokenHscs task complete!');
}

scriptTokenHscs().catch((ex) => {
    logger ? logger.logError(ex) : console.error(ex);
});
