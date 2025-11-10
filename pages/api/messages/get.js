import { connectToDatabase } from '../../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '仅支持GET请求' })
  }

  try {
    const { db } = await connectToDatabase()
    
    const messages = await db
      .collection('messages')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()
    
    res.status(200).json(messages)
  } catch (error) {
    console.error('获取留言失败:', error)
    res.status(500).json({ message: '获取留言失败' })
  }
}