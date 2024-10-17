import { SignInDOM } from "./signin_dom"

const start = async () => {
    const helper = new SignInDOM()
    helper.dailySignIn()
}

start()