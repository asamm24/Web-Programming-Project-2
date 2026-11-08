/*
 * Module api.js
 * Fetch wrappers for SlugFest API endpoints
 */

/**
 * Generic helper to fetch JSON data from a given URL path
 * @param {string} url 
 * @returns {Promise<Object|null>} parsed JSON data
 */
export async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        return null;
    }
}

/**
 * Fetch profile data for a specific user
 * @param {string} username 
 */
export async function getUserProfile(username) {
    return await fetchData(`api/user/get/${username}.json`);
}

/**
 * Fetch timeline data for a specific user
 * @param {string} username 
 */
export async function getUserTimeline(username) {
    return await fetchData(`api/statuses/user_timeline/${username}.json`);
}

/**
 * Fetch favorites for a specific user
 * @param {string} username 
 */
export async function getUserFavorites(username) {
    return await fetchData(`api/favorites/${username}.json`);
}

/**
 * Fetch the main home feed timeline
 */
export async function getHomeTimeline() {
    return await fetchData("api/statuses/home_timeline.json");
}