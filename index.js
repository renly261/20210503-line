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
  // 若你傳的東西類型是文字
  if (event.message.type === 'text') {
    let msg = event.message.text
    // 若你傳送訊息的字是 !help
    if (msg === '!help') {
      const help =
        '歡迎使用動畫瘋查詢機器人\n機器人指令=>\n☆!help:顯示幫助訊息\n☆!animed:空格後接關鍵字 搜尋\n例如:!animed 巨人\n\n動畫瘋自2021年1月1日起\n停止支援手機網頁撥放\n請下載動畫瘋 app 使用喔!\n一次搜尋的結果最多 12 筆\n請搜尋關鍵字時多加留意'
      event.reply(help)

      // 若你傳送的字是 !anime 關鍵字
      // msg.substring(0, 7) msg 前七個字是 !anime 會產生一個新字串 此時的 msg 會變成 !anime
    } else if (msg.substring(0, 7) === '!anime ') {
      // 判斷完 msg 後要把 !anime 替換成空的字(刪掉) 不然底下的網址會多 !anime
      msg = msg.replace('!anime ', '')
      try {
        // 第一層 抓搜尋結果的網站
        const response = await axios.get(`https://ani.gamer.com.tw/search.php?kw=${encodeURI(msg)}`)
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

        // 第一層---------------------------------------------------------------------------------------------------------
        // 搜尋結果的網站的資料 .old_list 裡面的 .theme-list-block 裡面的 a 標籤 全部
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
          // console.log($(this).find('.theme-time').text()
          // substring( , ) 只取第幾個到第幾個字
          arr4.push($(this).find('.theme-time').text().substring(3, 100))

          // 抓第一層搜尋結果的每個動畫網址 塞進 links 的空陣列
          links.push('https://ani.gamer.com.tw/' + $(this).attr('href'))
        })

        //   each() 裡 async await 無效 第一層資料還沒出來就會跑第二層了
        //   因為 each() 裡 async await 無效 所以用 for 迴圈先把所有網址先跑出來在抓資料
        for (const link of links) {
          //  用迴圈跑第一層搜尋結果的每個動畫網址 再去抓資料
          const response = await axios.get(link)
          $ = cheerio.load(response.data)

          // 第二層---------------------------------------------------------------------------------------------
          // 搜尋結果的每個動畫資料 .container-player裡的全部
          $('.container-player').each(function () {
            // 作品類型
            // console.log($(this).find('.data_type li').eq(0).text())
            // substring( , ) 只取第幾個到第幾個字
            arr5.push($(this).find('.data_type li').eq(0).text().substring(4, 100))

            // 製作廠商
            // console.log($(this).find('.data_type li').eq(4).text())
            // substring( , ) 只取第幾個到第幾個字
            arr6.push($(this).find('.data_type li').eq(4).text().substring(4, 100))

            // 動畫評分
            // console.log($(this).find('.data_acgbox'))
            // 因為 span 包在 div 裡面 用選擇器抓不到 所以先 remove div 的下一層 span 在抓 div
            $('.ACG-score').children().remove()
            arr7.push($(this).find('.ACG-score').text())
          })
        }

        // 抓本季新番 今天更新的動畫
        const response1 = await axios.get('https://ani.gamer.com.tw/')
        const $1 = cheerio.load(response1.data)
        $1('.newanime-block').each(function () {
          for (let i = 1; i < 10; i++) {
            // 動畫網址
            $1(this).find(` .new-count-${i} .anime-card-block`).attr('href')
            console.log('https://ani.gamer.com.tw/' + $1(this).find(` .new-count-${i} .anime-card-block`).attr('href'))

            $1(this).find('.lazyloaded').attr('src')
            // console.log($1(this).find('.lazyloaded').attr('src'))
          }
        })

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

        // 使用 line flex message 的模板
        const flex = {
          type: 'flex',
          altText: '這是 flex',
          contents: {
            type: 'carousel',
            contents: []
          }
        }

        // 跑迴圈將搜尋結果的每個動畫資料陣列 push 進 flex message 的 contents 裡面-----------------------------------------------------------
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

            // 動畫名稱
            body: {
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: `${arr3[i]}`,
                  weight: 'bold',
                  size: '14px',
                  wrap: true
                },

                // 動畫評分
                {
                  type: 'box',
                  layout: 'vertical',
                  spacing: 'sm',
                  margin: 'sm',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      contents: [
                        {
                          type: 'icon',
                          url: 'https://icons555.com/images/icons-red/image_icon_rating_pic_512x512.png',
                          size: '15px'
                        },
                        {
                          type: 'text',
                          text: `${arr7[i]}`,
                          size: '14px',
                          weight: 'bold',
                          margin: 'sm',
                          offsetTop: '-2.5px',
                          flex: 0
                        }
                      ]
                    }
                  ]
                },

                // 作品年份
                {
                  type: 'box',
                  layout: 'vertical',
                  margin: 'sm',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: '上映時間',
                          color: '#aaaaaa',
                          size: '13px',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: `${arr4[i]}`,
                          wrap: true,
                          size: '12px',
                          offsetStart: '5px'
                        }
                      ]
                    },

                    // 作品類型
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: '作品類型',
                          color: '#aaaaaa',
                          size: '13px',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: `${arr5[i]}`,
                          wrap: true,
                          size: '12px',
                          offsetStart: '5px'
                        }
                      ]
                    },

                    // 製作廠商
                    {
                      type: 'box',
                      layout: 'baseline',
                      spacing: 'sm',
                      contents: [
                        {
                          type: 'text',
                          text: '製作廠商',
                          color: '#aaaaaa',
                          size: '13px',
                          flex: 0
                        },
                        {
                          type: 'text',
                          text: `${arr6[i]}`,
                          wrap: true,
                          size: '12px',
                          offsetStart: '5px'
                        }
                      ]
                    }
                  ]
                }
              ],
              spacing: 'sm',
              paddingAll: '10px'
            }
          })
        }

        // 若查出來的資料筆數為 0
        if (arr1.length === 0) {
          event.reply('搜尋不到符合此關鍵字的動畫 請在確認')
        }

        // 若查出來有東西 linebot 回傳 flex
        event.reply(flex)
        // console.log(arr3)

        // 發生錯誤要回傳的東西
      } catch (error) {
        event.reply('發生錯誤')
      }
    }
  }
})
