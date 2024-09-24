# Template Manager

<div align="center">
  <img src="./public/icon.png" alt="Template Manager Icon" width="400" height="400">
</div>

## Introduction

Template Manager is a command-line tool that helps you manage templates for your projects. It allows you to add, list, and remove templates from your template repository.

## Why Template Manager?

Feel tired of managing templates in different places? 😩📂

Template Manager can help you manage templates in a single git repository, and you can manage all your templates in a single place.

## Features

- 📂 Manage templates in a single git repository.
- 📂 Easy to add, list, remove, update templates.
- 🌐 Open templates in the browser quickly.
- 🚀 Create new projects from templates with a single command.
- 🔄 Pull templates from the remote repository to your local.

## Installation

### Install the template manager
```bash
npm install -g template-manager
```

### Initialize a new templates repository
```bash
tm init
```
Template manager will prompt you to enter the template repository URL, and then create two files: `template.json` and `README.md` in the repository. Which are neccessary for the template manager to work. When you try to add or update a template, template manager will update the `template.json` file and list the template in `README.md`.

If you already have a templates repository, you can skip the initialization step. But you need to:
  1. create a Env variable named `TM_REPO_GIT` with the value as your templates repository URL.
  2. create a `template.json` file in the repository, with the following content:
```json
[
  {
    "name": "template-name",
    "path": "template-path"
  }
]
```
  3. create a `README.md` file in the repository, with a placeholder for the templates list(`<!-- tm-list-start -->` and `<!-- tm-list-end -->`). For example:
```md
# My Templates Repository

## List
<!-- tm-list-start -->

<!-- tm-list-end -->
```

### Add a new template
```bash
tm add template-name template-path
```

### List all templates
```bash
tm list
```
### Other commands

You can use `tm -h` to get the help information for each command. Which are also listed below.

## Usage

```bash
Usage: tm [options] [command]

A CLI tool to manage your project templates.

Options:
  -v, --version          display the version number
  -h, --help             display help for command

Commands:
  init                   Initialize a new templates repository to manage templates.
  add <template> <path>  Add a new template.
  list|ls [options]      List all available templates from your template repository, will be cached for 1 hour.
                         You can use -f to force to get templates from the template repository.
  set <template> <path>  Update a template to a path.
  remove|rm [template]   Remove a template.
  open                   Choose a template to open in the browser.
  create                 Choose a template to create a new project, all the git history will be removed.
  pull                   Pull a template from the remote repository, all the git history will be preserved.
  help [command]         display help for command
```

## License

[MIT](./LICENSE) License © 2024-PRESENT [DonovanYe](https://github.com/Donovan-Ye)
