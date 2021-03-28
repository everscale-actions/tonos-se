[![CLI](https://github.com/ton-actions/tonos-se/actions/workflows/main.yml/badge.svg)](https://github.com/ton-actions/tonos-se/actions/workflows/main.yml)
[![binaries](https://github.com/ton-actions/tonos-se-binaries/actions/workflows/build-and-release.yml/badge.svg)](https://github.com/ton-actions/tonos-se-binaries/actions/workflows/build-and-release.yml)
[![npm version](https://badge.fury.io/js/tonos-se.svg)](https://www.npmjs.com/package/tonos-se)
[![Channel on Telegram](https://img.shields.io/badge/chat-on%20telegram-9cf.svg)](https://t.me/ton_actions_chat) 

# TONOS SE

This cross-platform solution provides [dynamically building](#build-binary-application-pack) binary application packs and [NPM package](https://www.npmjs.com/package/tonos-se) to easy start [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) without Docker.

> [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) is a local blockchain that developer can run on their machine in one click. See the [TON Labs TON OS SE documentation](https://docs.ton.dev/86757ecb2/p/19d886-ton-os-se) for detailed information.

 The current solution consists of 2 repositories that solve a specific task.

- [ton-actions/tonos-se](https://github.com/ton-actions/tonos-se) - CLI tool for installing and managing TONOS SE (NPM Package) which is called `tonos-se`
- [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries) - additional repository for generating application packs includes binaries and configuration files for different Operating Systems.

## Features

- 🏄 Easy to install, configure and run
- 🤹 Cross-platform support [![Cross-Platform Compatibility](https://jstools.dev/img/badges/os-badges.svg)](https://github.com/ton-actions/tonos-se/actions/workflows/main.ym)
- 🏋️ There is no need a Docker Engine, root permissions and WSL for Windows
- 🏊 All components and files, configurations, and databases in a one place
- 🚣 Automatically building and publishing new releases
- 🚴 Automatically updates user's applications
- 🧘 Sentry integration [[WIP]](https://github.com/ton-actions/tonos-se/pull/85)

## Requirements

NPM package `tonos-se` requires [Node.js](https://nodejs.org/) v14+ to run. Also, _Ton Node_ depends on _libSSL >= 1.1_ and it means that if your Operating System doesn't have it (For example, Ubuntu 16) you might get unstable behaviour. Please take care of the installation required tools and last updates for your Operating System.

### Windows

Install last updates and VC++ Runtime on Windows. Download and install it you can from the [latest supported Visual C++](https://support.microsoft.com/en-us/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) page.

Also, you need to set the PowerShell Execution Policy from Restricted to RemoteSigned before you can install NPM packages globally.

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### MacOS or Linux Based Distributions

MacOS or Linux Based Distributions do not have any special requirements. But the first time you try to install a package globally on a Mac, or Linux, you might get a weird error, saying something like "Missing write access to /usr/local/lib/node_modules or /usr/local/bin". You can use [official guide to resolve the problem](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) or just grant permissions to the particular folders like this:

```sh
# here could be another node modules folder. It depends on your Environment
sudo chown -R $USER /usr/local/lib/node_modules 
sudo chown -R $USER /usr/local/bin
```

## Installation

```sh
npm install -g tonos-se
```

## Usage

We created easy to use application. So here are a few native commands you needed.

### First start

Before start `tonos-se` checks current installed binary package using hash sha256. In case, it detects differences, `tonos-se` will download a new version of binary application pack and install it. So if a new version of binaries files is released, users will get a new version before the next start.

```sh
tonos-se start
```

`tonos-se` downloads an binary pack, unpacks it to _user folder/.tonos-se_. From that moment all files like applications, configuration, data and log files will be placed there. You can do deep configuring, backup or experiments if you want.

<img width="859" alt="Screenshot 2021-03-27 at 16 56 54" src="https://user-images.githubusercontent.com/54890287/112723099-fad4b680-8f1d-11eb-8a9b-e2a3c45be21c.png">

### Basic commands

Use these commands to start, stop, restart and get status or help.

```sh
tonos-se start
tonos-se stop
tonos-se restart
tonos-se status
tonos-se help
```

To get current settings just run `tonos-se config` command.

<img width="859" alt="Screenshot 2021-03-27 at 17 02 40" src="https://user-images.githubusercontent.com/54890287/112723179-543ce580-8f1e-11eb-875e-0df49e736ab2.png">

To get versions of applications, available tonos-se binary packs or other informations use `tonos-se version` command.

<img width="1066" alt="Screenshot 2021-03-25 at 12 31 45" src="https://user-images.githubusercontent.com/54890287/112451045-185f2000-8d66-11eb-9c43-e545b0009822.png">

### Configuring ports

To set a custom port for any application in the solution separately or using one command. To apply new changes use `tonos-se restart`.

> ⚠️ we strongly do not recommend you to use ports less than 1024. Some Operating Systems have restrictions about it.

```sh
tonos-se config --nginx-port 8082 # Nginx Listening Port
tonos-se config --q-server-port 5000 # Q Server Listening Port
tonos-se config --ton-node-port 50400 # Ton Node Listening Port
tonos-se config --ton-node-kafka-msg-port 7000 # Ton Node: Kafka Listening Port
tonos-se config --ton-node-adnl-port 7001 # Ton Node: ADNL Listening Port
tonos-se config --arango-port 7433 # ArangoDB Listening Port

# It is possible to set all parameters using one command
tonos-se config --nginx-port 8082 \
  --q-server-port 5000 \
  --arango-port 7433 \
  --ton-node-port 55443 \
  --ton-node-kafka-msg-port 7000 \
  --ton-node-adnl-port 7001

# To apply new changes
tonos-se restart
```

Here is a real case when ports are already used by some application.

![render1616856333863](https://user-images.githubusercontent.com/54890287/112724848-44290400-8f26-11eb-8af3-82214f93cc7d.gif)

### Configuring usage version

> ⚠️ use this configuration parameter if you understand what you do

By default `tonos-se` uses a latest version of TON OS SE binary application pack. But you might want to downgrade to a previous version for testing something or maybe do some experiments, etc. Available versions can be found here [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries). Use this command for setting up a version you want.

```sh
# Get installed versions of applications and available versions
tonos-se version

# To change tonos-se versions use command
tonos-se config --tonos-se-version 0.25.0
```

When it happens, `tonos-se` verifies a checksum and does automatically soft upgrade/downgrade your current version. But be careful using downgrade / upgrade. This may affects tonos-se data files. If something goes wrong use the commands below to fix a potential problem.

![render1616679986703-min](https://user-images.githubusercontent.com/54890287/112483378-02fbed00-8d8a-11eb-8a95-7f83e59af1c5.gif)

### Delete applications or data files

Sometimes you might want to reset settings to the default state. `tonos-se` supports 2 methods like soft and hard state reset.

```sh
# Soft reset. Data and log files are not removed.
tonos-se reset

# Hard reset. Completely remove internal applications and data files.
tonos-se remove
```

## Update 

To update to the last version `tonos-se` stop it, update npm package and start again.

```sh
tonos-se stop
npm update -g tonos-se
tonos-se start
```

## Uninstall

To completely uninstall `tonos-se` use command `tonos-se remove` for stopping and deleting internal data files and applications. And then `npm remove -g tonos-se`

## CI/CD

Our CI/CD is based on GitHub Workflow and GitHub Actions. As was mentioned before the solution includes 2 repositories to solve particular tasks. General information about how it builds and tests and publishes described below.

### NPM Package `tonos-se`

All logic of build, test and publishing could be found in [.github/workflows/main.yml](https://github.com/ton-actions/tonos-se/blob/main/.github/workflows/main.yml) file. In building process is nothing special what you need to know. It is standart task of building nodejs applications. But here is a 2 words about testing. For testing into the pipline we use official Node Se tests. It can guarantee that everything is going fine. 

The general idea of the pipeline:

1. build and run `tonos-se`
2. check the default ports are opened
3. run tests 
4. change [default ports](https://github.com/ton-actions/tonos-se/blob/main/.github/workflows/main.yml#L13) to the custom ports (env variable [CUSTOM_PORTS](https://github.com/ton-actions/tonos-se/blob/main/.github/workflows/main.yml#L14))
5. check the custom ports are opened
6. run tests
7. stop `tonos-se`
8. check custom posts are closed

CI/CD **automatically publishes** a new version of `tonos-se`. There are 2 conditions that needed to publish a new version of the package to [npmjs]( ton-node-kafka-msg-port)

1. commit in master
2. version is changed in [package.json](https://github.com/ton-actions/tonos-se/blob/main/package.json#L3)

### Binary application pack

To make the process of building fast and easy, we use Github Actions and GitHub Workflow for building all necessary binary application packs in [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries) repository. TonOS SE application pack is a tar.gz archive that contains applications (_Nginx_, _ArangoDB_, _Q Server_, _Ton Node_) and configuration files to a quick start. The full list of application packs could be found [here](https://github.com/ton-actions/tonos-se-binaries/releases).

#### Prepare application pack

All application packs is created automatically. When new version [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) is released, new version of binary application pack will be available for release. 

The major version of the `tonos-se` tool can use only the major _version of release_ binary application pack. This approach allows us to guarantee  compatibility between the `tonos-se` tool and binary files. So if [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) releases a new version that contains Postgres(for example), we will publish the next major version of binary files. And then we will publish a new major version of the CLI tool, which will be compatible only with the same major version of binary application packs.

#### How to build custom application pack

It is possible to use custom versions or default config files of any application inside the application pack. Just fork [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries), enable GitHub actions. And apply your changes.

<img width="1340" alt="Screenshot 2021-03-24 at 22 19 22" src="https://user-images.githubusercontent.com/54890287/112374143-ccbf5e80-8cf2-11eb-998f-b82ecdc816a5.png">

The Magic of creating applications pack is described in main.yml workflow file. Feel free to read the documentation about a structure and details on the main page [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries).

#### Use custom application pack

After you create and test your own application pack time to use it. Change application pack's version or your GitHub repository. And enjoy the result.

```sh
tonos-se config --tonos-se-version 0.25.0
tonos-se config --github-binaries-repository example/example
```

## Known problems and FAQ

**❓Issue:** Subscribe for transactions with addresses (ABIv1) test fails on Windows.

**🙋Answer:** We found out some strange behavior while using ton-client-js's tests on Windows. We guess it could be connected with some internal node's problem. But we found a workaround. We created an [issue](https://github.com/tonlabs/tonos-se/issues/13) and opened a [pull request](https://github.com/tonlabs/ton-client-js/pull/206) to solve the problem. 

_UPD: pull request was successfully merged to master branch. To solve the problem pull last changes from [tonlabs/ton-client-js](https://github.com/tonlabs/ton-client-js)_ 

##

**❓Issue:** tonos-se command not found after installation

**🙋Answer:** You need to re-read your bash profile. To solve the problem just open a new terminal window/tab.

##

**❓Issue:** After removing the npm package all processes like arango, nginx, etc... still in running state 

**🙋Answer:** Please install `tonos-se` again, then use `tonos-se remove` for removing internal applications. And then remove the npm package.

##

**❓Issue:** I got some warnings from Windows Firewall what should I do?

**🙋Answer:** All internal applications build from official sources. Feel free to discover it if you want. But make the npm package works fine you need to _Allow access_ for them.

##

**❓Issue:** Is it possible to use ENV variables for configuring ports?

**🙋Answer:** Yes. We have provided such an opportunity. Use these env variables to configure listenings ports.

- TONOS_SE_NGINX_PORT
- TONOS_SE_Q_PORT
- TONOS_SE_NODESE_PORT
- TONOS_SE_NODESE_KAFKA_MSG_PORT
- TONOS_SE_NODESE_ADNL_PORT
- TONOS_SE_ARANGO_PORT
- TONOS_RELEASE_TAG
- GITHUB_BINARIES_REPOSITORY


##

**❓Issue:** How to install `tonos-se` from the repository?

**🙋Answer:** It is possible to install the tool using source code.

```sh
git clone https://github.com/ton-actions/tonos-se.git
cd tonos-se
npm i --production
npm i -g
```

##

**❓Issue:** I want to do some experiments without installing `tonos-se` globally. How can I do this?

**🙋Answer:** You need to clone current repository. Change working directory to _bin_ and use available commands adding `node` before. For example, `node ./tonos-se.js start`


## Plans for the future

- Add Sentry integration
- Add Unit Tests
- Migrate to TypeScript


