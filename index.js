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
  // 若你傳的是文字
  if (event.message.type === 'text') {
    try {
      // 第一層 抓搜尋結果的網站
      const response = await axios.get(`https://ani.gamer.com.tw/search.php?kw=${encodeURI(event.message.text)}`)
      let $ = cheerio.load(response.data)

      // 第二層 搜尋結果裡各別的網址陣列 用陣列存著的話就可以把 function 裡的資料帶出外面
      const links = []

      // 資料 陣列

      // 用迴圈跑陣列的所有資料
      // let reply1 = ''
      //   let reply2 = ''
      //   let reply3 = ''
      //   let reply4 = ''
      //   let reply5 = ''

      //   第一層 搜尋結果的網站的資料 .old_list 裡面的 .theme-list-block 裡面的 a 標籤 全部-----------------------------------
      $('.old_list .theme-list-block a').each(function () {
        // 搜尋結果的每個動畫網址 抓全部 a 標籤裡圖片的 href 屬性
        // console.log('https://ani.gamer.com.tw/' + $(this).attr('href'))

        // 搜尋結果的每個動畫圖片 抓全部 a 標籤裡圖片的 src 屬性
        // console.log($(this).find('.theme-img').attr('src'))
        // arr1.push($(this).find('.theme-img').attr('src'))
        // reply1 += $(this).find('.theme-img').attr('src') + '\n'
        // 搜尋結果的每個動畫名稱 抓全部 a 標籤裡的名稱
        // console.log($(this).find('.theme-name').text())
        // arr2.push($(this).find('.theme-name').text())
        // reply2 += $(this).find('.theme-name').text() + '\n'
        // 搜尋結果的每個動畫日期 抓全部 a 標籤裡的日期
        // console.log($(this).find('.theme-time').text())
        // arr3.push($(this).find('.theme-time').text())
        // reply3 += $(this).find('.theme-time').text() + '\n'
        // 抓第一層搜尋結果的每個動畫網址 塞進 links 的空陣列
        links.push('https://ani.gamer.com.tw/' + $(this).attr('href'))
      })

      //   each() 裡 async await 無效 第一層資料還沒出來就會跑第二層了
      //   因為 each() 裡 async await 無效 所以用 for 迴圈先把所有網址先跑出來在抓資料
      for (const link of links) {
        //  用迴圈跑第一層第一層搜尋結果的每個動畫網址 再去抓資料
        const response = await axios.get(link)
        $ = cheerio.load(response.data)
        // 第二層 搜尋結果的每個動畫資料 .container-player裡的全部--------------------------------------------------------
        $('.container-player').each(function () {
          // 作品類型
          // console.log($(this).find('.data_type li').eq(0).text())
          //   reply4 += $(this).find('.data_type li').eq(0).text() + '\n'
          // 製作廠商
          // console.log($(this).find('.data_type li').eq(4).text())
          //   reply5 += $(this).find('.data_type li').eq(4).text() + '\n'
          // 動畫評分
          // console.log($(this).find('.data_acgbox'))
        })
      }
      const reply = {
        type: 'text',
        text: 'Hello, I am Cony!!',
        sender: {
          name: 'Cony',
          iconUrl: 'https://line.me/conyprof'
        }
      }
      event.reply(reply)
      console.log(reply)
    } catch (error) {
      event.reply('查不到')
    }
  }
})
