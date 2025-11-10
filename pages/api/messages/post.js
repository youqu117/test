import { connectToDatabase } from '../../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '仅支持POST请求' })
  }

  try {
    const { content, author } = req.body
    
    if (!content) {
      return res.status(400).json({ message: '留言内容不能为空' })
    }

    const { db } = await connectToDatabase()
    
    const result = await db.collection('messages').insertOne({
      content,
      author: author || '匿名用户',
      createdAt: new Date()
    })
    
    res.status(201).json({ 
      message: '留言成功',
      id: result.insertedId 
    })
  } catch (error) {
    console.error('留言失败:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}