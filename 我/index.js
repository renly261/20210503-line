// 引用套件
import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
// import cheerio from 'cheerio'
// import js from 'js'

// 讀套件讀取 .env 檔案
// 讀取後可以用 process.env.變數 使用
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

// 監聽進來 3000 的請求 後方可以接 function
bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

// 機器人要做的事情
bot.on('message', async event => {
  if (event.message.type === 'text') {
    // 你傳什麼文字機器人就回傳什麼文字
    // event.reply(event.message.text)

    try {
      // 抓資料
      const response = await axios.get('https://datacenter.taichung.gov.tw/swagger/OpenData/f116d1db-56f7-4984-bad8-c82e383765c0')

      const data = response.data.filter(data => {
        return data['花種'] === event.message.text
      })

      // line 機器人回傳東西
      let reply = ''
      for (const d of data) {
        reply += `地點:${d['地點']}\n地址:${d['地址']} \n觀賞時期:${d['觀賞時期']}\n\n`
      }
      event.reply(reply)
    } catch (error) {
      event.reply('發生錯誤')
    }
  }
})
