export class SignInDOM {
    // ログインボーナスグリッドの取得
    getSignItems() {
        return new Promise((resolve) => {
            setInterval(() => {
                const dom = document.querySelectorAll('div[class*=components-home-assets-__sign-content-test_---sign-list] > div')

                if (dom) {
                    resolve(Array.from(dom))
                }
            }, 1000)
        })
    }

    // 今日のグリットをクリック(デイリー取得)
    async dailySignIn() {
        const items = await this.getSignItems()
        const target = items.find((el) => el.className.includes('sign-wrapper'))
        console.log('daily sign in')
        // target.click()
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

    // 
    waitForSignInList() {
        return new Promise((resolve) => {
            const ob = new MutationObserver(() => {
                const el = document.querySelector(
                    'div[class*=components-home-assets-__sign-content_---sign-list]'
                )

                if (el.children.length) {
                    ob.disconnect()
                    resolve(el)
                }
            })

            ob.observe(document.documentElement, {
                subtree: true,
                childList: true,
            })
        })
    }

    // async watchSignInList() {
    //     const ob = new MutationObserver(this.dailySignIn)
    //     const signInList = await this.waitForSignInList()

    //     ob.observe(signInList, {
    //         subtree: true,
    //         childList: true,
    //     })
    // }

    // async watchMissSignIn() {
    //     console.log('watch...')
    //     const ob = new MutationObserver(() => {
    //         console.log('watch misssign')
    //     })

    //     ob.observe(document.documentElement, {
    //         subtree: true,
    //         childList: true,
    //     })
    // }
}