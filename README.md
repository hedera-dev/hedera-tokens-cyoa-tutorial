# Base Template for Hedera Tutorial Demo Repos

Choose-your-own-Adventure to create Tokens on Hedera.

<a href="https://gitpod.io/?autostart=true&editor=code&workspaceClass=g1-standard#https://github.com/hedera-dev/hedera-tokens-cyoa-tutorial" target="_blank" rel="noreferrer">
  <img src="./img/gitpod-open-button.svg" />
</a>

## Features

- Installation of bare minimum dependencies
  - Hedera SDK + `.env` file parser
- Script that automates setup of `.env` file
  - Interactive prompts, with sensible defaults
  - Accommodates BIP-39 seed phrase + faucet dispense flow
    - This caters to EVM developers who wish to use their familiar developer tools
  - Accommodates portal account create flow
    - This caters to all developers in general (e.g. web2 developers)
  - Performs basic validation of accounts
    - Fail fast to prevent errors/ head scratching after beginning to do the tutorial
- Script that automates initialisation and running of JSON-RPC relay
  - Needed if tutorial involves the use of HSCS +
    EVM developer tools (hardhat/ foundry/ ethers/ viem/ metamask/ et cetera)
  - Otherwise, this is not necessary, and can be ignored/ or disabled by the tutorial author
- Anonymised metrics collection on HCS
  - Utility function provided to set up an HCS topic to log metrics to
    - Intended to be invoked by tutorial creator, as a once-off
  - Utility function provided to record events on said HCS topic
    - Intended to be invoked by tutorial user, each time they run various scripts during the tutorial
- Gitpod configuration
  - Allows developer to run tutorial in a cloud development environment (Gitpod)
  - Needed if developer is working from a non-POSIX compliant machine,
    or is otherwise unable to meet the set up requirements in the pre-requisites
  - Most likely needed if the developer is new to Hedera technology,
    and the intended outcome is a quick turnaround - e.g. Hello World sequence, or POC
  - Otherwise, this is not necessary, and can be ignored/ or disabled by the tutorial author

## Focus

These are the principles for this repo:

- Maximise setup automation
- Minimise steps for developer
- Shortest possible time before developer can work on first step in a tutorial
- Anticipate and counter developer friction points

The performance optimisation for speed can be quantified:

- *20-30 minutes*: Manual set up of prerequisites for an a developer new to Hedera technology
- *5-6 minutes*: Set up via scripts from scratch
- *1-2 minutes*: Set up via scripts with Docker image + Gitpod
  - TODO: custom Docker image instead of base Docker image + steps each run, to further speed this up
- *Immediate*: Time to start the first step in the script
  - Note: The setup still takes 1-2 minutes, but runs in the background and in parallel by design,
    allowing the developer to get on the tutorial steps right away

Developer friction points anticipated include:

- Those identified through a developer friction audit conducted in 2023
- Those identified through a developer usability test conducted in 2024

## Motivation

- A tutorial, at bare minimum, does the following:
  - Lists the pre-requisites which the developer must set up/ satisfy on their computer before proceeding
  - Guide its reader, step-by-step, how to complete a given task
  - Link to a demo repo which demonstrates the task
- This base template for demo repos goes beyond the bare minimum above:
  - Automates the set up of the pre-requisites
  - Provides a configuration for Gitpod, so that set up does not even need to be performed
    by the developer on their own computer
- What this achieves:
  - Reduce developer friction
  - Decrease the amount of time before developer can **start** the first step of the tutorial
  - Decrease the amount of time in total for the developer to **complete** the tutorial
- Main motivation here is **speed**:
  - Faster = Less developer friction
  - Faster = Larger fraction of developers complete the tutorial

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

For the client

- [x] Replace `marker` with a custom logger
  - Reduce clutter within the code
  - Make the collection more systematic and standardised
  - When `error` is logged, the HCS message should include a sequence number + hash of the message
    - To make it easier to understand *where* the friction points are
- [x] HCS message should include version number + git commit hash to be able to trace the version being run against
- [x] Add defined categories to the metrics (strings to enums)
  - Categories: `begin`, `complete`, and `error`
- [x] Collect stats for first/last/count for each log category
  - Persist in a file on disk such that it spans multiple runs of each script (in-memory won't work)
- [x] Derive additional statistics using these categories
  - [x] Timestamp difference between 1st `start` in setup to 1st `complete` in any task --> Quantify **time to hello world**
  - [x] Timestamp difference between 1st `start` in setup to lat `complete` in any task --> Quantify **time to full completion**
  - [x] Timestamp difference between 1st `start` in a task to 1st `complete` in the same task --> Quantify time taken to complete specific task for the first time
  - [x] Timestamp difference between last `start` in a task to last `complete` in the same task --> Quantify the most recent time taken to complete specific task
  - [x] Count of `error` occurrences between 1st instance of a `start`, and 1st instance of a `complete` in the same task --> Quantify number of friction points
  - [x] Count of 1st instance of `start` without any corresponding `complete` for the same task --> Quantify the completion rate (and therefore drop-off rate)
  - Note that number of friction points and completion rates are intended to be cross-referenced
- [x] Display a subset of the statistics collected to the user
  - Trigger 1: When a `complete` is hit in a script
  - Trigger 2: Manually invoke a script within `init/`
- [x] flag in `logger.json` file to turn off metrics logging on HCS - anonymised already
- [x] add option to publish metrics summary
- [x] summary output remove extra newline before the blue circle emoji
- [x] idea: hit "enter" (readline prompt) to continue to next step for logger
- [x] idea: automatically exit shell after docker pull of rpc relay image to reduce clutter
- [x] update `.env.sample` file to include all fields eventually generated
- [x] update `logger.json.sample` file to include all fields
- [x] separate time taken to complete first run and time taken to complete most recent run
- [x] different icons when logging start, complete, error, and summary
- [x] fix ANSI codes for colour and add BRIGHT (`\x1b[1m`) to make headings bold
- [x] make printed URLs blue and underlined to emphasise that they are clickable
- [x] run tasks via `npx`
- [x] logger config to disable ANSI
- [x] npx bin script with `update` and `scaffold-task` sub-commands
- [x] initialise metrics script also auto-updates config in `logger.json.sample`
- [ ] ideate: commemorative completion task reward

For a server/ CLI tool

- [ ] Ingest HCS topic with these messages
- [ ] Include simple queries for the above 4 metrics
- [ ] Output a information that can be plugged into a dashboard
- [ ] Capability to handle/ span Testnet resets
- [ ] Separate into different repo/ npm package from the base template

## Author

[Brendan Graetz](https://blog.bguiz.com/)

## Licence

MIT
