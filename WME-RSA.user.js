// ==UserScript==
// @name         WME Road Divider Assitant
// @namespace    https://greasyfork.org/en/users/286957-skidooguy
// @version      2020.10.21.00
// @description  Automates the workflow of dividing segments
// @author       SkiDooGuy
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global $ */
/* global OL */
/* global _ */
/* global require */


/* Outline
enable on settings tab?
only pop-up on seg select

Scripting cheat sheet: https://docs.google.com/spreadsheets/d/1CABHi-_nM_5tjmTkUkwXCl0N0Apynb-_mjEWopNvTD8/edit#gid=1072019982
cut segment
change new segs to 1-way
(save?)
move HNs to correct segment
(save)
editor connects seg/verify turns
(save)
Verify HN placement
(save)
Done(?)
*/
let UpdateObj;
let SplitSegs;
let AddHN;
let DelHN;

console.log('RoadDividerAssistant(RDA): initializing...');

function rdaBootstrap(tries = 0) {
    if (W && W.map && W.model && W.loginManager.user && $ && WazeWrap.Ready) {
        initRDA();
    } else if (tries < 500) {
        setTimeout(() => {
            rdaBootstrap(tries + 1);
        }, 200);
    } else {
        console.error('RDA: Failed to load');
    }
}

function initRDA() {
    UpdateObj = require('Waze/Action/UpdateObject');
    SplitSegs = require('Waze/Action/SplitSegments');
    AddHN = require('Waze/Actions/AddHouseNumber');
    DelHN = require('Waze/Actions/DeleteHouseNumber');

    // Create UI elements
    const $rdaContainer = $('<div class="form-group" />');
    const $rdaContLabel = $('<label class="control-label">Road Divider Assistant (RDA)</label>');
    const $rdaControls = $('<div class="controls-container" />');
    const $rdaChkEn = $('<input type="checkbox" name="rdaChkEn" id="rdaChkEn">');
    const $rdaChkEnLbl = $('<label for="rdaChkEn">Enable RDA</label>');

    $rdaChkEn.appendTo($rdaControls);
    $rdaChkEnLbl.appendTo($rdaControls);
    $rdaContLabel.appendTo($rdaContainer);
    $rdaControls.appendTo($rdaContainer);

    // Attach elements to UI
    $rdaContainer.appendTo('#sidepanel-prefs > div > div > form');
    
}

rdaBootstrap();
