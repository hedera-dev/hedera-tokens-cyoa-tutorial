#!/usr/bin/env node

import { createPublicClient, http } from 'viem';
import { hederaTestnet } from 'viem/chains';
import dotenv from 'dotenv';
import {
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

    const web3Client = createPublicClient({
      chain: hederaTestnet,
      transport: http(rpcUrlHederatestnet, {
        batch: false,
      }),
    });

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
    // TODO

    // solc compile + generate ABI
    await logger.logSectionWithWaitPrompt('Loading EVM bytecode + ABI (solc outputs)');
    // TODO

    // check JSON-RPC relay
    await logger.logSectionWithWaitPrompt('Checking JSON-RPC endpoint liveness');
    const [blockNumber, balance] = await Promise.all([
        web3Client.getBlockNumber(),
        web3Client.getBalance({
            address: '0x7394111093687e9710b7a7aeba3ba0f417c54474',
        }),
    ]);
    console.log('block number', blockNumber);
    console.log('balance', balance);

    // EVM deployment transaction via viem
    await logger.logSectionWithWaitPrompt('Submit EVM transaction over RPC to deploy bytecode');
    // TODO

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
