// ==UserScript==
// @name         WME Road Shield Assisstant
// @namespace    https://greasyfork.org/en/users/286957-skidooguy
// @version      2021.03.23.01
// @description  Adds shield information display to WME 
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

*/
const debugLevel = 2;
const GF_LINK = '1';
const FORUM_LINK = '2';
const RSA_UPDATE_NOTES = 'updates';
const iconImgs = {
    extRgtGrn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAyCAYAAADGMyy7AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAtxJREFUeNrt2l9IU1EcB/DfOdc/W62cfwj7g86wepSCQGLFyAW9iIT1EBVC+lARNIgiTXqQIoWIhOipHiyCFAwiEB+01p9B/x4mSDqEXLWGaK2tFIdt93TuyLhElLue6d29vy8c7r1n3HH4cO65v3s3AqrYL7scBOghAOYGII5f3SW82WD5k+AtBLoLG2WE9ufSZPfUWe/EfC/5jdpec4owdoXv5gBGS6YJkKZI82C3ciCpUK/xXYo+mpPH237LHoc/PhAMSEUdrg3ASB+iigkhZG+ps7yTMpk24OUvcskFeyxfqqcMmAs1RNsyF+ULbiVSCF4OgFXiupqhICzCIiwGYTMXU9SvzrIqqCrdDLY864LPicWn4f6IFyZnIgj7t1yqOQHHt9drOrdt9zG4/qoH2rw3cSlQp9haAEe31mq/nKkEnuqDsLFwPcKqo1z++Tl5i/6edatKEFadl5+G4ctsDKsC0ZmZm4UjvRdSW4QVnBehYTjQc27JcU1Rxy4HrmkeEJYa11RPXgquUpcirODUbtkFp3ccRljRqLfqWlNFP8JmKaopYP+FmpCT0PG8KyM3NGpm1MYHFzns7YxUC9TMqA8DTxdUisUTPxA2XdT/1bnh71PgnwikPQbJ6q7w8K3dzKjzCX2bhGfv/VBWUAoO+1oYmRqHloEbMBb5mO4wgjlmn6l/5k34Ley7dwbWrCzS/OuBoZYCEajqLAbVMLCiUbEq4NlUXKY7VEPANm2r0x2qIWCVO7jeUA0Be2eoT3eohqhjx6NhGJoYgwKLDQbfvQZP/1XwfRha7mFlfx2rzNC+MV+q6Sn43y2ERVgMwiJsNsKyEDKIDglRwogXIQSzclNKQL6LFEITl+eSvdLsYPCztabCAgScaCJiupKT0dbHvtRrofjO8icrcslqvluNMtofAnlr+dr8qDPlq/6ksN3tZExu4J1ufuhAqwVllBDol5NyV/S81z/f+RNk9EUMEMkLUQAAAABJRU5ErkJggg==',
    extRgtBrn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAyCAYAAADGMyy7AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAArFJREFUeNrt3E1oE0EYBuB3Z9OQSqpFUmi0Siw5FOnNg4JFI1hEL1qqWKhUFA8FRT2qeNCD4CHiz00UpAexoc1BUOihWAstKhQsNJYUi785LJiWYFMa7Wbj7GpgBantdtJsdr8XlswsbA4Pk5lv/yLBlKEOhDwFdBaA/bwb+rM7wDc/yh+VbynYLQUkCxIGNA2xfX1QirulYmP4OC7wTpQ3PaBYSZYDn9nbi5jekU2od3iTkY/leLnh0VPNGH/0DlPSUCcaZBUfaaQKSyZfjSDzqDhJqEJTyxbQzvhCFSELseFTQkSfU8NEITxhWqxKFIIlWIKlEGzp4or6dcP2CGoad4D5ln/JIz+fwbdXMfzMKAT7rzR23cbmQxctHbvtRBSpZ1F8enKZpgJzqmoCCLZ2Wy/0ZQ+2HL6E6vowwZrj13/+Vb5Vf493YwPBmvN9ahSLc2mqCkQnn8ti8lab8UmwokdtcgSJmwfXHNcVdWw5cF1zgrDWuK4689Jx9bqUYAUnsLMdW9uuEqxo1KbzvUbRT7AViuoK2KVQC3kVn/uvlWRBY25GTd7rwJf+6yWpFpibUdNv4ssqxbTFHMGuFPV/de6P2RSyH8YI1gqqGXfiRisyE4NGf/5rAtMPuo3jVhoPof6dufevDVxvbb3luweOGrEiUM1ZDapjYEWjUlXAs25Tk+1QHQEbPHDWdqiOgPXVhWyH6ghY5cVD26E6otyaffsck9Ejxm3uBWUayuB9o/4sdyoeVh+hM2NPjc1OoWe3CJZgKQRLsBUIK9nw/dRKDzdlEvCSJASXgNyUqRIeE4XQ5LQc4nJPAunTzdAfIm0hEyGj9VwkjlHj7e+uOgwzP9bz5i6isRxVknBlTwx3f0+zpowcQ4vGjJeWzX8EQVlynUKSj9IBWUPP7j6MF/f/AjaBMjGmYxeKAAAAAElFTkSuQmCC',
    extLftGrn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAyCAYAAADGMyy7AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAwdJREFUeNrt219IU1EcB/DfuZu6qaRzEmLSNlgsIoj+0R5WDF1/CLIiDSrCF3sJYUEUWb41mEZCvvdQD2YW9WBaIq3WPzB6GRakhTlkhWROV66ttd3TuaPFMGN6d7dp9/eFw87OuHfw4ezc3+7ZCCSl1GnVE+COAVAbANH/Hi5nrRhynyhrPlhyocOUcP15XKx78qx7IjFK/qC21tgJpZdZVwkYMZklQBr9za5u4YkiCfUK63LoIzr5rNWpduo94YfeEUVZm7UKKLmPqNKEELKnwqLr4CjPNeDHX8olF0oDBYpDHAVqRQ2pbamVYwuuESkkXg6AGnFdzVAQFmERFoOwmUva9evGChPsMm5b1DFT3wMwMPoSxgMTCDs3JapiuH3YCVsq14k6/mI0AgdvnoFB3xtcCpLTuGm/aFQhBcp8sJuP4Bo7NwbNqrTf3Fy1HmEzEdfYK4SVOsLaan/QjrBSo9bfOgfBSAhhEXUJw8oFNauwUT4GTX2XZIGaVVglp4CuOgesLCpDWKmzRrsa7h1tlwVu1i9ecsHNGKxwoeoZfipbXC5TqMLVv7HHIVtc0bA/opGUJZVQCcgVV6G2GU6xx9LFHugPfYXjG/amrFN5SqH33XMwaXVgKtf9dR5tYQnsNpqhZ+QZBH/+N6WYVzTsp2+TUJSnjmPF2MzsHOqHk31t89apMsT1Eo2zeox19GLPINxXVbEWCM8uqJa9WtsCtWt3zPv6+6lx2HfjNHwO+pe5K3WLnrGJCLP1X+utjGeuN23YxUYmuN6c3DZcSLXQVe/AOjYTuMLu73Leusnp1kwqXIOmEmGlxhWqjLtv3csWdkn84DiBW/16K5zYfAA+TH+Ea57eBVcbCJsCd2B0MN7wJgwGYREWYTEImxtY6kMGqUN8HKHEjRASszJTjgDfiRSSJsxHYncUIZf3i7rGoAICFjSRYrqSppmWxy/i//4Ob9c9KcwjK1jXjDLivzyydn66+VFH3Df5FU2rzUIp38AGbZDGdo3MMkwI9PMx/vrMBbcnMfgLpSxT8hIX9P0AAAAASUVORK5CYII=',
    extLftBrn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAyCAYAAADGMyy7AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAutJREFUeNrt3E9o01AcB/Bvkra0tSt1VNzmhKoTS60ehuDAoh2oKIoXJ1MGjoqeHOpJxYMHQfCwg3rxz0HtQbTM4UHEHYRuYwrDg5NNqHNgD0M61s0ypitdmvhSLZY5ZpclXWd+Xwh9eW0ofHi890ualENBosfhMclokYG9bNfzu9vNNgeWPyLbRlFukRGTOXRJEiKNHUjku7l8o6cZ59lOO2uaQFGTaQZ8es9TRJQdoQD1Jmvy5KM6FmbYFPJj4OFHfOKiLagVRHyhkapZUlkbqnmTiFZC1TQufgZHebZQBclC27ApIajMqXVEoXnqaLHSKQRLsARLIVj9suT61bFxByrrDy3upH8qicn3L5EejxPsXweucsF/+RUqNjeoOn7DbDsGr+/DVKyPpoLCVO8/qxo198VmK9YfuURz7NzYqpZ+XuHcEiBYPfLtQxfBah1lbv18/wzBao06dOMgsulpgiXUMoY1CmpJYeWsiOG7IUOglhSWE0zwXXwBi6uKYLWOvcaLbVejhsAt+eJlFFzdYJWFKtn/zLC4vF6oyuofu33CsLiqYaVM+p8llVIJGBVXNexYb7ioOtWouELIjwvs1bXYAzOToxCsDtjX+SBLIsaiDzB8p3X+OlWWMPHuOey1vtw2N+YKNyrrD2Oiv/N/qXPjXG9z7vYij+ohb7aCt1ghfk8VVct6zz2Be2fTvO//+BrD4LVGZFKJlQ7brXrE/hmMIqTZdLEfNsrIjZe8jjXKnLsslw2Lwd3KTn8JVgdc5ddfpzdAsHrg2tZuIlitcZUqY/xtZMXClsUNx3nc1dsfoeZAG2YSI0i8vld8tUGwC+Mqd8coG12EoRAswRIshWCXBZYrw+dTV3qYKc8B3SShcenITHmRw2Oi0DRpKY1OITyE5Ck/rKwjQCaajNa2YCfe5J7+PrkGPbwDTtZsIBrVETkOV3ZHcOvXNFuQvmMISHzuoeXCP4KgLLhOIcZGaZcgIbyrAwP5/p9mQTRGoZXh1gAAAABJRU5ErkJggg=='
}

