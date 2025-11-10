import { useState, useEffect } from 'react'

export default function Home() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // 获取留言列表
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages/get')
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('获取留言失败:', error)
    }
  }

  // 发布留言
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/messages/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          author: '访客' // 简化版本，先不做用户系统
        }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages() // 刷新留言列表
      }
    } catch (error) {
      console.error('发布留言失败:', error)
    }
    setLoading(false)
  }

  // 页面加载时获取留言
  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h1>📝 简易留言板</h1>
      
      {/* 发布留言表单 */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="写下你想说的话..."
          style={{
            width: '100%',
            height: '100px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            resize: 'vertical',
            fontSize: '16px'
          }}
        />
        <button 
          type="submit"
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            background: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? '发布中...' : '发布留言'}
        </button>
      </form>

      {/* 留言列表 */}
      <div>
        <h2>最新留言 ({messages.length})</h2>
        {messages.length === 0 ? (
          <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            还没有留言，快来第一个发言吧！✨
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              style={{
                border: '1px solid #e0e0e0',
                padding: '15px',
                margin: '15px 0',
                borderRadius: '12px',
                background: '#fafafa',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <p style={{ 
                margin: '0 0 10px 0', 
                fontSize: '16px',
                lineHeight: '1.5'
              }}>
                {message.content}
              </p>
              <div style={{ 
                fontSize: '14px', 
                color: '#666',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>👤 {message.author}</span>
                <span>⏰ {new Date(message.createdAt).toLocaleString('zh-CN')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}