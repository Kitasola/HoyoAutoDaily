import logger from './utils/logger'
import { getGamesInfo, onCheckingGame } from './config'

export class WebBonus {
    #act_id
    #game_info
    #lang

    constructor() {
        this.#act_id = ''
        this.#game_info = {}
        this.#lang = 'ja-jp'
    }

    async build(page_url) {
        // ページURLからact_idを抽出
        const params = new URL(page_url).searchParams
        this.#act_id = params.get('act_id')

        // games_infoからact_idベースで情報取得
        const games_info = await getGamesInfo()
        for (const game of Object.values(games_info)) {
            if (game.act_id === this.#act_id) {
                this.#game_info = game
                break
            }
        }
    }

    // 今日のボーナス取得
    async dailyCheckIn() {
        const info_url = `${this.#game_info.info_url}?lang=${this.#lang}&act_id=${this.#act_id}`
        const info = await WebBonus.#get(info_url, this.#game_info.signname)

        // チェックイン済みでない場合のみ
        if (info && !info.is_sign) {
            const result = await WebBonus.#post(this.#game_info.sign_url, {
                act_id: this.#act_id,
                lang: this.#lang,
            }, this.#game_info.signname)
            if (result.retcode === 0) {
                logger.debug(`ok: ${result.message}`)
            }
            else if (result.retcode === -5003) {
                logger.debug(`done: ${result.message}`)
            }
        }
    }

    // GET
    static async #get(url, name) {
        const req = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            referrerPolicy: 'strict-origin-when-cross-origin',
            headers: {
                'Content-Type': 'application/json',
            },
        }
        if (name) {
            req.headers['x-rpc-signgame'] = name
        }
        try {
            const response = await fetch(url, req);
            if (!response.ok) {
                throw new Error(response.status);
            }

            const json = await response.json();
            return json.data
        } catch (error) {
            logger.error(error.message)
            return null
        }
    }

    // POST
    static async #post(url, body, name) {
        const req = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            referrerPolicy: 'strict-origin-when-cross-origin',
            headers: {
                'Content-Type': 'application/json',
            }
        }
        if (name) {
            req.headers['x-rpc-signgame'] = name
        }
        if (body) {
            req.body = JSON.stringify(body)
        }
        try {
            const response = await fetch(url, req);
            if (!response.ok) {
                throw new Error(response.status);
            }

            const json = await response.json();
            return json.data
        } catch (error) {
            logger.error(error.message)
            return null
        }
    }
}