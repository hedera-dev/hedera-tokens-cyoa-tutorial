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
    scriptId: 'tokenHscs',
    scriptCategory: 'task',
});
let client;

async function scriptTokenHscs() {
    logger.logStart('Welcome to the tokenHscs task!');

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
    logger.log('Doing something that takes 1 second.');
    await (new Promise((resolve) => { setTimeout(resolve, 1_000) }));
    if (!!true) {
        throw new Error('Demo error, this was inevitable!');
    }

    client.close();
    logger.logComplete('tokenHscs task complete!');
}

scriptTokenHscs().catch((ex) => {
    client && client.close();
    logger ? logger.logError(ex) : console.error(ex);
});
