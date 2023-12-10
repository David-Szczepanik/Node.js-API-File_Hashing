(function () {
    let onpageLoadTheme = localStorage.getItem("theme") || "";
    let onpageLoadIcon = localStorage.getItem("icon") || "sun";
    let element = document.body;

    if (onpageLoadTheme !== "") {
        element.classList.add(onpageLoadTheme);
    }

    let themeElement = document.getElementById("theme");
    if (themeElement) {
        themeElement.textContent = onpageLoadTheme || "light";
    }

    const icon = document.getElementById('icon') as HTMLImageElement;
    if (icon) {
        icon.src = `images/${onpageLoadIcon}.png`;
    }
})();

function themeToggle() {
    let element = document.body;
    element.classList.toggle("dark-mode");

    let theme = localStorage.getItem("theme");
    if (theme && theme === "dark-mode") {
        localStorage.setItem("theme", "");
        localStorage.setItem("icon", "sun");
    } else {
        localStorage.setItem("theme", "dark-mode");
        localStorage.setItem("icon", "moon");
    }

    let themeElement = document.getElementById("theme");
    if (themeElement) {
        themeElement.textContent = localStorage.getItem("theme") || "light";
    }

    const icon = document.getElementById('icon') as HTMLImageElement;
    if (icon) {
        icon.src = element.classList.contains('dark-mode') ? 'images/moon.png' : 'images/sun.png';
    }
}

const icon = document.getElementById('icon');
if (icon) {
    icon.onclick = themeToggle;
}
