function toggleMenu() {
    const menu = document.getElementById('userDropdown');
    if (menu) {
        menu.classList.toggle('show');
        console.log("Menu toggled!"); // Debug check: look at your browser console (F12)
    } else {
        console.error("Dropdown element not found");
    }
}

// 2. Updated Auth Fetch
fetch('/check-auth')
    .then(res => res.json())
    .then(data => {
        if (data.loggedIn) {
            const navButtons = document.querySelector('.navAuth');
            if (navButtons) {
                navButtons.innerHTML = `
                    <div class="user-menu-container">
                        <button type="button" class="user-menu-trigger" id="menuBtn">
                            <i class="fa-solid fa-user"></i> ${data.username}
                        </button>
                        <div id="userDropdown" class="user-dropdown-content">
                            <a href="/frontend/Pages/Favourites-Page/favourites.html">My Favorites</a>
                            <a href="/logout" style="color: red;">Logout</a>
                        </div>
                    </div>
                `;
                
                // 3. Attach listener manually (Safer than inline onclick)
                document.getElementById('menuBtn').addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevents the window click from closing it instantly
                    toggleMenu();
                });
            }
        }
    });


const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
});

window.addEventListener('click', () => {
    const menu = document.getElementById('userDropdown');
    if (menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
    }
});
