import axios from 'axios'
import cheerio from 'cheerio'

const main = async event => {
  try {
    // 抓搜尋結果的網站
    const response = await axios.get('https://ani.gamer.com.tw/search.php?kw=%E5%B7%A8%E4%BA%BA')
    const $ = cheerio.load(response.data)
    // .old_list 裡面的 .theme-list-block 裡面的 a 標籤 全部
    $('.old_list .theme-list-block a').each(async function () {
      // 網址
      // console.log('https://ani.gamer.com.tw/' + $(this).attr('href'))

      // 抓全部 a 標籤裡圖片的 src 屬性
      // console.log($(this).find('.theme-img').attr('src'))

      // 抓全部 a 標籤裡的名稱
      // console.log($(this).find('.theme-name').text())
      const name = $(this).find('.theme-name').text()
      console.log(name)

      // 抓全部 a 標籤裡的日期
      // console.log($(this).find('.theme-time').text())
      const response1 = await axios.get('https://ani.gamer.com.tw/' + $(this).attr('href'))
      const $1 = cheerio.load(response1.data)
      $1('.container-player').each(function () {
        // console.log($1(this).find('.data_type').find('li').eq(0).text())
        // console.log($1(this).find('.data_type').find('li').eq(4).text())
        // console.log($1(this).find('.ACG-box').text())
      })
    })
  } catch (error) {
    console.log(error)
  }
}

main()
