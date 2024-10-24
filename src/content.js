import { WebBonus } from "./web_bonus"

const start = async () => {
    const helper = new WebBonus
    await helper.build(window.location.toString())
    await helper.dailyCheckIn()

    // 完了通知
    // chrome.runtime.sendMessage('finish')
}

start()