/*
 * slime-trail.js
 * Shows one slime and the replies to it on the slime trail page.
 */

// ----- getting the data -----

// get one slime from the api folder
async function getSlime(id) {
    const response = await fetch("api/statuses/show/" + id + ".json");
    return await response.json();
}

// get the list of replies to a slime
async function getReplies(id) {
    const response = await fetch("api/statuses/replies/" + id + ".json");
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

    card.innerHTML = `
        <div class="card-body d-flex">
            <img src="${picture}" class="rounded-circle me-3" width="48" height="48" alt="${slime.user.name}">
            <div>
                <strong>${slime.user.name}</strong>
                <span class="text-muted">${slime.user.screen_name}</span>
                <p>${slime.text}</p>
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
    const slime = await getSlime(id);
    const replies = await getReplies(id);

    document.querySelector("#main-slime").append(createSlimeCard(slime, true));

    const repliesDiv = document.querySelector("#replies");
    for (const reply of replies) {
        repliesDiv.append(createSlimeCard(reply, false));
    }
}
