/*
 * slime-trail.js
 * Shows one slime and the replies to it on the slime trail page.
 */

// ----- getting the data -----

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

// get one slime from the api folder (null if there is no slime with that id)
async function getSlime(id) {
    const response = await fetch("api/statuses/show/" + id + ".json");
    if (!response.ok) {
        return null;
    }
    return await response.json();
}

// get the list of replies to a slime (an empty list if they can't be loaded)
async function getReplies(id) {
    const response = await fetch("api/statuses/replies/" + id + ".json");
    if (!response.ok) {
        return [];
    }
    return await response.json();
}

// ----- making the html -----

// build one slime card, the main slime gets a blue border
function createSlimeCard(slime, isMain) {
    const card = document.createElement("div");
    card.className = "card mb-3";
    if (isMain) {
        card.classList.add("border-primary");
    }

    // the json has a "/" at the start of the picture path, take it off
    const picture = slime.user.profile_image_url.substring(1);
    const date = new Date(slime.created_at).toLocaleString();
    const rawScreenName = slime.user.screen_name || "";
    const screenName = rawScreenName.startsWith("@")
        ? rawScreenName
        : `@${rawScreenName}`;
    const profileLink = profilePageMap[screenName] || profilePageMap[rawScreenName] || null;
    const avatar = `<img src="${picture}" class="rounded-circle me-3" width="48" height="48" alt="${slime.user.name}">`;
    const author = profileLink
        ? `<a href="${profileLink}" class="text-dark text-decoration-none"><strong>${slime.user.name}</strong></a>
           <a href="${profileLink}" class="text-muted text-decoration-none">${screenName}</a>`
        : `<strong>${slime.user.name}</strong> <span class="text-muted">${screenName}</span>`;
    const linkedText = slime.text.replace(/@[A-Za-z0-9_]+/g, (mention) => {
        const mentionLink = profilePageMap[mention.toLowerCase()];
        return mentionLink
            ? `<a href="${mentionLink}" class="text-dark text-decoration-none">${mention}</a>`
            : mention;
    });

    card.innerHTML = `
        <div class="card-body d-flex">
            ${profileLink ? `<a href="${profileLink}">${avatar}</a>` : avatar}
            <div>
                ${author}
                <p>${linkedText}</p>
                <small class="text-muted">${date}</small>
                <div class="text-muted small mt-2">
                    <i class="bi bi-chat"></i> ${slime.reply_count}
                    <i class="bi bi-arrow-repeat ms-3"></i> ${slime.reslime_count}
                    <i class="bi bi-heart ms-3"></i> ${slime.favorite_count}
                </div>
            </div>
        </div>
    `;
    return card;
}

// ----- putting it on the page -----

export async function loadSlimeTrail(id) {
    const found = await getSlime(id);
    const mainDiv = document.querySelector("#main-slime");

    // no slime with that id, so say so instead of leaving the page blank
    if (!found) {
        mainDiv.innerHTML = '<div class="alert alert-warning">That slime could not be found.</div>';
        return;
    }

    // a reslime only wraps the original post, so show the original and its replies
    const slime = found.reslimed_status || found;
    const replies = await getReplies(slime.id_str || id);

    mainDiv.append(createSlimeCard(slime, true));

    const repliesDiv = document.querySelector("#replies");
    for (const reply of replies) {
        repliesDiv.append(createSlimeCard(reply, false));
    }
}