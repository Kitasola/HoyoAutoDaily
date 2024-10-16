const config = {
    "games_info": [
        {
            "id": "HG0",
            "name": "Genshin Impact",
            "enable": false,
            "last_date": null
        },
        {
            "id": "HG1",
            "name": "Hokai Star Rail",
            "enable": false,
            "last_date": null
        },
        {
            "id": "HG2",
            "name": "Zenless Zone Zero",
            "enable": false,
            "last_date": null
        }
    ]
}

export const getGamesInfo = async () => {
    const data = await chrome.storage.sync.get('games_info')
        .catch(() => { })

    if ('games_info' in data == false) {
        console.log('not found games_info.')
        await chrome.storage.sync.set({ 'games_info': config.games_info })
        return config.games_info
    }

    return data.games_info
};