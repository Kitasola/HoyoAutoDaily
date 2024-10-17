import logger from './utils/logger'

const config = {
    'games_info': {
        'HG0': {
            'id': 'HG0',
            'name': 'Genshin Impact',
            'enable': false,
        },
        'HG1': {
            'id': 'HG1',
            'name': 'Hokai Star Rail',
            'enable': false,
        },
        'HG2': {
            'id': 'HG2',
            'name': 'Zenless Zone Zero',
            'enable': false,
        },
    },
}

export const getGamesInfo = async () => {
    const data = await chrome.storage.sync.get('games_info')
        .catch(() => { })

    if ('games_info' in data == false) {
        logger.info('not found games_info')
        await chrome.storage.sync.set({ 'games_info': config.games_info })
        return config.games_info
    }

    return data.games_info
};

export const changeEnableGame = async (id, enable) => {
    const games_info = await getGamesInfo()
    games_info[id].enable = (enable === true)
    await chrome.storage.sync.set({ 'games_info': games_info, })
    logger.info(`${games_info[id].name}'s info change ${games_info[id].enable}`)
};