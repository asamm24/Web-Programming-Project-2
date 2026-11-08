/*
 * Module profile.js
 * Controller for dynamically rendering user profiles and timelines using the skeleton
 */

import { getUserProfile, getUserTimeline } from "./api.js";
import { parseHTML } from "./html-utils.js";

/**
 * Loads and renders a user's profile header and timeline data into the skeleton
 * @param {string} username - The backend username key (e.g., "kevinaangstadt", "ed", "choongsool", "ltorrey")
 */
export async function loadProfile(username) {
    // 1. Fetch user metadata and timeline data
    const profileData = await getUserProfile(username);
    const timelineData = await getUserTimeline(username);

    if (!profileData) {
        console.error("Could not load profile data for username:", username);
        return;
    }

    // 2. Map usernames to their respective profile image assets
    const avatarMap = {
        "kevinaangstadt": "kevin.jpeg",
        "ed": "ed.png",
        "choongsool": "choong-soo.png",
        "ltorrey": "lisa.jpeg"
    };
    const avatarFile = avatarMap[username] || "kevin.jpeg";

    // 3. Populate the Profile Header section
    const imgContainer = document.querySelector(".col-4"); // Where <!--FIXME...
    const textContainer = document.querySelector(".col-8");  //where name, username, bio go

    if (imgContainer) {
        imgContainer.innerHTML = `
            <img src="assets/profile/${avatarFile}" class="img-fluid rounded-circle border p-1" alt="${profileData.name}">
        `;
    }

    if (textContainer) {
        //targetting specific parts inside col-8 or update them safely
        const nameHeading = textContainer.querySelector("h1");
        const usernameSpan = textContainer.querySelector(".text-muted.lead");
        const bioParagraph = textContainer.querySelector("p.mb-3");
        const joinedDiv = textContainer.querySelector(".text-muted i.bi-calendar3")?.parentElement;
        const statsDiv = textContainer.querySelectorAll(".text-muted")[1];

        if (nameHeading) nameHeading.textContent = profileData.name;
        if (usernameSpan) usernameSpan.textContent = `@${profileData.screen_name}`;
        if (bioParagraph) bioParagraph.textContent = profileData.description;
        if (joinedDiv) joinedDiv.innerHTML = `<i class="bi bi-calendar3"></i> Joined ${profileData.created_at || 'August 2021'}`;
        if (statsDiv) {
            statsDiv.innerHTML = `
                <span class="me-3"><strong>${profileData.friends_count ?? 3}</strong> Following</span>
                <span class="me-3"><strong>${profileData.followers_count ?? 3}</strong> Followers</span>
            `;
        }
    }

    // 4. Populate the Slimes Tab Timeline container (#slimes)
    const slimesTab = document.querySelector("#slimes");
    if (slimesTab && timelineData) {
        slimesTab.innerHTML = ""; // Clear placeholders
        
        timelineData.forEach(slime => {
            const cardHTML = `
                <div class="card mb-3 shadow-sm">
                    <div class="card-body d-flex align-items-start p-3">
                        <div class="flex-grow-1">
                            <div class="mb-1">
                                <span class="text-dark fw-bold">${profileData.name}</span>
                                <span class="text-muted">@${profileData.screen_name}</span>
                            </div>
                            <p class="mb-2 text-dark">${slime.text}</p>
                        </div>
                    </div>
                </div>
            `;
            slimesTab.appendChild(parseHTML(cardHTML));
        });
    }
}