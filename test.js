import axios from 'axios'
import cheerio from 'cheerio'

const main = async event => {
  try {
    // 抓搜尋結果的網站
    const response = await axios.get(`https://ani.gamer.com.tw/search.php?kw=${encodeURI('進擊的巨人 ')}`)
    let $ = cheerio.load(response.data)
    const arr = []
    const links = []

    $('.old_list .theme-list-block a').each(function () {
      // 網址
      // console.log('https://ani.gamer.com.tw/' + $(this).attr('href'))

      // 抓全部 a 標籤裡圖片的 src 屬性
      // console.log($(this).find('.theme-img').attr('src'))

      // 抓全部 a 標籤裡的名稱
      // console.log($(this).find('.theme-name').text())

      // 抓全部 a 標籤裡的日期
      // console.log($(this).find('.theme-time').text())

      // 抓搜尋結果點進去的網站
      links.push('https://ani.gamer.com.tw/' + $(this).attr('href'))
    })
    for (const link of links) {
      const response = await axios.get(link)
      $ = cheerio.load(response.data)
      $('.container-player').each(function () {
        // 作品類型
        // console.log($1(this).find('.data_type li').eq(0).text())
        // 製作廠商
        // console.log($1(this).find('.data_type li').eq(4).text())
        // 評分
        // console.log($1(this).find('.ACG-score').text())
        $('.ACG-score').children().remove()
        const score = $('.ACG-score').text()
        arr.push(score)
      })
    }

    const response1 = await axios.get('https://ani.gamer.com.tw/')
    let $1 = cheerio.load(response1.data)
    const links1 = []

    $1('.newanime-block .new-count-1 .anime-block a').each(function () {
      // 動畫網址
      $1(this).attr('href')
      // console.log('https://ani.gamer.com.tw/' + $1(this).attr('href'))

      // 動畫圖片
      $1(this).find('.lazyload').attr('src')
      // console.log($1(this).find('.lazyload').attr('src'))

      // 動畫名稱
      $1(this).find('.anime-name p').eq(0).text()
      // console.log($1(this).find('.anime-name p').eq(0).text())

      links1.push('https://ani.gamer.com.tw/' + $1(this).attr('href'))
    })
    for (const link1 of links1) {
      const response1 = await axios.get(link1)
      $1 = cheerio.load(response1.data)
      $1('.container-player').each(function () {
        // 上架時間
        $1('.anime_info_detail').find('p').text().substring(5, 100)

        // 作品類型
        $1('.data_type li').eq(0).text().substring(4, 100)

        // 製作廠商
        $1('.data_type li').eq(4).text().substring(4, 100)

        // 評分
        $1('.ACG-score').children().remove()
        $1('.ACG-score').text()
      })
    }

    // console.log(arr2)
  } catch (error) {
    console.log(error)
  }
}

main()
