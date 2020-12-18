const router = require('express').Router()
const debtAPI = appRequire('/controller/v1/debt')
const userAPI = appRequire('/controller/v1/user')

/**
 * Lê uma lista de usuários do JSONPlaceHolder
 * Endpoint: Read
 */
router.get('/users', (req, res) => {
  try {
    userAPI.readAll(function (result) {
      res.send(result)
    })

  } catch (err) {
    console.log('#Error -> Unable to read a User')
    console.error(err)
    res.status(500).json( { message: 'InternalError', error : 500 } )
  }
})

/**
 * Pesquisa um usuário através do nome.
 * Endpoint: Search
 */
router.get('/user/:username', (req, res) => {
  try {
    const { username } = req.params

    userAPI.read(username, function (result) {
      res.send(result)
    })

  } catch (err) {
    console.log('#Error -> Unable to read a User')
    console.error(err)
    res.status(500).json( { message: 'InternalError', error : 500 } )
  }
})

/**
 * Cria uma instância de Dívida com base nos dadados do Motivo, Valor e Data da dívida e Usuário do JSONPlaceholder.
 * Endpoint: Create
 */
router.post('/debt/', (req, res) => {
  try {
    const { userID, reason, value, date } = req.body

    debtAPI.create(userID, reason, value, date, function (result) {
      res.send(result)
    })

  } catch (err) {
    console.log('#Error -> Unable to to add new debt.')
    console.error(err)
    res.status(500).json( { message: 'InternalError', error : 500 } )
  }
})

/**
 * Lê uma lista de dívidas.
 * Endpoint: Read
 */
router.get('/debts/', (req, res) => {
  try {

    debtAPI.readAll(result => {
      res.send(result)
    })

  } catch (err) {
    console.log('#Error -> Unable to to read debts.')
    console.error(err)
    res.status(500).json( { message: 'InternalError', error : 500 } )
  }
})

/**
 * Lê uma instância de dívida do banco de dados.
 * Endpoint: Read
 */
router.get('/debt/:id', (req, res) => {
  try {
    const { id } = req.params

    debtAPI.read(id, function (result) {
      res.send(result)
    })
  } catch (err) {
    console.log('#Error -> Unable to retrieve a debt from its ID.')
    console.error(err)
    res.status(500).json( { message: 'InternalError', error : 500 } )
  }
})

/**
 * Atualiza uma instância de Dívida com base nos dadados do Motivo, Valor e Data da dívida.
 * Endpoint: Update
 */
router.patch('/debt/', (req, res) => {
  try {
    const { _id, reason, value, date } = req.body

    debtAPI.update(_id, reason, value, date, function(result) {
      res.send(result)
    })
  } catch (err) {
    console.log('#Error -> Unable to update a debt.')
    console.error(err)
    res.status(500).json( { message: 'InternalError', error : 500 } )
  }
})

/**
 * Cria uma instância de Dívida com base nos dadados do Motivo, Valor e Data da dívida e Usuário do JSONPlaceholder.
 * Endpoint: Delete
 */
router.delete('/debt/:id', (req, res) => {
  try {
    debtAPI.delete(req.params.id, function(result) {
      res.send(result)
    })

  } catch (err) {
    console.log('#Error -> Unable to update a debt.')
    console.error(err)
    res.status(500).json( { message: 'InternalError', error : 500 } )
  }
})

module.exports = router