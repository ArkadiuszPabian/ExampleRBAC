const { execSync, spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

async function runMkcert() {
  try {
    // Step 1: Install the local CA if needed
    console.log('Checking mkcert CA installation...')
    const installResult = spawnSync('mkcert', ['-install'], {
      encoding: 'utf-8',
    })
    if (installResult.error) {
      throw installResult.error
    }
    if (installResult.stderr) {
      console.error(installResult.stderr)
    }
    console.log(installResult.stdout)

    // Step 2: Generate certs for localhost, 127.0.0.1, ::1
    const outputDir = path.resolve(__dirname, '..', 'ssl')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir)
    }
    console.log(`Generating certs in ${outputDir}`)

    // mkcert outputs files like localhost+2.pem, localhost+2-key.pem
    spawnSync(
      'mkcert',
      [
        '-key-file',
        path.join(outputDir, 'server.key'),
        '-cert-file',
        path.join(outputDir, 'server.cert'),
        'localhost',
        '127.0.0.1',
        '::1',
      ],
      { stdio: 'inherit' }
    )

    // Step 3: Get CA root directory and path to rootCA.pem
    const caRoot = execSync('mkcert -CAROOT').toString().trim()
    const caPath = path.join(caRoot, 'rootCA.pem')

    if (!fs.existsSync(caPath)) {
      throw new Error(`CA cert not found at expected path: ${caPath}`)
    }

    // Set dotenv file for e2e script
    const dotEnv = path.join(__dirname, '..', '.env.e2e')
    fs.writeFileSync(dotEnv, `NODE_EXTRA_CA_CERTS=${caPath}`)

    console.log('\nAll done!')
  } catch (err) {
    console.error('Error during mkcert automation:', err)
    process.exit(1)
  }
}

runMkcert()
