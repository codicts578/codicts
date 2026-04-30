// data.js
const UI_COMPONENTS = [
    { name: "Modern Navbar", category: "mystery", img: "/frontend/images/Components Page/component1.png", tag: "FREE" },
    { name: "Gradient Button", category: "buttons", img: "/frontend/images/Components Page/component2.png", tag: "FREE" },
    { name: "Glassmorphic Card", category: "cards", img: "/frontend/images/Components Page/component3.png", tag: "FREE" }
];

function generateCardHTML(item, isLiked) {
    // Determine the tag class (free or pro) based on the tag text
    const tagClass = item.tag.toLowerCase() === 'free' ? 'free' : 'pro';

    return `
        <div class="itemCard" dataName="${item.category}">
            <div class="itemImg">
                <img src="${item.img}" alt="${item.name}">
                <div class="tag ${tagClass}">${item.tag}</div>
                <!-- Heart MUST be inside itemImg for the CSS 'absolute' positioning to work -->
                <i class="${isLiked ? 'fa-solid active' : 'fa-regular'} fa-heart like-icon" 
                   data-name="${item.name}" 
                   onclick="toggleLike(this, '${item.name}')"></i>
            </div>
            <button>View Component</button>
        </div>
    `;
}