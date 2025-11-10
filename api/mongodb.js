import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://352806_db_user:541638gyk@cluster0.08bwkwj.mongodb.net/image?retryWrites=true&w=majority&appName=Cluster0";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const db = client.db("person_info_db");
    
    // 创建索引确保数据唯一性
    await db.collection('persons').createIndex({ qq: 1 }, { unique: true });
    await db.collection('persons').createIndex({ wechat: 1 }, { unique: true });
    await db.collection('persons').createIndex({ phone: 1 }, { unique: true });
    
    cachedClient = client;
    cachedDb = db;
    
    console.log("✅ 成功连接到MongoDB");
    return { client, db };
  } catch (error) {
    console.error("❌ 数据库连接失败:", error);
    throw error;
  }
}