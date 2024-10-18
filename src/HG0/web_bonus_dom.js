import logger from '../utils/logger'

export class WebBonusDOM {
    // ログインボーナスグリッドの取得
    async getBonusItems() {
        return new Promise((resolve) => {
            const interval_id = setInterval(() => {
                const dom = document.querySelectorAll('div[class*=components-home-assets-__sign-content-test_---sign-list] > div')

                if (dom) {
                    clearInterval(interval_id)
                    return resolve(Array.from(dom))
                }
            }, 1000)
        })
    }

    // 今日のボーナスを取得
    async dailyCheckIn() {
        const items = await this.getBonusItems()
        const target = items.find((el) => el.className.includes('sign-wrapper'))
        if (target) {
            logger.info('daily sing in success')
            target.click()
        }
    }

    // "さらに表示"の展開
    async expandAll() {
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                const el = document.querySelector(
                    'div[class*=components-home-assets-__sign-content_---more-wrapper]'
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