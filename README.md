# node-setup

This project provides standalone binary components and configuration files to start [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) for Linux, macOS, and Windows systems without Docker. It also provides NPM Package for a quick run locally using CLI depends on your Operation System.

## Features

- Easy to use
- here is no need to have Docker
- Crossplatform support
- All components and files, configurations, and databases in a one place
- Easy create a custom build and application pack

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
ton-node status # Show the current state
ton-node reset # Delete all data and reinstall applications
```

> Note: for a first start ton-node will download an application pack for your operating system, unpack it to .server folder and run all necessary applications.

## How it works

### Prepare release

To make the process of building fast and easy we use Github Actions and Workflow yml files to prepare three application packs for different operating systems: Linux, macOS, and Windows. An application pack is a tar.gz archive which contains four different application and configuration files:

- nginx
- arangodb
- q-server
- ton node

You can find all available releases published in the current repository (https://github.com/ton-actions/node-se-setup/releases). If you want you can download it, unpack and look inside.

### How to build custom version

If you want you can change usage versions to custom and create your own application pack.  
To build your own binary fork the original repository. Then you need to enable GitHub actions to build it. To start building your own custom application packs you need to edit ...

## License

MIT

**Free Software, Hell Yeah!**
