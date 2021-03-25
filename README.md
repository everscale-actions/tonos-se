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
- Automatically updates
- Sentry integration

## Installation

Our package requires [Node.js](https://nodejs.org/) v14+ to run. Also Ton Node depends on libssl >= 1.1. Please take care of the installation required tools and last updates for your Operating System.

### Requirements

#### Windows

Install last updates and VC++ Runtime on Windows. Download and install it you can from the [latest supported Visual C++](https://support.microsoft.com/en-us/topic/the-latest-supported-visual-c-downloads-2647da03-1eea-4433-9aff-95f26a218cc0) page.

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

#### MacOS or Linux Based Distributions

The first time you try to install a package globally using npm, using the syntax npm install -g <package> on a Mac, or Linux, you might get a weird error, saying something like "Missing write access to /usr/local/lib/node_modules or /usr/local/bin". You can use [official guide to resolve the problem](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally) or just grant permissions to the folders

```sh

# Mac OS
sudo chown -R $USER /usr/local/lib/node_modules
sudo chown -R $USER /usr/local/bin
```

### Manual installation

```sh
git clone https://github.com/ton-actions/tonos-se
cd tonos-se
npm i -g
```

### Installation using global NPM package

```sh
npm install -g tonos-se
```

## Usage

We created easy to use application. So here are a few native commands you needed.

### First start

Before start tonos-se checks available versions for updating using hash sha256. In case it detects differences, tonos-se will download a new version of binary files and install it. So if a new version of binaries files is released, users will get a new version before the next start.

```sh
tonos-se start # Start all necessary applications
```

_tonos-se_ downloads an binary pack, unpacks it to '.server' folder inside the tool. Since that moment all files like applications, configuration, data and log files will be placed there. You can do deep configuring, backup or experiments if you want.

<img width="761" alt="Screenshot 2021-03-25 at 15 00 28" src="https://user-images.githubusercontent.com/54890287/112469751-e1dfd000-8d7a-11eb-840e-51fdd798a971.png">

### Basic commands

Use these commands to start, stop, restart and get status.

```sh
tonos-se start
tonos-se stop
tonos-se restart
tonos-se status
tonos-se help
```

To get current settings just run _config_ command

```sh
tonos-se config
```

<img width="761" alt="Screenshot 2021-03-25 at 16 19 18" src="https://user-images.githubusercontent.com/54890287/112479376-08efcf00-8d86-11eb-8fa8-9529a01649ef.png">

To get versions of applications, available tonos-se binary packs or other informations use _version_ command

```sh
tonos-se version
```

<img width="1066" alt="Screenshot 2021-03-25 at 12 31 45" src="https://user-images.githubusercontent.com/54890287/112451045-185f2000-8d66-11eb-9c43-e545b0009822.png">

### Configuring ports

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

Here is a real case when you might need to set custom ports. I have already run applications that are listening _tonos-se_’s default ports(8080, 4000, 40301, 3000, 8529). So I expected to get a warning at while start and a proposal to set others. And finally I want a run tests from https://github.com/tonlabs/ton-client-js

![render1616491093620](https://user-images.githubusercontent.com/54890287/112123185-149a9480-8bd2-11eb-8dd5-675cb7dd77dc.gif)

### Configuring usage version

> Warning: use this configuration parameter if you understand what you do

Be default _tonos-se_ uses latest version of TON OS SE binary application pack. But you might want to downgrade to previous version for testing something or may be do some experiments, etc. Available versions could be found here [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries). Use this command for setting up version you want.

```sh
# To display available versions use command
tonos-se version

# To change tonos-se versions use command
tonos-se config --tonos-se-version 0.25.0
```

When the next happens, _tonos-se_ will verify the checksum and do automatically soft upgrade/downgrade your current version. But be careful using downgrade. This may cause the TON OS SE to behave strangely. If something goes wrong use the commands below to fix a potential problem.

![render1616679986703-min](https://user-images.githubusercontent.com/54890287/112483378-02fbed00-8d8a-11eb-8a95-7f83e59af1c5.gif)

### Delete applications or data files

Sometimes you might want to reset settings to the default state. _tonos-se_ supports 2 methods like soft and hard state reset.

```sh
# Soft reset. Data and log files is not removed.
tonos-se reset

# Hard reset. Delete binary and data files and reinstall applications.
tonos-se reset --hard
```

## How it works

### Prepare application pack

To make the process of building fast and easy, we use Github Actions and GitHub Workflow for building all necessary binary application packs in [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries) repository. TonOS SE application pack is a tar.gz archive that contains applications (_Nginx_, _ArangoDB_, _Q Server_, _Ton Node_) and configuration files to quick start. The full list of application packs could be found [here](https://github.com/ton-actions/tonos-se-binaries/releases).

> Note: The major version of the CLI tool can use only the major version of binaries release. This approach allows us to ensure compatibility between the CLI tool and binary files. So if [TON OS Startup Edition](https://github.com/tonlabs/tonos-se) releases a new version that contains Postgres(for example), we will publish the next major version of binary files. And then we will publish a new major version of the CLI tool, which will be compatible only with the same major version of binary application packs.

### How to build custom application pack

It is possible to use custom versions or default config files of any application inside the application pack. Just fork [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries), enable GitHub actions. And apply your changes.

<img width="1340" alt="Screenshot 2021-03-24 at 22 19 22" src="https://user-images.githubusercontent.com/54890287/112374143-ccbf5e80-8cf2-11eb-998f-b82ecdc816a5.png">

The Magic of creating applications pack is described in main.yml workflow file. Feel free to read the documentation about a structure and details on the main page [ton-actions/tonos-se-binaries](https://github.com/ton-actions/tonos-se-binaries).

### Use custom application pack

After you create and test your own application pack time to use it. Change application pack's version or your GitHub repository.

```sh
tonos-se config --tonos-se-version 0.25.0
tonos-se config --github-binaries-repository example/example
```

## Known problems and FAQ

**Issue:** Subscribe for transactions with addresses (ABIv1) test fails on Windows.

**Answer:** We found out some strange behaviour while using ton-client-js's tests on Windows. We guess it could be connected with some internal node's problem. But we found a workaround. We created an [issue](https://github.com/tonlabs/tonos-se/issues/13) and opened a [pull request](https://github.com/tonlabs/ton-client-js/pull/206) to solve the problem.

##

**Issue:** tonos-se command not found after installation

**Answer:** You need to re-read bash profile. To solve the problem just open a new terminal window/tab.
