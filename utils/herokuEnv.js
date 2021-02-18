const dotenv = require('dotenv')
const { parsed } = dotenv.config({ path: './../server/.env' })
const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function setEnvVars(variables) {
  for await (const variable of variables) {
    const { stdout, stderr } = await exec(
      `heroku config:set ${variable[0]}=${variable[1]}`
    )
    console.log('stdout:', stdout)
    console.log('stderr:', stderr)
  }
}
for (const envs in parsed) {
  if (envs === 'DATABASE_URL') {
    continue
  } else if (envs === 'NODE_ENV') {
    parsed[envs] = 'production'
  }
  setEnvVars([[envs, parsed[envs]]])
}
