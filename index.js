import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import cheerio from 'cheerio'
import schedule from 'node-schedule'

let data = []

const getData = () => {
  axios.get('https://gis.taiwan.net.tw/XMLReleaseALL_public/scenic_spot_C_f.json')
    .then(response => {
      data = response.data.XML_Head.Infos.Info
    })
    .catch()
}

// 每天 0 點更新資料
schedule.scheduleJob('* * 0 * *', getData)
// 機器人啟動時也要有資料
getData()

// 讓套件讀取 .env 檔案
// 讀取後可以用 process.env.變數 使用
dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    const result = data.filter(d => {
      return d.Region === event.message.text
    })[0]
    event.reply({
      type: 'location',
      title: result.Name,
      address: result.Add,
      latitude: result.Py,
      longitude: result.Px
    })
  }
})