let rsaSettings;
let UpdateObj;
let rsaMapLayer;
let iconHeight = 30;
let iconWidth = 50;

console.log('RSA: initializing...');

function rsaBootstrap(tries = 0) {
    if (W && W.map && W.model && W.loginManager.user && $ && WazeWrap.Ready) {
        initRSA();
    } else if (tries < 500) {
        setTimeout(() => {
            rsaBootstrap(tries + 1);
        }, 200);
    } else {
        console.error('RSA: Failed to load');
    }
}

function initRSA() {
    UpdateObj = require('Waze/Action/UpdateObject');

    const rsaCss = [
        '.rsa-wrapper {position:relative;width:100%;font-size:12px;font-family:"Rubik", "Boing-light", sans-serif;user-select:none;}',
        '.rsa-section-wrapper {display:block;width:100%;padding:4px;}',
        '.rsa-section-wrapper.border {border-bottom:1px solid grey;margin-bottom:5px;}',
        '.rsa-option-container {padding:3px;}',
        '.rsa-option-container.sub {margin-left:10px;}',
        'input[type="checkbox"].rsa-checkbox {position:relative;top:3px;vertical-align:top;margin:0;}',
        'input[type="text"].rsa-color-input {position:relative;width:70px;padding:3px;border:2px solid black;border-radius:6px;}',
        'input[type="text"].rsa-color-input:focus {outline-width:0;}',
        'label.rsa-label {position:relative;max-width:90%;font-weight:normal;padding-left:5px}'
    ].join(' ');

    const $rsaTab = $('<div>');
    $rsaTab.html = ([
        `<div class='rsa-wrapper' id='rsa-tab-wrapper'>
            <div style='margin-bottom:10px;'><span style='font-weight:bold;'>Road Shield Assistant</span> - v${GM_info.script.version}</div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowSegShields' />
                <label class='rsa-label' for='rsa-ShowSegShields'>Show Segment Shield Info</label>
            </div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-HighNodeShields' />
                <label class='rsa-label' for='rsa-HighNodeShields'>Highlight Nodes with Shields</label>
            </div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowNodeShields' />
                <label class='rsa-label' for='rsa-ShowNodeShields'>Show node shields</label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowTurnShields' />
                <label class='rsa-label' for='rsa-ShowTurnShields'>Include turn icons (if exist)</label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=checkbox class='rsa-checkbox' id='rsa-ShowTurnTTS' />
                <label class='rsa-label' for='rsa-ShowTurnTTS'>Include TTS</label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=checkbox class='rsa-checkbox' id='rsa-AlertTurnTTS' />
                <label class='rsa-label' for='rsa-AlertTurnTTS'>Alert if TTS is different from default</label>
            </div>
            <div class='rsa-option-container sub'>
                <input type=checkbox class='rsa-checkbox' id='rsa-NodeShieldMissing' />
                <label class='rsa-label' for='rsa-NodeShieldMissing'>Highlight nodes that might be missing shields</label>
            </div>
            <br>
            <img src=${iconImgs.extRgtGrn} height=${iconHeight} width=${iconWidth}>
            <img src=${iconImgs.extRgtBrn} height=${iconHeight} width=${iconWidth}>
            <img src=${iconImgs.extLftGrn} height=${iconHeight} width=${iconWidth}>
            <img src=${iconImgs.extLftBrn} height=${iconHeight} width=${iconWidth}>
        </div>`
    ].join(' '));
    
    new WazeWrap.Interface.Tab('RSA', $rsaTab.html, setupOptions);
    $(`<style type="text/css">${rsaCss}</style>`).appendTo('head');
    WazeWrap.Interface.ShowScriptUpdate(GM_info.script.name, GM_info.script.version, RSA_UPDATE_NOTES, GF_LINK, FORUM_LINK);
    console.log('RSA: loaded');
}

