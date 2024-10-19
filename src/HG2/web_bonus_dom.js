import logger from '../utils/logger'

export class WebBonusDOM {
    // ログインボーナスグリッドの取得
    async getBonusItems() {
        return new Promise((resolve) => {
            const interval_id = setInterval(() => {
                const dom = document.querySelectorAll('div[class*=components-pc-assets-__prize-list_---list] > div')

                if (dom) {
                    clearInterval(interval_id)
                    resolve(Array.from(dom))
                }
            }, 1000)
        })
    }

    // 今日のボーナスを取得
    async dailyCheckIn() {
        const items = await this.getBonusItems()
        const target = items.find((item) => !Array.from(item.childNodes).some((el) => el.className.includes('components-pc-assets-__prize-list_---received')))
        if (target) {
            logger.info('daily sign in success')
            target.click()
        }
    }

    // "さらに表示"の展開
    async expandAll() {
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                const el = document.querySelector(
                    'div[class*=components-pc-assets-__prize-list_---arrow]'
                )

                if (el != null) {
                    el.click()
                    clearInterval(intervalId)
                    resolve()
                }
            }, 100)
        })
    }
}