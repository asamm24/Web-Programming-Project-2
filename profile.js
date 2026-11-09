/*
 * Module profile.js
 * Controller for dynamically rendering user profile headers and timelines replies, and favorites
 */

import { getUserProfile, getUserTimeline, getUserFavorites } from "./api.js";
import { parseHTML } from "./html-utils.js";

/**
 * Loads and also renders a users profile header, timeline, replies, and favorites data inthe skeleton
 * @param {string} username The backend username key (like the "kevinaangstadt", "ed", "choongsool", "ltorrey")
 */
export async function loadProfile(username) {
    // 1. Fetching the user metadata, timeline data, and favorites data concurrently
    const [profileData, timelineData, favoritesData] = await Promise.all([
        getUserProfile(username),
        getUserTimeline(username),
        getUserFavorites(username)
    ]);

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
    const imgContainer = document.querySelector(".col-4"); 
    const textContainer = document.querySelector(".col-8");  

    if (imgContainer) {
        imgContainer.innerHTML = `
            <img src="assets/profile/${avatarFile}" class="img-fluid rounded-circle border p-1" alt="${profileData.name}">
        `;
    }

    if (textContainer) {
        const nameHeading = textContainer.querySelector("h1");
        const usernameSpan = textContainer.querySelector(".text-muted.lead");
        const bioParagraph = textContainer.querySelector("p.mb-3");
        const joinedDiv = textContainer.querySelector(".text-muted i.bi-calendar3")?.parentElement;
        const statsDiv = textContainer.querySelectorAll(".text-muted")[1];

        if (nameHeading) nameHeading.textContent = profileData.name;
        if (usernameSpan) usernameSpan.textContent = profileData.screen_name.startsWith('@') ? profileData.screen_name : `@${profileData.screen_name}`;
        if (bioParagraph) bioParagraph.textContent = profileData.description;
        if (joinedDiv) joinedDiv.innerHTML = `<i class="bi bi-calendar3"></i> Joined ${profileData.created_at || 'August 2021'}`;
        if (statsDiv) {
            statsDiv.innerHTML = `
                <span class="me-3"><strong>${profileData.friends_count ?? 0}</strong> Following</span>
                <span class="me-3"><strong>${profileData.followers_count ?? 0}</strong> Followers</span>
            `;
        }
    }

    // 4. Helper function to build an interactive slime card with avatar and interconnected profile link
    const createSlimeCard = (slime) => {
        const user = slime.user || {};
        const name = user.name || profileData.name;
        const screenName = user.screen_name || profileData.screen_name;
        
        // resolution for standard posts and nested reslimes
        const slimeText = slime.full_text 
            || slime.text 
            || (slime.reslimed_status && (slime.reslimed_status.full_text || slime.reslimed_status.text)) 
            || "";
        
        // Map screen names to profile HTML filenames for interconnected navigation
        const profilePageMap = {
            "@kevinaangstadt": "kevin.html",
            "kevinaangstadt": "kevin.html",
            "@ed": "ed.html",
            "ed": "ed.html",
            "@ltorrey": "lisa.html",
            "ltorrey": "lisa.html",
            "@choongsool": "lee.html",
            "choongsool": "lee.html"
        };
        
        const profileFile = profilePageMap[screenName] || profilePageMap[screenName.toLowerCase()] || "kevin.html";

        let avatarUrl = user.profile_image_url || `assets/profile/${avatarFile}`;
        if (avatarUrl.startsWith("/")) {
            avatarUrl = avatarUrl.substring(1);
        }

        return `
            <div class="card mb-3 shadow-sm">
                <div class="card-body d-flex align-items-start p-3">
                    <img src="${avatarUrl}" class="rounded-circle me-3 border" width="48" height="48" alt="${name}">
                    <div class="flex-grow-1">
                        <div class="mb-1">
                            <a href="${profileFile}" class="text-dark fw-bold text-decoration-none">${name}</a>
                            <a href="${profileFile}" class="text-muted text-decoration-none ms-1">${screenName}</a>
                        </div>
                        <p class="mb-2 text-dark">${slimeText}</p>
                    </div>
                </div>
            </div>
        `;
    };

    // 5. Populate the Slimes Tab (#slimes)
    const slimesTab = document.querySelector("#slimes");
    if (slimesTab && Array.isArray(timelineData)) {
        slimesTab.innerHTML = ""; 
        const originalSlimes = timelineData.filter(s => !s.in_reply_to_status_id_str);
        const slimesToRender = originalSlimes.length > 0 ? originalSlimes : timelineData;
        
        slimesToRender.forEach(slime => {
            slimesTab.appendChild(parseHTML(createSlimeCard(slime)));
        });
    }

    // 6. Populate the Slimes and Replies Tab (#replies)
    const repliesTab = document.querySelector("#replies");
    if (repliesTab && Array.isArray(timelineData)) {
        repliesTab.innerHTML = "";
        timelineData.forEach(slime => {
            repliesTab.appendChild(parseHTML(createSlimeCard(slime)));
        });
    }

    // 7. Populate the Favorites Tab (#favorites)
    const favoritesTab = document.querySelector("#favorites");
    if (favoritesTab) {
        favoritesTab.innerHTML = "";
        if (Array.isArray(favoritesData) && favoritesData.length > 0) {
            favoritesData.forEach(slime => {
                favoritesTab.appendChild(parseHTML(createSlimeCard(slime)));
            });
        } else {
            favoritesTab.innerHTML = `<p class="text-muted p-3 text-center">No favorites found.</p>`;
        }
    }

    // 8. Bootstrap Tab Switching Visibility Logic
    const tabButtons = document.querySelectorAll('button[data-bs-toggle="pill"]');
    tabButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            
            tabButtons.forEach(btn => btn.classList.remove("active"));
            document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("show", "active"));
            
            button.classList.add("active");
            
            const targetId = button.getAttribute("data-bs-target");
            const targetPane = document.querySelector(targetId);
            if (targetPane) {
                targetPane.classList.add("show", "active");
            }
        });
    });
}