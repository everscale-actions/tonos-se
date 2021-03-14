# node-setup

This project provides standalone binary components and configuration files to start [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) for Linux, macOS, and Windows system without Docker. It also provides NPM Package for quick run it locally using CLI depends on your Operation System.

## Features

- Easy to use
- There is no need a Docker to start Ton Node Se
- Crossplatform support
- All components and  files, configurations and databases in a one place
- Easy custom build  

## Installation

node-setup requires [Node.js](https://nodejs.org/) v12+ to run. 

```sh
git clone https://github.com/ton-actions/node-se-setup
cd node-se-setup
npm i
npm i -g
```

## Usage

We tried to create easy to use application. So here are a few native commands you needed. 

```sh
ton-node start # Start all necessary applications
ton-node stop # Stop all applications
ton-node status # Show current state
ton-node reset # Delete all data and reinstall applications
```

> Note: for a first start ton-node will download application pack for your operation system, unpack it to .server folder and run all necessary applications.

## How it works

### Prepare release

To make the proccess of building fast and easy we use Github Actions and Workflow yml files to prepare three application packs for different operation systems: Linux, MacOs and Windows. Application pack is tar.gz archive which contains four different application and configuration files:

- nginx
- arangodb
- q-server
- ton node

You can find all available releases published in current repository  (https://github.com/ton-actions/node-se-setup/releases). If you want you can download it, unpack and look inside. 

### How to build custom version

If you want you can change usage versions to custom and create your own application pack.  
To build your own binary fork the original repository. Than you need to enable github actions to build it. 

To start build your own custom applications packs you need edit ...

## License

MIT

**Free Software, Hell Yeah!**
