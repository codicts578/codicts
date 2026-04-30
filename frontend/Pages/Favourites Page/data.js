// data.js
const UI_COMPONENTS = [
    { name: "Modern Navbar", category: "mystery", img: "images/components page/component1.png", tag: "Free" },
    { name: "Gradient Button", category: "buttons", img: "images/components page/component2.png", tag: "Free" },
    { name: "Glassmorphic Card", category: "cards", img: "images/components page/component3.png", tag: "Free" }
];

// This function builds the EXACT HTML structure from your CSS
function generateCardHTML(item, isLiked) {
    return `
        <div class="itemCard" dataName="${item.category}">
            <div class="itemImg">
                <img src="${item.img}" alt="${item.name}">
                <div class="tag">${item.tag}</div>
            </div>
            <button>View Component</button>
            <i class="${isLiked ? 'fa-solid active' : 'fa-regular'} fa-heart like-icon" 
               data-name="${item.name}" 
               onclick="toggleLike(this, '${item.name}')"></i>
        </div>
    `;
}