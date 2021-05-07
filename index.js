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

      // 用陣列存取 function 裡的資料就可以帶到外面
      const arr1 = []
      const arr2 = []
      const arr3 = []
      const arr4 = []
      let arr5 = []
      let arr6 = []
      let arr7 = []

      //   第一層 搜尋結果的網站的資料 .old_list 裡面的 .theme-list-block 裡面的 a 標籤 全部-----------------------------------
      $('.old_list .theme-list-block a').each(function () {
        // 搜尋結果的每個動畫網址 抓全部 a 標籤裡圖片的 href 屬性
        // console.log('https://ani.gamer.com.tw/' + $(this).attr('href'))
        arr1.push('https://ani.gamer.com.tw/' + $(this).attr('href'))
        // 搜尋結果的每個動畫圖片 抓全部 a 標籤裡圖片的 src 屬性
        // console.log($(this).find('.theme-img').attr('src'))
        arr2.push($(this).find('.theme-img').attr('src'))
        // 搜尋結果的每個動畫名稱 抓全部 a 標籤裡的名稱
        // console.log($(this).find('.theme-name').text())
        arr3.push($(this).find('.theme-name').text())

        // 搜尋結果的每個動畫日期 抓全部 a 標籤裡的日期
        // console.log($(this).find('.theme-time').text())
        arr4.push($(this).find('.theme-time').text())

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
          arr5.push($(this).find('.data_type li').eq(0).text())
          // 製作廠商
          // console.log($(this).find('.data_type li').eq(4).text())
          arr6.push($(this).find('.data_type li').eq(4).text())
          // 動畫評分
          // console.log($(this).find('.data_acgbox'))
          // 因為 span 包在 div 裡面 用選擇器抓不到 所以先 remove div 的下一層 span 在抓 div
          $('.ACG-score').children().remove()
          arr7.push($(this).find('.ACG-score').text())
        })
      }

      // 作品類型 消除陣列裡的空白值
      // 找陣列中有值的才 retrun 出來
      arr5 = arr5.filter(function (a) {
        return a.length > 0
      })

      // 製作廠商 消除陣列裡的空白值
      arr6 = arr6.filter(function (a) {
        return a.length > 0
      })

      // 動畫評分 消除陣列裡的空白值
      arr7 = arr7.filter(function (a) {
        return a.length > 0
      })

      const flex = {
        type: 'flex',
        altText: '這是 flex',
        contents: {
          type: 'carousel',
          contents: []
        }
      }
      for (let i = 0; i < arr1.length; i++) {
        flex.contents.contents.push({
          // 動畫圖片
          type: 'bubble',
          size: 'micro',
          hero: {
            type: 'image',
            url: `${arr2[i]}`,
            size: 'full',
            aspectMode: 'cover',
            aspectRatio: '1:1',
            // 點擊圖片跳到該動畫瘋網址
            action: {
              type: 'uri',
              uri: `${arr1[i]}`
            }
          },
          body: {
            // 動畫名稱
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${arr3[i]}`,
                weight: 'bold',
                size: 'sm',
                wrap: true
              },
              // 動畫評分
              {
                type: 'box',
                layout: 'vertical',
                spacing: 'sm',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    contents: [
                      {
                        type: 'icon',
                        url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_regular_32.png'
                      },
                      {
                        type: 'text',
                        text: `${arr7[i]}`,
                        weight: 'bold',
                        margin: 'sm'
                      },
                      {
                        type: 'text',
                        text: '400kcl',
                        size: 'sm',
                        align: 'end',
                        color: '#aaaaaa'
                      }
                    ]
                  }
                ]
              },
              {
                // 動畫年份
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: `${arr4[i]}`,
                        wrap: true,
                        color: '#8c8c8c',
                        size: 'xs',
                        flex: 5
                      }
                    ]
                  }
                ]
              }
            ],
            spacing: 'sm',
            paddingAll: '13px'
          }
        })
      }
      event.reply(flex)
      console.log(arr7)
    } catch (error) {
      event.reply('查不到')
    }
  }
})
