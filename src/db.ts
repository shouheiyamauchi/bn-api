import mongoose from 'mongoose'

mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true
})
