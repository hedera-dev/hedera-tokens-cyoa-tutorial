#!/usr/bin/env node

import fs from 'node:fs/promises';
import {
    Client,
    PrivateKey,
    AccountId,
    TokenCreateTransaction,
    TokenType,
    TokenAssociateTransaction,
    TransferTransaction,
    EntityIdHelper,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import {
    createLogger,
    queryAccountByEvmAddress,
} from '../util/util.js';

const logger = await createLogger({
    scriptId: 'tokenHts',
    scriptCategory: 'task',
});
let client;

async function scriptTokenHts() {
    logger.logStart('Welcome to the tokenHts task!');

    // Read in environment variables from `.env` file in parent directory
    dotenv.config({ path: '../.env' });
    logger.log('Read .env file');

    // Initialise the operator account
    const operatorIdStr = process.env.OPERATOR_ACCOUNT_ID;
    const operatorKeyStr = process.env.OPERATOR_ACCOUNT_PRIVATE_KEY;
    const account1EvmAddress = process.env.ACCOUNT_1_EVM_ADDRESS;
    const account1KeyStr = process.env.ACCOUNT_1_PRIVATE_KEY;
    if (!operatorIdStr || !operatorKeyStr ||
        !account1EvmAddress || !account1KeyStr ) {
        throw new Error('Must set OPERATOR_ACCOUNT_ID, OPERATOR_ACCOUNT_PRIVATE_KEY, ACCOUNT_1_EVM_ADDRESS, and ACCOUNT_1_PRIVATE_KEY environment variables');
    }
    const operatorId = AccountId.fromString(operatorIdStr);
    const operatorKey = PrivateKey.fromStringECDSA(operatorKeyStr);
    const account1Key = PrivateKey.fromStringECDSA(account1KeyStr);
    client = Client.forTestnet().setOperator(operatorId, operatorKey);
    logger.log('Using account:', operatorIdStr);

    // NOTE: Create a HTS token
    await logger.logSection('Configuring new HTS token');
    const tokenCreateTx = await new TokenCreateTransaction()
        //Set the transaction memo
        .setTransactionMemo(`Fungible Tokens CYOA create - ${logger.version}`)
        // HTS `TokenType.FungibleCommon` behaves similarly to ERC20
        .setTokenType(TokenType.FungibleCommon)
        // Configure token options: name, symbol, decimals, initial supply
        .setTokenName(`${logger.scriptId} coin`)
        // Set the token symbol
        .setTokenSymbol(logger.scriptId.toUpperCase())
        // Set the initial supply of the token to 1,000,000
        .setInitialSupply(1_000_000)
        // Set the token decimals to 2, so there will be 10,000.00 tokens
        .setDecimals(2)
        // Configure token access permissions: treasury account, admin, freezing
        .setTreasuryAccountId(operatorId)
        // Set the admin key of the the token to the operator account
        .setAdminKey(account1Key)
        // Set the freeze default value to false
        .setFreezeDefault(false)
        // Set the Node ID that will process the transaction
        .setNodeAccountIds([AccountId.fromString('0.0.5')])
        // Freeze the transaction to prepare for signing
        .freezeWith(client);

    // Get the transaction ID of the transaction. The SDK automatically generates and assigns a transaction ID when the transaction is created
    const tokenCreateTxId = tokenCreateTx.transactionId;
    logger.log('The token create transaction ID: ',
        tokenCreateTxId.toString());

    await logger.logSection('Transaction for new HTS token');
    // Sign the transaction with the account key that will be paying for this transaction
    // const tokenCreateTxSigned = await tokenCreateTx.sign(operatorKey);
    const tokenCreateTxSig1 = operatorKey.signTransaction(tokenCreateTx);
    const tokenCreateTxSig2 = account1Key.signTransaction(tokenCreateTx);
    const tokenCreateTxSigned = tokenCreateTx
        .addSignature(operatorKey.publicKey, tokenCreateTxSig1)
        .addSignature(account1Key.publicKey, tokenCreateTxSig2);

    // Submit the transaction to the Hedera Testnet
    const tokenCreateTxSubmitted = await tokenCreateTxSigned.execute(client);

    // Get the transaction receipt
    const tokenCreateTxReceipt = await tokenCreateTxSubmitted.getReceipt(client);

    // Get the token ID
    const tokenId = tokenCreateTxReceipt.tokenId;
    logger.log('tokenId:', tokenId.toString());
    const tokenHashScanUrl = `https://hashscan.io/testnet/token/${tokenId.toString()}`;
    logger.log('View on Hashscan:\n', ...logger.applyAnsi('URL', tokenHashScanUrl));

    // output token ID to file, so can be read as input later by the htsHscsInterop task
    const { shard, realm, num } =
        EntityIdHelper.fromString(tokenId.toString());
    const tokenEvmAddress = '0x' + EntityIdHelper.toSolidityAddress([shard, realm, num]);
    const artefacts = {
        tokenCreateTxId: tokenCreateTxId.toString(),
        tokenId: tokenId.toString(),
        tokenEvmAddress: tokenEvmAddress.toString(),
    };
    const artefactsFile = 'artefacts.json';
    await fs.writeFile(artefactsFile, JSON.stringify(artefacts));
    logger.log('Artefacts saved to file:', artefactsFile, artefacts);

    // TokenAssociateTransaction
    await logger.logSection('Configuring token association');
    // NOTE "INVALID_ACCOUNT_ID" when using EVM address
    // instead of S.R.N. format for account ID,
    // hence the need to use `queryAccountByEvmAddress` below.
    // See: https://github.com/hashgraph/hedera-sdk-js/issues/2442
    const {
        accountId: account1Id,
    } = await queryAccountByEvmAddress(account1EvmAddress);
    const assocTx = await new TokenAssociateTransaction()
        .setAccountId(account1Id)
        .setTokenIds([tokenId])
        // Freeze the transaction to prepare for signing
        .freezeWith(client);

    // Get the transaction ID for the token associate transaction
    const assocTxId = assocTx.transactionId;
    logger.log('The token association transaction ID:', assocTxId.toString());

    await logger.logSection('Submitting token association transaction');
    // Sign the transaction with the account that is being debited (operator account)
    // and the transaction fee payer account (operator account)
    // Since the account that is being debited and the account that is paying for
    // the transaction are the same only one account's signature is required
    const assocTxSigned = await assocTx.sign(account1Key);

    //Submit the transaction to the Hedera Testnet
    const assocTxSubmitted = await assocTxSigned.execute(client);

    //Get the transfer transaction receipt
    const assocTxReceipt = await assocTxSubmitted.getReceipt(client);
    const assocTxStatus = assocTxReceipt.status;
    logger.log(
        'The token association transaction status is:',
        assocTxStatus.toString(),
    );
    const assocTxHashScanUrl = `https://hashscan.io/testnet/transaction/${assocTxId.toString()}`;
    logger.log('View on Hashscan:\n', ...logger.applyAnsi('URL', assocTxHashScanUrl));

    // TransferTransaction
    await logger.logSection('Configuring token transfer');
    // NOTE "NO_REMAINING_AUTOMATIC_ASSOCIATIONS" when using EVM address
    // here means that TokenAssociateTransaction above did not work.
    const transferTx = await new TransferTransaction()
        .setTransactionMemo(`Fungible Tokens CYOA transfer - ${logger.version}`)
        // Debit 1.00 tokens from the operator account (sender)
        .addTokenTransfer(tokenId, operatorId, -100)
        // Credit 1.00 tokens to account 1 (1st recipient)
        .addTokenTransfer(tokenId, account1EvmAddress, 100)
        // Freeze the transaction to prepare for signing
        .freezeWith(client);

    // Get the transaction ID for the transfer transaction
    const transferTxId = transferTx.transactionId;
    logger.log('The transfer transaction ID:', transferTxId.toString());

    await logger.logSection('Submitting token transfer transaction');
    // Sign the transaction with the account that is being debited (operator account)
    // and the transaction fee payer account (operator account)
    // Since the account that is being debited and the account that is paying for
    // the transaction are the same only one account's signature is required
    const transferTxSigned = await transferTx.sign(operatorKey);

    //Submit the transaction to the Hedera Testnet
    const transferTxSubmitted = await transferTxSigned.execute(client);

    //Get the transfer transaction receipt
    const transferTxReceipt = await transferTxSubmitted.getReceipt(client);
    const transactionStatus = transferTxReceipt.status;
    logger.log(
        'The transfer transaction status is:',
        transactionStatus.toString(),
    );
    const transferTxHashScanUrl = `https://hashscan.io/testnet/transaction/${transferTxId.toString()}`;
    logger.log('View on Hashscan:\n', ...logger.applyAnsi('URL', transferTxHashScanUrl));

    client.close();
    logger.logComplete('tokenHts task complete!');
}

scriptTokenHts().catch((ex) => {
    client && client.close();
    logger ? logger.logError(ex) : console.error(ex);
});