async function setupOptions() {
    await loadSettings();

    // Create OL layer for display
    rsaMapLayer = new OpenLayers.Layer.Vector('rsaMapLayer', { uniqueName: 'rsaMapLayer' });
    W.map.addLayer(rsaMapLayer);
    rsaMapLayer.setVisibility(true);

    // Set user options
    function setEleStatus() {
        setChecked('rsa-ShowSegShields', rsaSettings.ShowSegShields);
        setChecked('rsa-HighNodeShields', rsaSettings.HighNodeShields);
        setChecked('rsa-ShowNodeShields', rsaSettings.ShowNodeShields);
        setChecked('rsa-ShowTurnShields', rsaSettings.ShowTurnShields);
        setChecked('rsa-ShowTurnTTS', rsaSettings.ShowTurnTTS);
        setChecked('rsa-AlertTurnTTS', rsaSettings.AlertTurnTTS);
        setChecked('rsa-NodeShieldMissing', rsaSettings.NodeShieldMissing);

        function setChecked(ele, status) {
            $(`#${ele}`).prop('checked', status);
        }
    }

    // Register event listeners
    WazeWrap.Events.register('selectionchanged', null, tryScan);
    WazeWrap.Events.register('moveend', null, tryScan);

    setEleStatus();

    $('.lt-checkbox').change(function () {
        let settingName = $(this)[0].id.substr(4);
        rsaSettings[settingName] = this.checked;
        saveSettings();
    });
}

