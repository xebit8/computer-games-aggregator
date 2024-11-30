const axios = require("axios");


module.exports = async function getAppsList() {
    try {
        const response = await axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
        // const apps = response.data.applist.apps.slice(-3);
        const apps = response.data.applist.apps;
        //console.log(apps);
        let someApps = []
        for (let i = 0; i < apps.length; i++)
        {
            if (apps[i].name === "Dead by Daylight" | apps[i].name === "A Shlong Adventure") someApps.push(apps[i])
            //console.log(apps[i]);
        }
        return someApps.concat(apps.slice(-3));
    } catch (error) {
        console.error("Couldn't get info from Steam Web API.", error);
    }
};
