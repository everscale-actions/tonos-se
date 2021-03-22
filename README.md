[![CLI](https://github.com/ton-actions/tonos-se/actions/workflows/main.yml/badge.svg)](https://github.com/ton-actions/tonos-se/actions/workflows/main.yml)
[![Binaries](https://github.com/ton-actions/tonos-se-binaries/actions/workflows/main.yml/badge.svg)](https://github.com/ton-actions/tonos-se-binaries/actions/workflows/main.yml)

# TONOS SE

This solution provides standalone binary components and configuration files to start [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) for Linux, macOS, and Windows systems without Docker.

> [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) is a local blockchain that developer can run on their machine in one click. See the [TON Labs TON OS SE documentation](https://docs.ton.dev/86757ecb2/p/19d886-ton-os-se) for detailed information.

And also provides NPM Package for a quick run locally using CLI depends on your Operation System. The current solution consists of 2 repositories that solve a specific task.

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

### First start

```sh
tonos-se start # Start all necessary applications
```

TONOS SE downloads an application pack for your operating system, unpacks it to '.server' folder inside the CLI tool. Since that moment all files like applications, configuration, data and log files will be placed there. You can do deep configuring, backup or experiments if you want.

### Basic commands

Use these commands to start, stop, restart and get status.

```sh
tonos-se start
tonos-se stop
tonos-se restart
tonos-se status
```

![render1616362639311](https://user-images.githubusercontent.com/54890287/111921666-ce94e200-8aa6-11eb-935e-b8e89536adea.gif)

### Configuring ports

To get current configuration just run _config_ command without parameters.yml

```sh
tonos-se config
```

To set a custom port for any application in the solution separately or using one command. To apply new changes use _restart_ command.

> We strongly do not recommend you to use ports less than 1024. Some Operating Systems have limitations about it.

```sh
tonos-se config --nginx-port 8082 # Nginx
tonos-se config --q-server-port 5000 # Q Server
tonos-se config --ton-node-port 50400 # Ton Node
tonos-se config --ton-node-requests-port 7000 # Ton Node Kafka
tonos-se config --arango-port 7433 # Arango DB

# It is possible to set all parameters using one command
tonos-se config --q-server-port 5000 --nginx-port 8082 --ton-node-port 55443 --arango-port 7433 --ton-node-requests-port 7000

# To apply new changes
tonos-se restart
```

### Configuring usage version and repository

We thought it would be convenient to use as the same version for our application packs as ton-node. So after publishing a new version of application pack you might deside upgrade your current version to a new one. Available versions could be found here [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries)

```sh
tonos-se config --node-release 0.25.0
tonos-se config --release-url https://github.com/example/example/releases

# To apply new changes this command
tonos-se restart
```

### Delete applications or data files

Sometimes we want to reset settings or application to the default state. Use these commands to do that:

```sh
tonos-se reset # Delete only binary files without data and log files
tonos-se reset --hard # Delete binary and data files and reinstall applications
```

## How it works

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
