const path = require('path')
const fs = require('fs-extra')
const Generator = require('./Generator')
const inquirer = require('inquirer')

module.exports = async function (name, options) {
  const cwd = process.cwd()

  const targetUrl = path.join(cwd, name)

  if (fs.existsSync(targetUrl)) {
    if (options.force) {
      fs.remove(targetUrl)
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite'
            },{
              name: 'Cancel',
              value: false
            }
          ]
        }
      ])

      if (!action) {
        return
      } else if (action === 'overwrite') {
        fs.remove(targetUrl)
      }
    }
  }

  const generator = new Generator(name, targetUrl)

  await generator.create()
}