async function loadSettings() {
    const localSettings = $.parseJSON(localStorage.getItem('rsa_Settings'));
    const serverSettings = await WazeWrap.Remote.RetrieveSettings('rsa_Settings');
    if (!serverSettings) {
        console.error('RSA: Error communicating with WW settings server');
    }

    const defaultSettings = {
        lastSaveAction: 0,
        ShowSegShields: true,
        HighNodeShields: true,
        ShowNodeShields: true,
        ShowTurnShields: true,
        ShowTurnTTS: true,
        AlertTurnTTS: true,
        NodeShieldMissing: true
    };

    rsaSettings = $.extend({}, defaultSettings, localSettings);
    if (serverSettings && serverSettings.lastSaveAction > rsaSettings.lastSaveAction) {
        $.extend(rsaSettings, serverSettings);
        // console.log('RSA: server settings used');
    } else {
        // console.log('RSA: local settings used');
    }

    // If there is no value set in any of the stored settings then use the default
    Object.keys(defaultSettings).forEach((funcProp) => {
        if (!rsaSettings.hasOwnProperty(funcProp)) {
            rsaSettings[funcProp] = defaultSettings[funcProp];
        }
    });
}

async function saveSettings() {
    const {
        ShowSegShields,
        HighNodeShields,
        ShowNodeShields,
        ShowTurnShields,
        ShowTurnTTS,
        AlertTurnTTS,
        NodeShieldMissing
    } = rsaSettings;

    const localSettings = {
        lastSaveAction: Date.now(),
        ShowSegShields,
        HighNodeShields,
        ShowNodeShields,
        ShowTurnShields,
        ShowTurnTTS,
        AlertTurnTTS,
        NodeShieldMissing
      
    };

    /* // Grab keyboard shortcuts and store them for saving
    for (const name in W.accelerators.Actions) {
        const {shortcut, group} = W.accelerators.Actions[name];
        if (group === 'wmelt') {
            let TempKeys = '';
            if (shortcut) {
                if (shortcut.altKey === true) {
                    TempKeys += 'A';
                }
                if (shortcut.shiftKey === true) {
                    TempKeys += 'S';
                }
                if (shortcut.ctrlKey === true) {
                    TempKeys += 'C';
                }
                if (TempKeys !== '') {
                    TempKeys += '+';
                }
                if (shortcut.keyCode) {
                    TempKeys += shortcut.keyCode;
                }
            } else {
                TempKeys = '-1';
            }
            localSettings[name] = TempKeys;
        }
    }

    // Required for the instant update of changes to the keyboard shortcuts on the UI
    rsaSettings = localSettings; */

    if (localStorage) {
        localStorage.setItem('RSA_Settings', JSON.stringify(localSettings));
    }
    const serverSave = await WazeWrap.Remote.SaveSettings('RSA_Settings', localSettings);

    if (serverSave === null) {
        console.warn('RSA: User PIN not set in WazeWrap tab');
    } else {
        if (serverSave === false) {
            console.error('RSA: Unable to save settings to server');
        }
    }
}

