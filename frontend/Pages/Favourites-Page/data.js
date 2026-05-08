// data.js
const UI_COMPONENTS = [
    { name: "Button Component 1", category: "buttons", tag: "FREE", src: "../../../frontend/images/Components-Page/button1.mp4", mediaType: "video", link: "/frontend/Pages/Code-Editor/Buttons/Button-1/buttonComponent1.html" },
    { name: "Button Component 2", category: "buttons", tag: "FREE", src: "../../../frontend/images/Components-Page/button2.mp4", mediaType: "video", link: "/frontend/Pages/Code-Editor/Buttons/Button-2/buttonComponent2.html" },
    { name: "Button Component 3", category: "buttons", tag: "PRO", src: "../../../frontend/images/Components-Page/button3.mp4", mediaType: "video", link: "/frontend/Pages/Code-Editor/Buttons/Button-3/buttonComponent3.html" },
    { name: "Button Component 4", category: "buttons", tag: "PRO", src: "../../../frontend/images/Components-Page/button4.mp4", mediaType: "video", link: "/frontend/Pages/Code-Editor/Buttons/Button-4/buttonComponent4.html" },

    { name: "Card Component 1", category: "cards", tag: "FREE", src: "../../../frontend/images/Components-Page/card1.mp4", mediaType: "video", link: "/frontend/Pages/Code-Editor/Cards/Card-1/cardComponent1.html" },
    { name: "Card Component 2", category: "cards", tag: "PRO", src: "../../../frontend/images/Components-Page/card2.mp4", mediaType: "video", link: "/frontend/Pages/Code-Editor/Cards/Card-2/cardComponent2.html" },
    { name: "Card Component 3", category: "cards", tag: "PRO", src: "../../../frontend/images/Components-Page/card3.mp4", mediaType: "video", link: "/frontend/Pages/Code-Editor/Cards/Card-3/cardComponent3.html" },

    { name: "Form Component 1", category: "forms", tag: "PRO", src: "../../../frontend/images/Components-Page/Form1.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Forms/Form-1/loginComponent1.html" },
    { name: "Form Component 2", category: "forms", tag: "PRO", src: "../../../frontend/images/Components-Page/form2.mp4", mediaType: "video", link: "/frontend/Pages/Code-Editor/Forms/Form-2/loginComponent2.html" },
    { name: "Form Component 3", category: "forms", tag: "FREE", src: "../../../frontend/images/Components-Page/form3.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Forms/Form-3/loginComponent3.html" },
    { name: "Form Component 4", category: "forms", tag: "FREE", src: "../../../frontend/images/Components-Page/form4.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Forms/Form-4/loginComponent4.html" },

    { name: "Input Component 1", category: "inputs", tag: "FREE", src: "../../../frontend/images/Components-Page/input1.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Inputs/Input-1/input1.html" },
    { name: "Input Component 2", category: "inputs", tag: "PRO", src: "../../../frontend/images/Components-Page/input-2.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Inputs/Input-2/input2.html" },
    { name: "Input Component 3", category: "inputs", tag: "FREE", src: "../../../frontend/images/Components-Page/input3.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Inputs/Input-3/input3.html" },

    { name: "Loader Component 1", category: "loaders", tag: "PRO", src: "../../../frontend/images/Components-Page/loader1.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Loaders/Loader-1/loader1.html" },
    { name: "Loader Component 2", category: "loaders", tag: "FREE", src: "../../../frontend/images/Components-Page/loader2.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Loaders/Loader-2/loader2.html" },
    { name: "Loader Component 3", category: "loaders", tag: "PRO", src: "../../../frontend/images/Components-Page/loader3.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Loaders/Loader-3/loader3.html" },
    { name: "Loader Component 4", category: "loaders", tag: "FREE", src: "../../../frontend/images/Components-Page/loader4.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Loaders/Loader-4/loader4.html" },
    { name: "Loader Component 5", category: "loaders", tag: "PRO", src: "../../../frontend/images/Components-Page/loader5.png", mediaType: "image", link: "/frontend/Pages/Code-Editor/Loaders/Loader-5/loader5.html" }
];

function generateCardHTML(item, isLiked, index) { // Added index here
    const iconClass = isLiked ? 'fa-solid active' : 'fa-regular';
    
    // This calculates a staggered delay (100ms, 200ms, 300ms...)
    const delay = (index % 5 + 1) * 100; 

    const media = item.mediaType === 'video' 
        ? `<video autoplay loop muted playsinline class="short-video"><source src="${item.src}" type="video/mp4"></video>`
        : `<img src="${item.src}" alt="${item.name}">`;

    return `
        <div class="itemCard" 
             dataname="${item.category}" 
             data-aos="zoom-in-up" 
             data-aos-delay="${delay}">
            <div class="itemImg">
                ${media}
                <div class="tag ${item.tag.toLowerCase()}">${item.tag}</div>
            </div>
            <div class="card-footer">
                <a href="${item.link}">
                    <button class="view-btn">View Component <i class="fa-solid fa-arrow-right-long"></i></button>
                </a>
                <div class="heart-wrapper">
                    <i class="${iconClass} fa-heart like-icon" onclick="toggleLike(this, '${item.name}')"></i>
                </div>
            </div>
        </div>
    `;
}


//without animations
//function generateCardHTML(item, isLiked) {
//    const iconClass = isLiked ? 'fa-solid active' : 'fa-regular';
//    const media = item.mediaType === 'video' 
//        ? `<video autoplay loop muted playsinline class="short-video"><source src="${item.src}" type="video/mp4"></video>`
//        : `<img src="${item.src}" alt="${item.name}">`;

//    return `
//        <div class="itemCard" dataname="${item.category}">
//            <div class="itemImg">
//                ${media}
//                <div class="tag ${item.tag.toLowerCase()}">${item.tag}</div>
//            </div>
//            <div class="card-footer">
//                <a href="${item.link}">
//                    <button class="view-btn">View Component <i class="fa-solid fa-arrow-right-long"></i></button>
//                </a>
//                <div class="heart-wrapper">
//                    <i class="${iconClass} fa-heart like-icon" onclick="toggleLike(this, '${item.name}')"></i>
//                </div>
//            </div>
//        </div>
//    `;
//}