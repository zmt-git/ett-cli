#! /usr/bin/env node
const { program } = require('commander')

// 创建命令
program.command('create <app-name>')
  .description('create a project')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, option) => {
    require('./create')(name, option)
  })

// 配置版本
program.version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

// 解析输入
program.parse(process.argv)

// 监听--help
program.on('--help', () => {
  console.log(`\r\nRun ${chalk.cyan(`express-ts-typeorm <command> --help`)} for detailed usage of given command\r\n`)
})
