const fs = require('fs')
const os = require('os')
const path = require('path')

// I prefer wrapping it in a function, but it's not required
function writeRegistryFile() {
  // Resolve the path of .npmrc
  const npmrc = path.resolve(process.cwd(), '.npmrc')

  // Grab values from Environment variables (highly recommended)
  const registryUrl = String(process.env.REGISTRY_URL)
  const scope = String(process.env.GITHUB_SCOPE)

  // Output the values (helps with debugging)
  console.log('npmrc: ', npmrc)
  console.log('registry url: ', registryUrl)
  console.log('scope: ', scope)

  // NPM_TOKEN always lives in the environment variables, but it's handled by NPM
  const authString =
    registryUrl.replace(/(^\w+:|^)/, '') +
    `:_authToken=${process.env.NPM_TOKEN}`
  const registryString = `${scope}:registry=${registryUrl}`

  const contents = `${registryString}${os.EOL}${authString}${os.EOL}`

  fs.writeFileSync(npmrc, contents)
}

// Execute code :)
writeRegistryFile()
