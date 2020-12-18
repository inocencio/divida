const { readFileSync, writeFileSync, unlinkSync } = require('fs')

function envDB(dbName) {
  if (process.env.NODE_ENV === 'TEST') {
    return dbName + '_test.json'
  } else {
    return dbName + '.json'
  }
}

const db = {
  PRODUCTS: './data/products',
  PROMOTIONS: './data/promotions',
  fetchDB: (dbName) => {
    try {
      return JSON.parse(readFileSync(envDB(dbName)))
    } catch(err) {
      console.log('#Error -> It was unable to read from data json file.')
      console.error(err)
      return null
    }
  },
  saveDB: (dbName, data) => {
    try {
      writeFileSync(envDB(dbName), JSON.stringify(data, null, '\t'))
      return 'OK'
    } catch(err) {
      console.log('#Error -> It was unable to write to data json file.')
      console.error(err)
      return null
    }
  },
  deleteTestDB: (dbName) => {
    if (process.env.NODE_ENV === 'TEST') {
      try {
        unlinkSync(envDB(dbName))
      } catch(err) {
        console.log('#Error -> It was unable to delete a Test DB json file.')
      }
    }
  }
}

module.exports = db