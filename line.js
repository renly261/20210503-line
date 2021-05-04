// 引用套件
import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import cheerio from 'cheerio'
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
    try {
      // 抓搜尋結果的網站
      const response = await axios.get('https://ani.gamer.com.tw/search.php?kw=%E5%B7%A8%E4%BA%BA')
      const $ = cheerio.load(response.data)

      // .old_list 裡面的 .theme-list-block 裡面的 a 標籤 全部
      $('.old_list .theme-list-block a').each(async function () {
        // 網址
        console.log('https://ani.gamer.com.tw/' + $(this).attr('href'))

        // 抓全部 a 標籤裡圖片的 src 屬性
        console.log($(this).find('.theme-img').attr('src'))

        // 抓全部 a 標籤裡的名稱
        console.log($(this).find('.theme-name').text())

        // 抓全部 a 標籤裡的日期
        console.log($(this).find('.theme-time').text())

        const response1 = await axios.get('https://ani.gamer.com.tw/' + $(this).attr('href'))
        const $1 = cheerio.load(response1.data)
        $1('.container-player').each(function () {
          console.log($1(this).find('.data_type').find('li').eq(0).text())
          console.log($1(this).find('.data_type').find('li').eq(4).text())
          console.log($1(this).find('.ACG-box'))
        })
        const name = $(this)
          .find('.theme-name')
          .text()
          .filter(name => {
            return name['巨人'] === event.message.text
          })
        let reply = ''
        for (const n of name) {
          reply += `作品名稱:${n}}`
        }

        event.reply(reply)
      })
    } catch (error) {
      console.log(error)
      event.reply('發生錯誤')
    }
  }
})
