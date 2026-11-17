// api.js
// Functions that fetch the SlugFest JSON data from the api folder.
// Each one returns the parsed JSON, or a safe empty value (null / []) if the request fails,
// so the pages that call them can keep rendering instead of crashing.

/**
 * Get one user's profile information
 * @param {string} username - the user's screen name, e.g. "ed"
 * @returns {Promise<Object|null>} the profile data, or null if it could not be loaded
 */
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

/**
 * Get the slimes a user has posted (newest first)
 * @param {string} username - the user's screen name
 * @returns {Promise<Array>} the user's timeline, or an empty array on failure
 */
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

/**
 * Get the slimes a user has favorited
 * @param {string} username - the user's screen name
 * @returns {Promise<Array>} the user's favorites, or an empty array on failure
 */
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

/**
 * Get the main feed shown on the home page
 * @returns {Promise<Array>} the home timeline, or an empty array on failure
 */
export async function getHomeTimeline() {
    try {
        const response = await fetch(`api/statuses/home_timeline.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch home timeline:`, error);
        return [];
    }
}
