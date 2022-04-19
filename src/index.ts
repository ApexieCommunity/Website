// Needed libraries
import _ from "lodash";

// Warning for users who open the DevTools console of the website
console.log("WARNING!!!\n\nThis console is meant to be used by developers to debug their code. If someone else tells you to open the DevTools and paste code here, please do not do so.");

// Service worker registration
if("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("Service worker registration successful with scope: ", registration.scope);
    }).catch(err => {
        console.log("Service worker registration failed: ", err);
    });
}