// colorMode.js
export function initColorMode() {
    const darkSwitch = document.getElementById("darkSwitch");
    if (!darkSwitch) return;

    function initTheme() {
        const darkPrefered = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const darkThemeSelected = 
            localStorage.getItem("darkSwitch") !== null &&
            localStorage.getItem("darkSwitch") === "dark";
        const lightThemeSelected =
            localStorage.getItem("darkSwitch") !== null &&
            localStorage.getItem("darkSwitch") === "light";

        if (lightThemeSelected || (!darkThemeSelected && !darkPrefered)) {
            document.documentElement.setAttribute("color-theme", "light");
            darkSwitch.checked = false;
        } else {
            document.documentElement.setAttribute("color-theme", "dark");
            darkSwitch.checked = true;
        }
    }

    function resetTheme() {
        if (darkSwitch.checked) {
            document.documentElement.setAttribute("color-theme", "dark");
            localStorage.setItem("darkSwitch", "dark");
        } else {
            document.documentElement.setAttribute("color-theme", "light");
            localStorage.setItem("darkSwitch", "light");
        }
    }

    // Set up initial theme
    initTheme();

    // Add change listener
    darkSwitch.addEventListener("change", resetTheme);
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener("load", initColorMode);
}
