const selfsigned = require('selfsigned')
const fs = require('fs')

const attrs = [{ name: 'commonName', value: 'localhost' }]
const options = {
  days: 365,
  keySize: 2048,
  algorithm: 'sha256',
  extensions: [{ name: 'basicConstraints', cA: true }],
}

const pems = selfsigned.generate(attrs, options)

// Write cert and key to files
fs.writeFileSync('ssl/server.cert', pems.cert)
fs.writeFileSync('ssl/server.key', pems.private)

console.log('Self-signed cert and key generated!')
