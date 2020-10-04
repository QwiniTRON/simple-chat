if(process.env.NODE_ENV === 'production'){
  module.exports = require('./propduction')
} else {
  module.exports = require('./development')
}