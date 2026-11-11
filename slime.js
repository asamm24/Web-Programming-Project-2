// Reuseable componenet for rendering Slime post cards across application 


// 1. Mapping usernames to their profile HTML files 
const profilePageMap = {
    "@kevinaangstadt" : "kevin.html", 
    "kevinaangstadt": "kevin.html",
    "@ed": "ed.html",
    "ed": "ed.html",
    "@ltorrey": "lisa.html",
    "ltorrey": "lisa.html",
    "@choongsool": "lee.html",
    "choongsool": "lee.html"
};

// 2. in the case where the JSON doesn't have a profile_image_url 
const avatarMap = {
    "kevinaangstadt": "assets/profile/kevin.jpeg",
    "ed": "assets/profile/ed.png",
    "choongsool": "assets/profile/choong-soo.png",
    "ltorrey": "assets/profile/lisa.jpeg"
};


/**
 * create and return a DOM node representing a single slime card 
 * @param {Object} slime - the slime data object from API  
 * @returns {HTMLElement} - completed card element
 */
export function createSlime(slime) {
    if (!slime) {
        return document.createElement('div'); 
    }

    // extract the author data 
    const user = slime.user || {}; 
    const name = user.name || "Anonymous Slug"; 
    const rawScreenName = user.screen_name || "unkown"; 
    const screenName = rawScreenName.startsWith('@') ? rawScreenName : `@${rawScreenName}`; 
    const cleanScreenName = rawScreenName.replace('@', '').toLowerCase(); 

    // profile HTML link 
    const profileLink = profilePageMap[screenName] || profilePageMap[cleanScreenName] || "#"; 

    // avatar url 
    let avatarUrl = user.profile_image_url || avatarMap[cleanScreenName] || "assets/profile/kevin.jpeg"; 
    if (avatarUrl.startsWith("/")) {
        avatarUrl = avatarUrl.substring(1); 
    }

    // resolve post text (handle slimes, full_text, nested reslimes)
    const slimeText = slime.full_text 
        || slime.text 
        || (slime.reslimed_status && (slime.reslimed_status.full_text || slime.reslimed_status.text)) 
        || ""; 

    // slime ID for linking to slime trail page 
    const slimeId = slime.id_str || slime.id || ""; 

    // card element construction 
    const card = document.createElement('div'); 
    card.className = "card mb-3 shadow-sm"; 
    if (slimeId) {
        card.dataset.slimeID = slimeId; 
    }

    // matching card inner structure with bootstrap to profile.js 
    card.innerHTML = `
        <div class="card-body d-flex align-items-start p-3">
        <a href="${profileLink}">
            <img src="${avatarUrl}" class="rounded-circle me-3 border" width="48" height="48" alt="${name}">
        </a>
        <div class="flex-grow-1">
            <div class="mb-1">
            <a href="${profileLink}" class="text-dark fw-bold text-decoration-none">${name}</a>
            <a href="${profileLink}" class="text-muted text-decoration-none ms-1">${screenName}</a>
            ${slime.created_at ? `<small class="text-muted ms-2">· ${slime.created_at.split(' ').slice(1, 3).join(' ')}</small>` : ''}
            </div>
            <p class="mb-2 text-dark">${slimeText}</p>
            <div class="d-flex text-muted small gap-4 mt-2">
            <span><i class="bi bi-chat"></i> ${slime.reply_count ?? 0}</span>
            <span><i class="bi bi-arrow-repeat"></i> ${slime.reslime_count ?? 0}</span>
            <span><i class="bi bi-heart"></i> ${slime.favorite_count ?? 0}</span>
            </div>
        </div>
        </div>
    `; 

    return card; 

 }
