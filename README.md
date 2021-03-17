# node-setup

This project provides standalone binary components and configuration files to start [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) for Linux, macOS, and Windows systems without Docker. It also provides NPM Package for a quick run locally using CLI depends on your Operation System.

## Features

- Easy to install, configure and run 
- Crossplatform support (Windows, Linux, MacOS)
- There is no need a Docker Engine, root permissions and WSL for Windows 
- All components and files, configurations, and databases in a one place
- Easy create a custom build and application pack

## Installation

Node-setup requires [Node.js](https://nodejs.org/) v12+ to run.

## Manual

```sh
git clone https://github.com/ton-actions/node-se-setup
cd node-se-setup
npm i
npm i -g
```

## Using global NPM package

```sh
npm install -g <package_name>
```

## Usage

We tried to create easy to use application. So here are a few native commands you needed.

```sh
ton-node start # Start all necessary applications
ton-node stop # Stop all applications
ton-node status # Show running status of applications
ton-node reset # Delete all data and reinstall applications
```

> Note: for a first start ton-node will download an application pack for your operating system, unpack it to '.server' folder inside the CLI tool. Since that moment all necessary files like applications, configuration, data and log files will be placed here. And you can do deep configuring, backup or experiments if you want. 

<img width="1014" alt="Screenshot 2021-03-17 at 15 05 50" src="https://user-images.githubusercontent.com/54890287/111464789-4f17b380-8732-11eb-8983-f012c24c2c59.png">

## How it works

The current solution consists of 2 repositories that solve a specific task.

- ton-actions/node-se-binaries - application packs 
- ton-actions/node-se-setup - CLI tool for manage applications

### Prepare application pack

To make the process of building fast and easy we use Github Actions and Workflow yml files to prepare three application packs for different operating systems: Linux, MacOS and Windows. A group of three application packs is called release. An application pack is a tar.gz archive that contains different application and configuration files for them like:

- nginx
- arangodb
- q-server
- ton node

<img width="1171" alt="Screenshot 2021-03-17 at 15 13 51" src="https://user-images.githubusercontent.com/54890287/111465671-715e0100-8733-11eb-8e9b-029bde427b93.png">

> Note: release has the same version of ton node's version available releases published. 

### How to build custom version

If you want you can change usage versions to custom and create your own application pack.  
To build your own binary fork the original repository. Then you need to enable GitHub actions to build it. To start building your own custom application packs you need to edit ...
