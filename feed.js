/**
 * feed.js
 * Takes the API data and feeds it into the UI component.
 */

import { getHomeTimeline } from './api.js';
import { createSlime } from './slime.js';

document.addEventListener('DOMContentLoaded', async () => {
    const feedContainer = document.getElementById('feed-container');

    // Throw up a loading spinner so the page doesn't look broken while we wait for the JSON fetch
    feedContainer.innerHTML = `
        <div class="text-center text-muted my-5">
            <div class="spinner-border mb-3" role="status"></div>
            <p>Loading the latest slimes...</p>
        </div>
    `;

    // Grab the feed data using the API fetcher
    const timelineData = await getHomeTimeline();
    
    // Data is here
    feedContainer.innerHTML = '';

    // If fetch fails this shows a nice Bootstrap warning instead of just a blank white screen
    if (!timelineData || timelineData.length === 0) {
        feedContainer.innerHTML = `
            <div class="alert alert-warning shadow-sm" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                No slimes could be loaded. Make sure the local Python server is running!
            </div>
        `;
        return;
    }

    // Loop through all the status updates in the timeline JSON
    timelineData.forEach(slimeData => {
        // Hand the raw JSON object over to the UI builder to get a DOM node
        const slimeNode = createSlime(slimeData);
        
        // Slap the finished DOM element onto my feed page container
        feedContainer.appendChild(slimeNode);
    });
});
