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

document.addEventListener("DOMContentLoaded", () => {
    // 1. Extract the filter from the URL (?filter=buttons)
    const urlParams = new URLSearchParams(window.location.search);
    const filterValue = urlParams.get('filter');

    // 2. Select all your component cards/items
    const items = document.querySelectorAll('.component-item');

    if (filterValue) {
        filterComponents(filterValue);
    }

    function filterComponents(category) {
        items.forEach(item => {
            // If category is 'all' or matches the data-category attribute
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block'; 
            } else {
                item.style.display = 'none';
            }
        });
    }
});
