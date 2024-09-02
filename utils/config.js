require('dotenv').config()

PORT = process.env.PORT || 3001
if(process.env.NODE_ENV !== 'test')  MONGO_URI = process.env.MONGO_URI
else                                MONGO_URI = process.env.TEST_MONGO_URI                        

module.exports= {
    PORT, MONGO_URI
}
