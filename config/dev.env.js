var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseURI: '"http://127.0.0.1:8081/"',
  checkVersion: "'2.9.0'",
  //baseURI: '"https://lib.muchcharm.com/"',
  // baseURI: '"https://mtms.letsit.vip/api"'
})
