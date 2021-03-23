[![CLI](https://github.com/ton-actions/tonos-se/actions/workflows/main.yml/badge.svg)](https://github.com/ton-actions/tonos-se/actions/workflows/main.yml)
[![Binaries](https://github.com/ton-actions/tonos-se-binaries/actions/workflows/main.yml/badge.svg)](https://github.com/ton-actions/tonos-se-binaries/actions/workflows/main.yml)

# TONOS SE

This solution provides standalone binary components and configuration files to start [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) for Linux, macOS, and Windows systems without Docker.

> [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) is a local blockchain that developer can run on their machine in one click. See the [TON Labs TON OS SE documentation](https://docs.ton.dev/86757ecb2/p/19d886-ton-os-se) for detailed information.

And also provides NPM Package for a quick run locally using CLI depends on your Operating System. The current solution consists of 2 repositories that solve a specific task.

- [ton-actions/tonos-se](https://github.com/ton-actions/tonos-se) - CLI tool for install and manage TONOS SE (NPM Package)
- [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries) - additional repository for generating application packs includes binaries and configuration files for different Operating Systems.

## Features

- Easy to install, configure and run
- Crossplatform support (Windows, Linux, MacOS)
- There is no need a Docker Engine, root permissions and WSL for Windows
- All components and files, configurations, and databases in a one place
- Easy create a custom build and application pack

## Installation

TONOS SE requires [Node.js](https://nodejs.org/) v12+ to run. Also Ton Node depends on libssl > 1.1. Please take care of the installation required tools and last updates for your Operating System.

### Requirements

#### Linux (Debian based)

```sh
sudo apt update && sudo apt install -y cmake pkg-config libssl-dev
```

#### Windows

Install last updates and VC++ Runtime on Windows. Download and install it you can from the [latest supported Visual C++](https://support.microsoft.com/en-us/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) page.

#### MacOS

TODO

### Manual installation

```sh
git clone https://github.com/ton-actions/tonos-se
cd tonos-se
npm i
npm i -g
```

### Installation using global NPM package

```sh
npm install -g tonos-se
```

## Usage

We created easy to use application. So here are a few native commands you needed.

### First start

```sh
tonos-se start # Start all necessary applications
```

TONOS SE downloads an application pack for your Operating System, unpacks it to '.server' folder inside the CLI tool. Since that moment all files like applications, configuration, data and log files will be placed there. You can do deep configuring, backup or experiments if you want.

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

> Warning: we strongly do not recommend you to use ports less than 1024. Some Operating Systems have restrictions about it.

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

Here is a real case when you might need to set custom ports. I have already run applications that are listening tonos-se’s default ports(8080, 4000, 40301, 3000, 8529). So I  expected to get a warning at while start and a proposal to set others. And finally I want a run tests from https://github.com/tonlabs/ton-client-js

![render1616491093620](https://user-images.githubusercontent.com/54890287/112123185-149a9480-8bd2-11eb-8dd5-675cb7dd77dc.gif)

### Configuring usage version

> Warning: use this configuration parameter if you understand what you do

We thought it would be convenient to use as the same version for our application packs as ton-node. So after publishing a new version of application pack you might deside upgrade your current version to a new one. Available versions could be found here [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries)

```sh
tonos-se config --node-release 0.25.0
```

### Delete applications or data files

Sometimes you might want to reset settings to the default state. Use these commands to do that:

```sh
# Delete binary files and reset configuration to the default state. Data and log files will not be removed.
tonos-se reset
# Delete binary and data files and reinstall applications
tonos-se reset --hard
```

## How it works

### Prepare application pack

To make the process of building fast and easy we use Github Actions and Workflow yml files to prepare three application packs for different operating systems: Linux, MacOS and Windows. A group of three application packs is called release. An application pack is a tar.gz archive that contains different application and configuration files for them like:

- Nginx
- ArangoDB
- Q Server
- Ton Node

<img width="1171" alt="Screenshot 2021-03-17 at 15 13 51" src="https://user-images.githubusercontent.com/54890287/111465671-715e0100-8733-11eb-8e9b-029bde427b93.png">

If new version is released, the tool will automatically detect a new version of application pack, download it and install.

> Note: release has the same version of ton node's version available releases published.

### How to build custom application pack

It is possible to use custom versions or default config files of any application inside the application pack. Just fork [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries), enable GitHub actions. And apply your changes.

<img width="891" alt="Screenshot 2021-03-19 at 13 17 38" src="https://user-images.githubusercontent.com/54890287/111765582-967a7d00-88b5-11eb-82ec-6fae3902210c.png">

The Magic of creating applications pack is described in main.yml workflow file. Feel free to read the documentation about a structure and details on the main page [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries).

### Use custom application pack

After you create and test your own application pack time to use it. Change application pack's version or your GitHub repository.

```sh
tonos-se config --node-release 0.25.0
tonos-se config --release-url example/example
```
