import { WebBonusDOM } from "./web_bonus_dom"

const start = async () => {
    const helper = new WebBonusDOM()
    await helper.dailyCheckIn()

    // 完了通知
    chrome.runtime.sendMessage('finish')
}

start()