function getId(ele) {
    return document.getElementById(ele);
}

function tryScan() {
    function scanNode(node) {
        let conSegs = node.attributes.segIDs;

        for(let i=0; i < conSegs.length; i++) {
            let seg1 = W.model.segments.getObjectById(conSegs[i]);
            for(let j=0; j < conSegs.length; j++) {
                let seg2 = W.model.segments.getObjectById(conSegs[j]);
                processNode(node, seg1, seg2);
            }
        }
    }

    function scanSeg(seg) {
        processSeg(seg);
    }

    removeHighlights();
    const selFea = W.selectionManager.getSelectedFeatures();
    if (selFea.length > 0) {
        rsaLog('Selected stuff', 2);
    } else {
        rsaLog('General Scan', 2);

        // Scan all nodes on screen
        if(getId('rsa-HighNodeShields').checked || getId('rsa-ShowNodeShields').checked) {
            _.each(W.model.nodes.getObjectArray(), n => {
                scanNode(n);
            });
        }

        // Scan all segments on screen
        if(getId('rsa-ShowSegShields').checked) {
            _.each(W.model.segments.getObjectArray(), s => {
                scanSeg(s);
            });
        }
       
    }
}

function processSeg(seg) {
    rsaLog('Seg Scan', 2);
}

function processNode(node, seg1, seg2) {
    let turn = W.model.getTurnGraph().getTurnThroughNode(node,seg1,seg2);
    let turnData = turn.getTurnData();
    let hasGuidence = turnData.hasTurnGuidance();

    if (hasGuidence) {
        let hasExitShield = turnData.turnGuidance.exitSigns.length > 0;
        let hasShields = !$.isEmptyObject(turnData.turnGuidance.roadShields)
        //rsaLog(`Node: ${node.attributes.id}`, 3);
        //rsaLog(`Exit Shield: ${hasExitShield}`, 3);
        //rsaLog(`Shield: ${hasShields}`, 3);

        if(getId('rsa-HighNodeShields').checked) {
            createHighlights(node);
        }
    }
    
}

function isShieldCandidate() {

}

function displayNodeShields(node) {

}

function createHighlights(obj, overSized = false) {
    rsaLog('Highlights fired', 2);
    const geo = obj.geometry.clone();
    const newVector = new OpenLayers.Feature.Vector(geo, {});
    rsaMapLayer.addFeatures([newVector]);

    console.log(geo);
    if(obj.type == 'node') {
        const node = document.getElementById(geo.id);
        node.setAttribute('fill', 'orange');
        node.setAttribute('fill-opacity', '0.9');
        node.setAttribute('stroke-width', '0');
        node.setAttribute('r', overSized ? '18' : '10');
    } else {
        nodeStyle.fillColor = 'green';
    }
}

function removeHighlights() {
    rsaMapLayer.removeAllFeatures();
}

function rsaLog(msg, lvl) {
    if (lvl === 2) console.log(msg);
    if (lvl === 3) console.warn(msg);
    if (lvl === 4) console.error(msg)
}

rsaBootstrap();
