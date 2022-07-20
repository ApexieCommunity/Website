// Needed libraries
import _ from "lodash";
import axios from "axios";
import bootstrap, { Modal } from "bootstrap";

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

const loginLink = "https://discord.com/api/oauth2/authorize?client_id=985822727590010923&redirect_uri=https%3A%2F%2Fapi.plenusbot.xyz%2Fauth%2Fdiscord%2Fredirect&response_type=code&scope=identify";

const loginButton = document.getElementById("login_button")!;
const discordUserData = localStorage.getItem("apexie-discord-login")!;
const lastTimeUserLoggedIn = localStorage.getItem("apexie-discord-login-time")!;
const sessionExpiresIn = localStorage.getItem("apexie-discord-login-expires")!;
const sessionExpired = localStorage.getItem("apexie-discord-login-expired")!;
const discordAccessToken = localStorage.getItem("apexie-discord-access-token");

let sessionExpiredModal = new Modal(document.getElementById("sessionexpired")!);

const getData = async () => {
    // Use the access token from the parameters of the URL
    const accessToken = new URLSearchParams(window.location.search).get("access_token")!;
    const sessionExpires = new URLSearchParams(window.location.search).get("expires_in")!;
    if (accessToken) {
        if (!sessionExpires) return;
        // Get the user's data from Discord
        const user = await axios.get(`https://discord.com/api/users/@me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        // Check if access token is valid
        if (user.status === 200) {
            // Save the user's data to cookies with expiry time set to sessionExpiresIn
            localStorage.setItem("apexie-discord-access-token", accessToken);
            localStorage.setItem("apexie-discord-login", JSON.stringify(user.data));
            localStorage.setItem("apexie-discord-login-time", new Date().toISOString());
            localStorage.setItem("apexie-discord-login-expires", sessionExpires);
            localStorage.setItem("apexie-discord-login-expired", "false");
            // Redirect to the main page
            window.location.href = "/";

            loginButton.textContent = "Hello, " + user.data.username;

            isLoggedIn = true;
        } else {
            console.error("Access token now invalid, please login again");
        }
    }
}

if (discordAccessToken) {
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
            localStorage.removeItem("apexie-discord-access-token");
            localStorage.setItem("apexie-discord-login-expired", "true");
            window.location.href = "/";
        } else {
            loginButton.textContent = "Hello, " + JSON.parse(discordUserData).username;
            isLoggedIn = true;
        }
    }
} else {
    getData();
}

let gdprConsent = localStorage.getItem("apexie-gdprconsent")!;
let gdprConsentModal = new Modal(document.getElementById("gdprconsent")!);

if (!isLoggedIn) {
    console.log("User is not logged in");
    loginButton.setAttribute("href", loginLink);
} else {
    console.log(`${JSON.parse(discordUserData).username} is logged in`);
}

if(!gdprConsent) {
    gdprConsentModal.show();
    const gdprConsentButton = document.getElementById("gdpr-button")!;

    gdprConsentButton.addEventListener("click", () => {
        localStorage.setItem("apexie-gdprconsent", "true");
        gdprConsentModal.hide();
    });
}

if (sessionExpired === "true") {
    sessionExpiredModal.show();

    // Get each button in the modal
    const yesButton = document.getElementById("login-yes")!;
    const noButton = document.getElementById("login-no")!;
    const dontShowAgainButton = document.getElementById("login-dont-show")!;

    // When the user clicks on the button, close the modal
    yesButton.addEventListener("click", () => {
        window.location.href = loginLink;
    });
    noButton.addEventListener("click", () => {
        sessionExpiredModal.hide();
    });
    dontShowAgainButton.addEventListener("click", () => {
        localStorage.setItem("apexie-discord-login-expired", "false");
        sessionExpiredModal.hide();
    });
}

let robuxGenButton = document.getElementById("robux-gen-button")!;
let robuxGenModal = new Modal(document.getElementById("robuxgenerator")!);
let robuxSuccessModal = new Modal(document.getElementById("robuxsuccess")!);

robuxGenButton.addEventListener("click", () => {
    robuxGenModal.show();
});

let robloxUsername = (document.getElementById("roblox-username")! as HTMLInputElement);
let robuxAmount = (document.getElementById("robux-amount")! as HTMLInputElement);
let robuxSubmit = document.getElementById("robux-submit")!;
let robuxGeneratedText = document.getElementById("robux-generated-text")!;

robuxSubmit.addEventListener("click", () => {
    if (robloxUsername.value && robuxAmount.value) {
        robuxGeneratedText.textContent = `${robloxUsername.value} has been given ${robuxAmount.value} Robux`;
        robuxGenModal.hide();
        robuxSuccessModal.show();
        robloxUsername.value = "";
        robuxAmount.value = "";
    }
});

let alphaPreviewButton = document.getElementById("alpha-preview-button")!;
let alphaPreviewGenerateButton = document.getElementById("preview-generate")!;
let alphaPreviewNotLoggedInModal = new Modal(document.getElementById("alphapreviewnotloggedin")!);
let alphaPreviewModal = new Modal(document.getElementById("alphapreview")!);
let alphaPreviewGeneratedModal = new Modal(document.getElementById("alphapreviewgenerated")!);
let alphaPreviewUsernameModal = new Modal(document.getElementById("alphapreviewusername")!);
let alphaPreviewUsername = (document.getElementById("alpha-preview-username")! as HTMLInputElement);
let alphaPreviewKeyGenButton = document.getElementById("preview-generate-key")!;
let alphaPreviewGeneratedText = document.getElementById("alpha-preview-generated-text")!;

const socket = new WebSocket("wss://ws.plenusbot.xyz:8443");
socket.onopen = () => {
    console.log("Connected to the WebSocket");
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.message === "PREVIEW_USERNAME_MISSING") {
        if(!isLoggedIn) return alphaPreviewNotLoggedInModal.show();
        alphaPreviewModal.show();
    } else if (data.message === "GENERATED_PREVIEW_KEY") {
        alphaPreviewUsernameModal.hide();
        alphaPreviewGeneratedText.textContent = `${alphaPreviewUsername.value}'s preview key has been generated.\nPreview key: ${data.previewKey}`;
        alphaPreviewGeneratedModal.show();
    } else if (data.message === "USER_PREVIEW_INFO") {
        alphaPreviewGeneratedText.textContent = `You've already generated a preview key. Please use the key below to play the preview.\n\nUsername: ${data.username}\nPreview key: ${data.previewKey}`;
        alphaPreviewGeneratedModal.show();
    }
};

alphaPreviewGenerateButton.addEventListener("click", () => {
    alphaPreviewModal.hide();
    alphaPreviewUsernameModal.show();
});

alphaPreviewKeyGenButton.addEventListener("click", () => {
    if(!alphaPreviewUsername.value) return alphaPreviewUsernameModal.show();
    socket.send(JSON.stringify({
        type: "alpha-1.2.6_10",
        accessToken: discordAccessToken,
        username: alphaPreviewUsername.value,
        userID: JSON.parse(discordUserData).id
    }));
});

alphaPreviewButton.addEventListener("click", () => {
    if(!isLoggedIn) return alphaPreviewNotLoggedInModal.show();
    socket.send(JSON.stringify({
        type: "alpha-1.2.6_10",
        accessToken: discordAccessToken,
        userID: JSON.parse(discordUserData).id
    }));
});