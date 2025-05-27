import PWANavigator from "./navigator/navigator.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("PWA is running!");
  new PWANavigator().init();
});
