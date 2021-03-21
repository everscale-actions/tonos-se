[![CLI](https://github.com/ton-actions/tonos-se/actions/workflows/main.yml/badge.svg)](https://github.com/ton-actions/tonos-se/actions/workflows/main.yml)
[![Binaries](https://github.com/ton-actions/tonos-se-binaries/actions/workflows/main.yml/badge.svg)](https://github.com/ton-actions/tonos-se-binaries/actions/workflows/main.yml)

# TONOS SE

This solution provides standalone binary components and configuration files to start [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) for Linux, macOS, and Windows systems without Docker. And also provides NPM Package for a quick run locally using CLI depends on your Operation System.

The current solution consists of 2 repositories that solve a specific task.

- ton-actions/tonos-se-binaries - application packs includes binaries and configuration files
- ton-actions/tonos-se - CLI tool for install and manage TONOS SE (NPM Package)

## Features

- Easy to install, configure and run
- Crossplatform support (Windows, Linux, MacOS)
- There is no need a Docker Engine, root permissions and WSL for Windows
- All components and files, configurations, and databases in a one place
- Easy create a custom build and application pack

## Installation

TONOS SE requires [Node.js](https://nodejs.org/) v12+ to run.

### Manual

```sh
git clone https://github.com/ton-actions/tonos-se
cd tonos-se
npm i
npm i -g
```

### Using global NPM package

```sh
npm install -g tonos-se
```

## Usage

We created easy to use application. So here are a few native commands you needed.

### Base commands

```sh
tonos-se start # Start all necessary applications
tonos-se stop # Stop all applications
tonos-se restart # Restart all applications
tonos-se status # Show running status of applications
```

### Configuring ports

You can set custom port for any application in the solution separately or using one command. To apply a new changes use restart command. Example:

```sh
tonos-se config --q-server-port 5000
tonos-se config --nginx-port 8082
tonos-se config --ton-node-port 55443
tonos-se config --arango-port 7433
tonos-se config --q-server-port 5000 --nginx-port 8082 --ton-node-port 55443 --arango-port 7433
tonos-se restart # to apply new changes
```

### Delete applications and data

Sometimes we want to reset settings or application to the default state. Use these commands to do that:

```sh
tonos-se reset # Delete only binary files without data and log files
tonos-se reset --hard # Delete binary and data files and reinstall applications
```

## How it works

### First start process

TONOS SE downloads an application pack for your operating system, unpack it to '.server' folder inside the CLI tool. Since that moment all necessary files like applications, configuration, data and log files will be placed here. And you can do deep configuring, backup or experiments if you want.

<img width="1014" alt="Screenshot 2021-03-17 at 15 05 50" src="https://user-images.githubusercontent.com/54890287/111464789-4f17b380-8732-11eb-8983-f012c24c2c59.png">

### Prepare application pack

To make the process of building fast and easy we use Github Actions and Workflow yml files to prepare three application packs for different operating systems: Linux, MacOS and Windows. A group of three application packs is called release. An application pack is a tar.gz archive that contains different application and configuration files for them like:

- nginx
- arangodb
- q-server
- ton node

<img width="1171" alt="Screenshot 2021-03-17 at 15 13 51" src="https://user-images.githubusercontent.com/54890287/111465671-715e0100-8733-11eb-8e9b-029bde427b93.png">

> Note: release has the same version of ton node's version available releases published.

### How to build custom application pack

It is possible to use custom versions or default config files of any application inside the application pack. Just fork [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries), enable GitHub actions. And apply your changes.

<img width="891" alt="Screenshot 2021-03-19 at 13 17 38" src="https://user-images.githubusercontent.com/54890287/111765582-967a7d00-88b5-11eb-82ec-6fae3902210c.png">

The Magic of creating applications pack is described in main.yml workflow file. Feel free to read the documentation about a structure and details on the main page [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries).

### Use custom application pack

After you create and test your own application pack time to use it. Follow Releases page and download tar.gz archive for your Operating System. Then put the archive in **.cache** folder. Replace the file if necessary and use reset command to start using your own application pack.
