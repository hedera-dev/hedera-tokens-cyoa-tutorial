#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
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
    getAbiSummary,
} from '../util/util.js';

const logger = await createLogger({
    scriptId: 'tokenInterop',
    scriptCategory: 'task',
});

async function scriptTokenInterop() {
    logger.logStart('Welcome to the tokenInterop task!');

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
    const account1EvmAddress = process.env.ACCOUNT_1_EVM_ADDRESS;
    const account1KeyStr = process.env.ACCOUNT_1_PRIVATE_KEY;
    if (!operatorEvmAddressStr || !operatorKeyStr ||
        !account1EvmAddress || !account1KeyStr ) {
        throw new Error('Must set OPERATOR_ACCOUNT_ID, OPERATOR_ACCOUNT_PRIVATE_KEY, ACCOUNT_1_EVM_ADDRESS, and ACCOUNT_1_PRIVATE_KEY environment variables');
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

    // Remind dev to complete both tokenHts and tokenHscs scripts
    await logger.logReminder('Reminder: Complete both the "token-hts" and "token-hscs" tasks before running this script');

    // obtain the HTS fungible token's token ID, and convert to address.
    // From tokenHts script
    await logger.logSection('Obtain EVM address of existing HTS fungible token');
    const tokenHtsArtefactsFile = path.resolve('../token-hts', 'artefacts.json');
    const tokenHtsArtefactsJson = await fs.readFile(tokenHtsArtefactsFile, { encoding: 'utf8' });
    logger.log('Token HTS artefacts:', tokenHtsArtefactsJson.substring(0, 32), CHARS.HELLIP + '(truncated)');
    const tokenHtsArtefacts = JSON.parse(tokenHtsArtefactsJson);
    const tokenEvmAddress = tokenHtsArtefacts.tokenEvmAddress;
    logger.log('Token HTS EVM address:', tokenEvmAddress);
    const tokenEvmAddressHashScanUrl = `https://hashscan.io/testnet/token/${tokenEvmAddress}`;
    logger.log('Token HTS EVM address Hashscan URL:',
        ...logger.applyAnsi('URL', tokenEvmAddressHashScanUrl),
    );

    // obtain ERC20 ABI.
    // From tokenHscs script
    await logger.logSection('Loading ABI (solc outputs)');
    const solidityFileNamePrefix = path.resolve('../token-hscs', 'my_token_sol_');
    const myTokenAbiStr = await fs.readFile(`${solidityFileNamePrefix}MyToken.abi`, { encoding: 'utf8' });
    logger.log('Compiled smart contract ABI string:', myTokenAbiStr.substring(0, 32), CHARS.HELLIP + '(truncated)');
    const myTokenAbi = JSON.parse(myTokenAbiStr);
    logger.log('Compiled smart contract ABI summary:\n', getAbiSummary(myTokenAbi));

    // test that JSON-RPC endpoint is live
    await logger.logSection('Checking JSON-RPC endpoint liveness');
    const [blockNumber, balance] = await Promise.all([
        client.getBlockNumber(),
        client.getBalance({
            address: operatorEvmAddressStr,
        }),
    ]);
    logger.log('block number', blockNumber);
    logger.log('balance', balance);

    // perform transfer of the HTS fungible token
    // by invoking the ERC20 ABI's transfer function on HSCS via viem
    await logger.logSection('Submit EVM transaction over RPC to transfer HTS token balance (HSCS interoperability)');

    // function transfer(address to, uint256 amount) external returns (bool);
    const transferTxHash = await client.writeContract({
        address: tokenEvmAddress,
        abi: myTokenAbi,
        functionName: 'transfer',
        args: [
            account1EvmAddress, // address to
            100n, // uint256 amount
        ],
        account: operatorAccount,
    });
    logger.log('Transfer transaction hash:', transferTxHash);
    const transferTxHashscanUrl = `https://hashscan.io/testnet/transaction/${transferTxHash}`;
    logger.log(
        'Transfer transaction Hashscan URL:\n',
        ...logger.applyAnsi('URL', transferTxHashscanUrl),
    );
    const transferTxReceipt = await client.getTransactionReceipt({
        hash: transferTxHash,
    });
    logger.log('Transfer transaction receipt status:', transferTxReceipt.status);

    // EVM balance query via viem
    await logger.logSection('Submit EVM request over RPC to query token balance');
    // function balanceOf(address account) external view returns (uint256);
    const queryResult = await client.readContract({
        address: tokenEvmAddress,
        abi: myTokenAbi,
        functionName: 'balanceOf',
        args: [account1EvmAddress],
    });
    logger.log('Balance of query result:', queryResult);

    logger.logComplete('tokenInterop task complete!');
}

scriptTokenInterop().catch((ex) => {
    logger ? logger.logError(ex) : console.error(ex);
});
