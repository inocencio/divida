const axios = require('axios').default
const ObjectID = require('mongodb').ObjectID
const Debt = appRequire('/model/v1/Debt')
const Joi = require('Joi')
const moment = require('moment')

module.exports.validateDebt = function(debt, validateUser) {
  let keys = {
    reason: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.base': `O Motivo tem que ser um texto`,
        'string.min': `O Motivo tem que ter o mínimo de 6 caracteres`,
        'string.empty': `É necessário preencher o Motivo`,
        'any.required': `É necessário preencher um Motivo`
      }),
    value: Joi.number()
      .required()
      .min(50)
      .messages({
        'number.base': `O Valor tem que ser um número`,
        'number.min': `O Valor mínimo é de R$ 50,00`,
        'any.required': `É necessário preencher um Valor`
      }),
    date: Joi.date()
      .required()
      .min('now')
      .messages({
        'date.base' : `A Data informada é inválida`,
        'date.min' : `A Data não pode ser anterior a Data atual`,
        'any.required' : `É necessário preencher uma Data`
      })
  }

  if (validateUser)
    keys.userID = Joi.number()
    .min(1)
    .max(10)
    .required()
    .messages({
      'number.base': `O Nome do Usuário deve ser informado`,
      'number.min': `O usuário não pôde ser encontrado`,
      'number.max': `O usuário não pôde ser encontrado`,
      'any.required': `É necessário preencher um Nome`
    })

  const schema = Joi.object().keys(keys).options({
    abortEarly: false,
    convert: true
  })

  const { error, result } = schema.validate(debt)
  return {
    error: (error ? error.details : null),
    result: result
  }
}

/**
 * Cria uma instância de Dívida com o ID do usuário obtido pelo JSONPlaceholder.
 * @param {string} userID - ID do usuário que será usado para obter os seus detalhes em JSONPlaceholder
 * @param {string} reason - motivo da dívida
 * @param {number} value - valor de cobrança da dívida
 * @param {string} date - data de expiração.
 */
module.exports.create = function(userID, reason, value, date, callback) {
  try {
    const model = {
      userID: userID,
      reason: reason,
      value: value,
      date: moment(date, 'DD/MM/YYYY', true).format()
    }

    //valida o model
    const result = this.validateDebt(model, true)

    //temos que retornar o erro para o client, se houver
    if (result.error)
      return callback({ status: 'FAIL',  error: result.error })

    //cria o modelo no formado do MongoDB
    let debt = new Debt(model)

    //salva
    debt.save()
    axios.get(`https://jsonplaceholder.typicode.com/users/${debt.userID}`).then(response => {
      if (response && response.data) {
        const user = response.data

        callback({
          message: 'OK',
          content: {
            _id: debt._id,
            userID: user.id,
            name: user.name,
            reason: debt.reason,
            date: debt.date,
            value: debt.value
          }
        })
      } else {
        callback({ status: 'NOTFOUND', error: 'User not found!' })
      }
    })
  } catch(err) {
    console.error(err)
    callback({ status: 'FAIL', error: err.message })
  }
}

/**
 * Lê uma instância de Dívida no banco de dados e junta com o usuário correspondente de JSONPlaceHolder.
 * @param {string} debtID - ID da instância de dívida no banco de dados
 * @param {function} callback - retorna um JSON a instância de Dívida formatada
 */
module.exports.read = function(debtID, callback) {
  try {
    Debt.findOne({ _id: ObjectID(debtID) }, function(err, debt) {
      if (debt) {
        axios.get(`https://jsonplaceholder.typicode.com/users/${debt.userID}`).then(response => {
          if (response && response.data) {
            const user = response.data

            callback({
              message: 'OK',
              content: {
                _id: debtID,
                userID: user.id,
                name: user.name,
                reason: debt.reason,
                date: moment(debt.date).format('DD/MM/YYYY'),
                value: debt.value
              }
            })
          } else {
            callback({ status: 'NOTFOUND', error: 'User not found!' })
          }
        })
      } else {
        callback({ status: 'NOTFOUND', error: 'Debt not found!' })
      }
    })
  } catch(err) {
    console.error(err)
    callback({ status: 'FAIL', error: err.message })
  }
}

/**
 * Lê todas as dívidas
 * @param {function} callback - retorna um JSON como resultado
 */
module.exports.readAll = function(callback) {
  try {
    //pega todos os usuários de JSONPlaceHolder.
    axios.get('https://jsonplaceholder.typicode.com/users/').then(response => {
      if (response && response.data) {
        const users = response.data

        Debt.find({}).exec(function(err, docs) {
          if (err) {
            return callback({ message: 'FAIL', error: err })
          }

          let debts = []

          //faz o 'join' com os dados das dívidas cadastradas
          docs.forEach(debt => {
            const user = users.find(e => e.id === debt.userID)

            debts.push({
              _id: debt._id,
              userID: user.id,
              name: user.name,
              reason: debt.reason,
              date: debt.date,
              value: debt.value
            })
          });

          callback({ message: 'ok', content: debts })
        })
      } else {
        callback({ status: 'NOTFOUND', error: 'Debts not found!' })
      }
    })
  } catch(err) {
    console.error(err)
    callback({ status: 'FAIL', error: err.message })
  }
}

/**
 * Atualiza uma instância de Dívida no banco de dados através da ID da mesma.
 * @param {string} debtID
 * @param {string} reason
 * @param {number} value
 * @param {string} date
 * @param {function} callback
 */
module.exports.update = function(debtID, reason, value, date, callback) {
  try {
    const model = {
      reason: reason,
      value: value,
      date: moment(date, 'DD/MM/YYYY', true).format()
    }

    const result = this.validateDebt(model, false)

    if (result.error)
      return callback({ status: 'FAIL',  error: result.error })

    //atualiza no banco
    Debt.findByIdAndUpdate(ObjectID(debtID), model, { new: true, useFindAndModify: false }, function(err, result) {
      if (err)
        return callback({ message: 'FAIL', error: err})

      callback({ message: 'OK', content: result })
    })
  } catch(err) {
    console.error(err)
    return { status: 'FAIL', error: err.message }
  }
}

/**
 * Deleta uma instância de Dívida no banco de dados.
 * @param {string} id - id da vídida no banco de dados
 * @param {function} callback - retorna um JSON como resultado
 */
module.exports.delete = function(id, callback) {
  try {
    Debt.findByIdAndDelete(ObjectID(id), function(err) {
      if (err)
        return callback({ message: 'FAIL', error: err })

      callback({ message: 'OK' })
    })
  } catch(err) {
    console.error(err)
    return { status: 'FAIL', error: err.message }
  }
}