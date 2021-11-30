const ora = require('ora')
const inquirer = require('inquirer')
const { getRepoList, getTagList, user } = require('./http')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const chalk = require('chalk')

async function wrapLoading (fn, message, ...args) {
  const spinner = ora(message)

  spinner.start()

  try {
    const result = await fn(...args)

    spinner.succeed()

    return result
  } catch (e) {
    spinner.fail('Request failed, refetch ...')
    return null
  }
}

class Generator {
  constructor(name, targetUrl) {
    this.name = name
    this.targetUrl = targetUrl
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  async getRepo () {
    const reposList = await wrapLoading(getRepoList, 'waiting fetching repos')

    if (!reposList) return

    const repos = reposList.filter(item => item.name.includes('template-express'))

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project'
    })

    return repo
  }

  async getTag (repo) {
    const tags = await wrapLoading(getTagList, 'waiting fetching tags', repo)

    if (!tags) return

    const tagList = tags.map(item => item.name)

    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagList,
      message: 'Please choose a template to create project'
    })

    return tag
  }

  async download (repo, tag) {
    const requestUrl = `${user}/${repo}${tag ? '#' + tag : ''}`

    const res = await wrapLoading(this.downloadGitRepo, 'waiting download template', requestUrl, this.targetUrl)

    if (res !== null) {
      console.log(`cd ${chalk.green(this.name)}`)

      console.log(chalk.green('npm install | yarn'))

      console.log(chalk.green('npm run dev | yarn dev'))
    } else {
      console.log(chalk.red('download template failed'))
    }
  }

  async create () {
    const repo = await this.getRepo()

    if (!repo) return

    const tag = await this.getTag(repo)

    if (!tag) return

    await this.download(repo, tag)
  }
}

module.exports = Generator
