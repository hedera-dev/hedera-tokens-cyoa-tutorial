#!/usr/bin/env node

import {
    Client,
    PrivateKey,
    AccountId,
} from '@hashgraph/sdk';
import dotenv from 'dotenv';
import {
    createLogger,
} from '../util/util.js';

const logger = await createLogger({
    scriptId: 'token-hscs',
    scriptCategory: 'task',
});
let client;

async function scriptToken-hscs() {
    logger.logStart('Welcome to the token-hscs task!');

    // Read in environment variables from `.env` file in parent directory
    dotenv.config({ path: '../.env' });
    logger.log('Read .env file');

    // Initialise the operator account
    const operatorIdStr = process.env.OPERATOR_ACCOUNT_ID;
    const operatorKeyStr = process.env.OPERATOR_ACCOUNT_PRIVATE_KEY;
    if (!operatorIdStr || !operatorKeyStr) {
        throw new Error('Must set OPERATOR_ACCOUNT_ID and OPERATOR_ACCOUNT_PRIVATE_KEY environment variables');
    }
    const operatorId = AccountId.fromString(operatorIdStr);
    const operatorKey = PrivateKey.fromStringECDSA(operatorKeyStr);
    client = Client.forTestnet().setOperator(operatorId, operatorKey);
    logger.log('Using account:', operatorIdStr);

    await logger.logSectionWithWaitPrompt('Running the main part of the script');
    console.log('Doing something that takes 1 second.');
    await (new Promise((resolve) => { setTimeout(resolve, 1_000) }));
    if (!!true) {
        throw new Error('Demo error, this was inevitable!');
    }

    client.close();
    logger.logComplete('Demo task complete!');
}

scriptToken-hscs().catch((ex) => {
    client && client.close();
    logger ? logger.logError(ex) : console.error(ex);
});
