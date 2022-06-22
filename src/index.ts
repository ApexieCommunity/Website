// Needed libraries
import _ from "lodash";
import axios from "axios";

// Warning for users who open the DevTools console of the website
console.log("%cWARNING!!!" +
    "\n\n%cThis console is meant to be used by developers to debug their code. If someone else tells you to open the DevTools and paste code here, please do not do so.",
    "color: red; font-size: 30px;",
    "color: black; font-size: 15px;");

// Service worker registration for offline support
const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register(
                'sw.js',
                {
                    scope: '/',
                }
            );
            if (registration.installing) {
                console.log('Service worker installing');
            } else if (registration.waiting) {
                console.log('Service worker installed');
            } else if (registration.active) {
                console.log('Service worker active');
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

registerServiceWorker();

let isLoggedIn: boolean = false;

const loginButton = document.getElementById("login_button")!;
const discordUserData = localStorage.getItem("apexie-discord-login");
const lastTimeUserLoggedIn = localStorage.getItem("apexie-discord-login-time");
const sessionExpiresIn = localStorage.getItem("apexie-discord-login-expires");

const getData = async () => {
    // Use the access token from the parameters of the URL
    const accessToken = new URLSearchParams(window.location.search).get("access_token");
    const sessionExpiresIn = new URLSearchParams(window.location.search).get("expires_in");
    if (accessToken) {
        if (!sessionExpiresIn) return;
        // Get the user's data from Discord
        const user = await axios.get(`https://discord.com/api/users/@me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // Check if access token is valid
        if (user.status === 200) {
            // Save the user's data to cookies with expiry time set to sessionExpiresIn
            localStorage.setItem("apexie-discord-login", JSON.stringify(user.data));
            localStorage.setItem("apexie-discord-login-time", new Date().toISOString());
            localStorage.setItem("apexie-discord-login-expires", sessionExpiresIn);
            // Redirect to the main page
            window.location.href = "/";

            loginButton.textContent = "Hello, " + user.data.username;

            isLoggedIn = true;
        } else {
            console.error("Access token now invalid, please login again");
        }
    }
}

if (discordUserData) {
    // If session expired, delete the data
    if (lastTimeUserLoggedIn && sessionExpiresIn) {
        const lastTimeUserLoggedInDate = new Date(lastTimeUserLoggedIn);
        // Session expires in is in seconds, convert to new Date() format
        const sessionExpiresInDate = new Date(lastTimeUserLoggedInDate.getTime() + parseInt(sessionExpiresIn) * 1000);
        // If session expired, delete the data
        if (sessionExpiresInDate < new Date()) {
            localStorage.removeItem("apexie-discord-login");
            localStorage.removeItem("apexie-discord-login-time");
            localStorage.removeItem("apexie-discord-login-expires");
        } else {
            loginButton.textContent = "Hello, " + JSON.parse(discordUserData).username;
            isLoggedIn = true;
        }
    }
} else {
    getData();
}

if (!isLoggedIn) {
    loginButton.setAttribute("href", "https://discord.com/api/oauth2/authorize?client_id=985822727590010923&redirect_uri=https%3A%2F%2Fapi.plenusbot.xyz%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify");
}