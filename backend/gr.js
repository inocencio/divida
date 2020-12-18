//make a custom require() that uses absolute path to avoid ugly paths like ../../.. and so on
module.exports.global_require = function() {
  global.appRequire = name => require(`${__dirname}/${name}`)
}

