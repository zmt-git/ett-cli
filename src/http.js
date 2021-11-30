const axios = require('axios')

const user = 'zmt-github'

axios.interceptors.response.use(res => {
  return res.data
})

async function  getTagList(repo) {
  return axios.get(`https://api.github.com/repos/${user}/${repo}/tags`)
}


async function getRepoList() {
  return axios.get(`https://api.github.com/users/${user}/repos`)
}

module.exports = {
  getTagList,
  getRepoList,
  user
}
