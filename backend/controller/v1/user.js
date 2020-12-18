const axios = require('axios').default

/**
 * userList e retrieveUserList usados internamentes para pegar dados do JSONPlaceholder.
 */
module.exports.userList = Array()
module.exports.retrieveUserList = function(callback) {
  try {
    let userList = this.userList

    if (userList.length === 0) {
      //lista vazia, pega todos os usuários
      axios.get('https://jsonplaceholder.typicode.com/users').then(response => {
        if (response && response.data) {

          response.data.forEach(e => {
            userList.push({ id: e.id, name: e.name })
          })

          //mantêm em memória a lista de usuários
          this.userList = userList

          return callback({ message: 'OK', content: userList })
        } else {
          callback({ status: 'NOTFOUND', error: 'Users not found!' })
        }
      })
    } else {
      //não há necessidade de fazer uma request, pega da lista em memória
      callback({ message: 'OK', content: this.userList })
    }
  } catch(err) {
    callback({ status: 'FAIL', error: err.message })
  }
}

/**
 * Lê uma lista de usuários do JSONPlaceholder. Como essa lista é fixa, não há necessidade de sempre fazer
 * uma request ao servidor original e, uma vez carregada, os dados sempre serão pegos da memória.
 * @param {function} callback - retorna um JSON com uma lista de usuários
 */
module.exports.readAll = function(callback) {
  try {
    this.retrieveUserList(function(result) {
      callback(result)
    })
  } catch(err) {
    callback({ status: 'FAIL', error: err.message })
  }
}

/**
 * Lê um usuário com base no nome a ser pesquisado.
 * @param {string} username - nome ou fragmento dele a ser pesquisado
 * @param {function} callback - retorna um JSON os usuários encontrados
 */
module.exports.read = function(username, callback) {
  try {
    this.retrieveUserList(function(result) {
      let users = []

      result.content.forEach(e => {
        if (e.name.toLowerCase().search(username.trim().toLowerCase()) > -1)
          users.push(e)
      })

      callback({ message: 'OK', content: users })
    })
  } catch(err) {
    callback({ status: 'FAIL', error: err.message })
  }
}