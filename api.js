export async function getUserProfile(username) {
    try {
        const response = await fetch(`api/user/get/${username}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch profile for ${username}:`, error);
        return null;
    }
}

export async function getUserTimeline(username) {
    try {
        const response = await fetch(`api/statuses/user_timeline/${username}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch timeline for ${username}:`, error);
        return [];
    }
}

export async function getUserFavorites(username) {
    try {
        const response = await fetch(`api/favorites/${username}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch favorites for ${username}:`, error);
        return [];
    }
}