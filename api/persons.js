import { connectToDatabase } from './mongodb';

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('persons');

    switch (req.method) {
      case 'GET':
        // 获取所有人员信息
        const persons = await collection.find({}).sort({ createdAt: -1 }).toArray();
        res.status(200).json({ success: true, data: persons });
        break;

      case 'POST':
        // 创建新人员信息
        const personData = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const result = await collection.insertOne(personData);
        res.status(201).json({ 
          success: true, 
          message: '个人信息添加成功', 
          data: { id: result.insertedId, ...personData } 
        });
        break;

      case 'PUT':
        // 更新人员信息
        const { id, ...updateData } = req.body;
        updateData.updatedAt = new Date();
        
        const updateResult = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        
        if (updateResult.matchedCount === 0) {
          res.status(404).json({ success: false, message: '未找到该人员信息' });
        } else {
          res.status(200).json({ success: true, message: '信息更新成功' });
        }
        break;

      case 'DELETE':
        // 删除人员信息
        const deleteResult = await collection.deleteOne({ 
          _id: new ObjectId(req.body.id) 
        });
        
        if (deleteResult.deletedCount === 0) {
          res.status(404).json({ success: false, message: '未找到该人员信息' });
        } else {
          res.status(200).json({ success: true, message: '信息删除成功' });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ success: false, message: `方法 ${req.method} 不被允许` });
    }
  } catch (error) {
    console.error('API错误:', error);
    
    if (error.code === 11000) {
      res.status(400).json({ 
        success: false, 
        message: 'QQ号、微信号或手机号已存在' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: '服务器内部错误' 
      });
    }
  }
}