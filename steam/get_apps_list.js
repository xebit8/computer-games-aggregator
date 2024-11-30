import { get } from "axios";


export default async function getAppsList() {
    try {
        const response = await get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
        const apps = response.data.applist.apps;
        console.log(apps);
        for (let i = 0; i < 100; i++)
        {
            console.log(apps[i]);
        }
        return apps;
    } catch (error) {
        console.error("Couldn't get info from Steam Web API.", error);
    }
};