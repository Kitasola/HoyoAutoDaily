import { WebBonusDOM } from "./web_bonus_dom"

const start = async () => {
    const helper = new WebBonusDOM()
    helper.dailyCheckIn()
}

start()