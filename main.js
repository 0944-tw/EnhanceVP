// ==UserScript==
// @name         Enhance VP (External Loader)
// @namespace    https://github.com/ImLoadingUuU/EnhanceVP
// @version      2023-12-31
// @description  Enhance VP 
// @author       You
// @match        *://cpanel.infinityfree.com/panel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=infinityfree.com
// @grant        none
// @require 
// ==/UserScript==
// Module Loader
function loadJS(FILE_URL, async = true) {
    let scriptEle = document.createElement("script");
  
    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", async);
  
    document.body.appendChild(scriptEle);
  
    // success event 
    scriptEle.addEventListener("load", () => {
      console.log("File loaded")
    });
     // error event
    scriptEle.addEventListener("error", (ev) => {
      console.log("Error on loading file", ev);
    });
  }
console.log("Enhance VP Loader")
console.log("EnhanceVP By MeTooIDK, MIT License. Please Credit In Commercial Use")
console.log("DO NOT REMOVE CREDIT")
loadJS("https://cdn.jsdelivr.net/gh/ImLoadingUuU/EnhanceVP@main/enhancevp.js")