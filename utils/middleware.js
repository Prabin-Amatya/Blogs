const logger = require('../utils/logger')

const errorHandler = (error, request, response, next) =>
{
  logger.error(error)
  if(error.name === 'CastError')
    return response.status(400).send({ error:'Malformatted Id' })
  else if(error.name === 'ValidationError'){
    const message = error.errors
    const message_array = [message.name.message, message.number.message]
    return response.status(400).json({ error: message_array })
  }
  else if(error.name == "MongoServerError" && error.message.includes('E11000 duplicate key error'))
  {
    return response.status(400).json({error: "expected 'username' to be unique"})
  }
  else if(error.name == "JsonWebTokenError")
  {
    return response.status(401).json({error: "token invalid"})
  }
  else if(error.name == "TokenExpiredError")
  {
    return response.status(401).json({error: "token expired"})
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Endpoint Doesn\'t Exist' })
}

module.exports = {
    unknownEndpoint, errorHandler
}