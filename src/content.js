import { WebBonusDOM } from "./web_bonus_dom"

const start = async () => {
    const helper = new WebBonusDOM()
    await helper.dailyCheckIn()

    // ログインボーナスページを閉じる
    await chrome.tabs.query({ url: 'https://act.hoyolab.com/ys/event/signin-sea-v3/index.html?act_id=e202102251931481' }, (tabs) => {
        tabs.forEach(tab => {
            chrome.tabs.remove(tab.id)
        });
    });
}

start()