# Corioders CLI

CLI for creating vue and vanilla javascript projects with our **[templates](https://github.com/corioders-templates)**.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [node.js](https://nodejs.org/en/download/)
- You have installed [yarn](https://classic.yarnpkg.com/en/docs/install)
- You have installed [go](https://golang.org/dl/)

## Setup

```bash
# install using yarn
yarn global add @corioders/cli

# install using npm
npm i -g @corioders/cli
```

## Usage overview

```bash
# create a new project
corioders create

# install dependecies
corioders install

# run your project
corioders run

# update the template to the newest version
corioders update
```

### Usage - create command

```bash
# create a new project
corioders create

# shorter version
corioders c
```

### Usage - run command

```bash
# run your project
corioders run

# shorter version
corioders r

# run the app directory
corioders run -a

# run the server directory
corioders run -s

# run the app & the server directory
corioders run -b
```

### Usage - install command

```bash
# install dependencies
corioders install

# shorter version
corioders i

# install dependencies in the app directory
corioders install -a

# install dependencies in the server directory
corioders install -s

# install dependencies in the app & the server directory
corioders install -b
```

### Usage - update command

```bash
# update the template to the newest version
corioders update

# shorter version
corioders u
```
