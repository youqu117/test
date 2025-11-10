import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = 'messageboard'

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('请定义MONGODB_URI环境变量')
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  const db = client.db(MONGODB_DB)
  return { client, db }
}