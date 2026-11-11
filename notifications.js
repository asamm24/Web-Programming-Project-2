// Controller for fetching and rendering notifications into notifications.html 

// 1. Map screen names to their profile page 
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

const avatarMap = {
    "kevinaangstadt": "assets/profile/kevin.jpeg",
    "ed": "assets/profile/ed.png",
    "choongsool": "assets/profile/choong-soo.png",
    "ltorrey": "assets/profile/lisa.jpeg"
};

function createNotificationCard(item) {
    // Extract user details 
    const actor = item.user || {}; 
    const actorName = actor.name || "Someone"; 
    const rawScreenName = actor.screen_name || "unknown";
    const screenName = rawScreenName.startsWith('@') ? rawScreenName : `@${rawScreenName}`;
    const cleanScreenName = rawScreenName.replace('@', '').toLowerCase(); 

    const profileLink = profilePageMap[screenName] || profilePageMap[cleanScreenName] || "#";

    // Avatar URL 
    let avatarUrl = actor.profile_image_url || avatarMap[cleanScreenName] || "assets/profile/kevin.jpeg"; 
    if (avatarUrl.startsWith("/")) { 
        avatarUrl = avatarUrl.substring(1);
    
    }

    // Icon, color, and action description
    let actionIcon = "bi-bell-fill text-primary"; 
    let actionText = "interacted with your slime"; 
    let previewText = ""; 

   if (item.reslimed_status) {
        // reslime (Lisa and Ed reslimed Kevin's post)
        actionIcon = "bi-arrow-repeat text-success";
        actionText = "reslimed your post";
        previewText = item.reslimed_status.text || "";
    } else if (item.in_reply_to_status_id_str) {
        // reply (Ed replied to Kevin)
        actionIcon = "bi-chat-left-dots-fill text-info";
        actionText = "replied to your slime";
        previewText = item.text || "";
    } else if (item.favorited) {
        // favorite
        actionIcon = "bi-heart-fill text-danger";
        actionText = "favorited your slime";
        previewText = item.text || "";
    }


    // Build the DOM node
    const card = document.createElement("div"); 
    card.className = "card mb-3 shadow-sm"; 

    card.innerHTML = `
        <div class="card-body d-flex align-items-start p-3">
            <!-- Action Indicator Icon -->
            <div class="me-3 fs-4">
                <i class="bi ${actionIcon}"></i>
            </div>
            
            <!-- Actor Avatar -->
            <a href="${profileLink}" class="me-3">
                <img src="${avatarUrl}" class="rounded-circle border" width="42" height="42" alt="${actorName}">
            </a>

            <!-- Content Details -->
            <div class="flex-grow-1">
                <div class="mb-1">
                    <a href="${profileLink}" class="text-dark fw-bold text-decoration-none">${actorName}</a>
                    <span class="text-muted ms-1">${actionText}</span>
                </div>
                ${previewText ? `<p class="text-muted mb-0 border-start ps-3 py-1 bg-light rounded">${previewText}</p>` : ""}
            </div>
        </div>
    `;
    return card; 
}


/** 
 * Initializes the notifications page: fetches the JSON and appends items to the DOM. 
 */
async function loadNotifications() {
    const container = document.querySelector("#notifications-container");
    if (!container) {
        console.error("Target #notifications-container not found in HTML."); 
        return; 
    }

    try {
        // 1. Fetch the data feed 
        const resp = await fetch("api/statuses/activity.json"); 
        if (!resp.ok) {
            throw new Error(`HTTP error! status: ${resp.status}`);
        }

        const activities = await resp.json(); 

        // Clear placeholder
        container.innerHTML = ""; 

        // 2. Validate data and render 
        if (!Array.isArray(activities) || activities.length === 0) {
            container.innerHTML = `<p class="text-muted text-center py-4">No recent activity.</p>`;
            return;
        }

        // 3. Loop over each activity and inject into the page
        activities.forEach(activity => {
            const card = createNotificationCard(activity); 
            container.appendChild(card); 
        });

    } catch (error) {
        console.error("Error loading notifications:", error); 
        container.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load notifications.
            </div>
        `;
    }
}


document.addEventListener("DOMContentLoaded", loadNotifications);
