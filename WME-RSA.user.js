// ==UserScript==
// @name         WME Road Shield Assistant
// @namespace    https://greasyfork.org/en/users/286957-skidooguy
// @version      2021.05.11.01
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

const debugLvl = 1;
const GF_LINK = 'https://greasyfork.org/en/scripts/425050-wme-road-shield-assisstant';
const FORUM_LINK = 'https://www.waze.com/forum/viewtopic.php?f=1851&t=315748';
const RSA_UPDATE_NOTES = `<b>NEW:</b><br>
- Moved "Include Ramps" to top section as it applies to all features<br><br>
<b>FIXES:</b><br>
- <br><br>`;

const RoadAbbr = {
    // Canada
    // 5000: Trans-Canada Hwy
    // 5063: Ontario - Regional Hwy - Generic
    40: {
        'Ontario': {
            'Hwy': 5063,
            'Trans-Canada Hwy': 5000
        }
    },

    // US
    235: {
        "Alabama": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SR-": 2019
        },
        "Alaska": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SR-": 2017
        },
        "Arizona": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SR-": 2022
        },
        "Arkansas": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "AR-": 2020,
            "AR-$1 SPUR": 2020
        },
        "California": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SH-": 1082,
            "SR-": 1082
        },   
        "Colorado": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SH-": 2025,
            "SR-": 2025
        },
        "Connecticut": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SH-": 2027,
            "SR-": 2027
        },
        "Delaware": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SH-": 7,
            "SR-": 7
        },
        "District of Columbia": {
            "DC-": 7
        },
        "Florida": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SH-": 2030,
            "SR-": 2030
        },
        "Georgia": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SH-": 2036,
            "SR-": 2036
        },
        "Hawaii": {
            'I-': 5,
            'US-': 6,
            "CR-": 2002,
            "SH-": 2041,
            "SR-": 2041
        },
        "Idaho": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2043,
            "SR-": 2043
        },
        "Illinois": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2044,
            "SR-": 2044
        },
        "Indiana": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2045,
            "SR-": 2045,
            "IN-": 2045
        },
        "Iowa": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 7,
            "SR-": 7,
            "IA-": 7
        },
        "Kansas": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2046,
            "SR-": 2046,
            "K-": 2046
        },
        "Kentucky": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 7,
            "SR-": 7,
        },
        "Louisiana": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 1117,
            "SR-": 1117,
            "LA-": 1117,
            "LA SPUR": 1115
        },
        "Maine": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2051,
            "SR-": 2051
        },
        "Maryland": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2053,
            "SR-": 2053,
            "MD-": 2053
        },
        "Massachusetts": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2055,
            "SR-": 2055
        },
        "Michigan": {
            'I-': 5,
            'US-': 6,
            'CR-': 2056,
            'M-': 2056,
            'SR-': 2056
        },
        "Minnesota": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2060,
            "SR-": 2060,
            "MN-": 2060
        },
        "Mississippi": {
            'I-': 5,
            'US-': 6,
            "SH-": 7,
            "SR-": 7,
            "MS-": 7
        },
        "Missouri": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2061,
            "SR-": 2061,
            "MO-": 2061
        },
        "Montana": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2063,
            "SR-": 2063
        },
        "Nebraska": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 7,
            "SR-": 7,
            "L-": 7,
            "N-": 7,
            "S-": 7
        },
        "Nevada": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2086,
            "SR-": 2086
        },
        "New Hampshire": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2076,
            "SR-": 2076
        },
        "New Jersey": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 7,
            "SR-": 7
        },
        "New Mexico": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2085,
            "SR-": 2085
        },
        "New York": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2087,
            "SR-": 2087,
            "NY-": 2087,
            "NY SPUR": 2087
        },
        "North Carolina": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2065,
            "SR-": 2065
        },
        "North Dakota": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2070,
            "SR-": 2070,
            "ND-": 2070
        },
        "Ohio": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2095,
            "SR-": 2095
        },
        "Oklahoma": {
            'I-': 5,
            'US-': 6,
            "SH-": 2097,
            "SR-": 2097
        },
        "Oregon": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2099,
            "SR-": 2099
        },
        "Pennsylvania": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2101,
            "SR-": 2101
        },
        "Rhode Island": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2108,
            "SR-": 2108
        },
        "South Carolina": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2109,
            "SR-": 2109,
            "SC-": 2109
        },
        "South Dakota": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2114,
            "SR-": 2114,
            "SD-": 2114
        },
        "Tennessee": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2115,
            "SR-": 2115
        },
        "Texas": {
            'I-': 5,
            'US-': 6,
            "SH-": 2117,
            "SR-": 2117
        },
        "Utah": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2127,
            "SR-": 2127
        },
        "Vermont": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2131,
            "SR-": 2131
        },
        "Virginia": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2128,
            "SR-": 2128
        },
        "Washington": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2133,
            "SR-": 2133
        },
        "West Virginia": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2138,
            "SR-": 2138,
            "WV-": 2138,
        },
        "Wisconsin": {
            'I-': 5,
            'US-': 6,
            "CH-": 2137,
            "CR-": 2137,
            "SH-": 2135,
            "SR-": 2135,
            "WIS-": 2135,
            "WIS SPUR": 2135
        },
        "Wyoming": {
            'I-': 5,
            'US-': 6,
            "CH-": 2002,
            "CR-": 2002,
            "SH-": 2143,
            "SR-": 2143,
            "WY-": 2143,
        }
    }
}
const Strings = {
    'en': {
        'enableScript': 'Script enabled',
        'HighSegShields': 'Segments with Shields',
        'HighSegShieldsClr': 'Segments with Shields',
        'ShowSegShields': 'Show Segment Shields on Map',
        'SegShieldMissing': 'Segments that might be missing shields',
        'SegShieldMissingClr': 'Segments that might be missing shields',
        'SegShieldError': "Segments that have shields but maybe shouldn't",
        'SegShieldErrorClr': "Segments that have shields but maybe shouldn't",
        'HighNodeShields': 'Nodes with Shields (TG)',
        'HighNodeShieldsClr': 'Nodes with Shields (TG)',
        'ShowNodeShields': 'Show Node Shield Info',
        'ShowExitShields': 'Include turn icons (if exists)',
        'ShowTurnTTS': 'Include TTS',
        'AlertTurnTTS': 'Alert if TTS is different from default',
        'NodeShieldMissing': 'Nodes that might be missing shields',
        'NodeShieldMissingClr': 'Nodes that might be missing shields',
        'resetSettings': 'Reset Settings',
        'disabledFeat': '(Feature not configured for this country)',
        'ShowTowards': 'Include Towards (if exists)',
        'ShowVisualInst': 'Include Visual Instruction',
        'SegHasDir': 'Shields with direction',
        'SegHasDirClr': 'Shields with direction',
        'SegInvDir': 'Shields without direction',
        'SegInvDirClr': 'Shields without direction',
        'IconHead': 'Map Icons',
        'HighlightHead': 'Highlights',
        'HighlightColors': 'Highlight Colors',
        'ShowRamps': 'Include Ramps'
    },
    'en-us': {
        'enableScript': 'Script enabled',
        'HighSegShields': 'Segments with Shields',
        'HighSegShieldsClr': 'Segments with Shields',
        'ShowSegShields': 'Show Segment Shields on Map',
        'SegShieldMissing': 'Segments that might be missing shields',
        'SegShieldMissingClr': 'Segments that might be missing shields',
        'SegShieldError': "Segments that have shields but maybe shouldn't",
        'SegShieldErrorClr': "Segments that have shields but maybe shouldn't",
        'HighNodeShields': 'Nodes with Shields (TG)',
        'HighNodeShieldsClr': 'Nodes with Shields (TG)',
        'ShowNodeShields': 'Show Node Shield Info',
        'ShowExitShields': 'Include turn icons (if exists)',
        'ShowTurnTTS': 'Include TTS',
        'AlertTurnTTS': 'Alert if TTS is different from default',
        'NodeShieldMissing': 'Nodes that might be missing shields',
        'NodeShieldMissingClr': 'Nodes that might be missing shields',
        'resetSettings': 'Reset Settings',
        'disabledFeat': '(Feature not configured for this country)',
        'ShowTowards': 'Include Towards (if exists)',
        'ShowVisualInst': 'Include Visual Instruction',
        'SegHasDir': 'Shields with direction',
        'SegHasDirClr': 'Shields with direction',
        'SegInvDir': 'Shields without direction',
        'SegInvDirClr': 'Shields without direction',
        'IconHead': 'Map Icons',
        'HighlightHead': 'Highlights',
        'HighlightColors': 'Highlight Colors',
        'ShowRamps': 'Include Ramps'
    },
    'es-419' : {
        'enableScript': 'Script habilitado',
        'HighSegShields': 'Segmentos con escudos',
        'HighSegShieldsClr': 'Segmentos con escudos',
        'ShowSegShields': 'Mostrar escudos de segmentos en el mapa',
        'SegShieldMissing': 'Segmentos a los que les pueden faltar escudos',
        'SegShieldMissingClr': 'Segmentos a los que les pueden faltar escudos',
        'SegShieldError': "Segmentos que tienen escudos y quizá no deberían",
        'SegShieldErrorClr': "Segmentos que tienen escudos y quizá no deberían",
        'HighNodeShields': 'Nodos con escudos (TG)',
        'HighNodeShieldsClr': 'Nodos con escudos (TG)',
        'ShowNodeShields': 'Mostrar Info de Escudo en Nodo',
        'ShowExitShields': 'Incluir iconos de giro (si existen)',
        'ShowTurnTTS': 'Incuir TTS',
        'AlertTurnTTS': 'Alertar si TTS fue modificado',
        'NodeShieldMissing': 'Nodos a los que les pueden faltar escudos',
        'NodeShieldMissingClr': 'Nodos a los que les pueden faltar escudos',
        'resetSettings': 'Reiniciar ajustes',
        'disabledFeat': '(Funcionalidad no configurada para ese país)',
        'ShowTowards': 'Incluir dirección (si existe)',
        'ShowVisualInst': 'Incluir instrucción visual',
        'SegHasDir': 'Escudos con dirección',
        'SegHasDirClr': 'Escudos con dirección',
        'SegInvDir': 'Escudos sin dirección',
        'SegInvDirClr': 'Escudos sin dirección',
        'IconHead': 'Iconos en mapa',
        'HighlightHead': 'Destacar',
        'HighlightColors': 'Reseña de Colores',
        'ShowRamps': 'Incluir Rampas'
    }
}

let rsaSettings;
let UpdateObj;
let rsaMapLayer;
let rsaIconLayer;
let LANG;

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
        '.rsa-header {font-weight:bold;}',
        '.rsa-option-container {padding:3px;}',
        '.rsa-option-container.no-display {display:none;}',
        '.rsa-option-container.sub {display:none;margin-left:10px;}',
        'input[type="checkbox"].rsa-checkbox {display:inline-block;position:relative;top:3px;vertical-align:top;margin:0;}',
        'input[type="color"].rsa-color-input {display:inline-block;position:relative;width:20px;padding:0px 1px;border:0px;vertical-align:top;cursor:pointer;}',
        'input[type="color"].rsa-color-input:focus {outline-width:0;}',
        'label.rsa-label {display:inline-block;position:relative;max-width:80%;vertical-align:top;font-weight:normal;padding-left:5px;word-wrap:break-word;}'
    ].join(' ');

    const $rsaTab = $('<div>');
    $rsaTab.html = ([
        `<div class='rsa-wrapper' id='rsa-tab-wrapper'>
            <div style='margin-bottom:5px;border-bottom:1px solid black;'>
                <span style='font-weight:bold;'>
                    <a href='https://www.waze.com/forum/viewtopic.php?f=1851&t=315748' target='_blank' style='text-decoration:none;'>Road Shield Assistant</a>
                    </span> - v${GM_info.script.version}
            </div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-enableScript' />
                <label class='rsa-label' for='rsa-enableScript'><span id='rsa-text-enableScript' /></label>
            </div>
            <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-ShowRamps' />
                    <label class='rsa-label' for='rsa-ShowRamps'><span id='rsa-text-ShowRamps' /></label>
                </div>
            <div id='rsa-text-IconHead' class='rsa-header' />
            <div style='border-top:2px solid black;'>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-ShowSegShields' />
                    <label class='rsa-label' for='rsa-ShowSegShields'><span id='rsa-text-ShowSegShields' /></label>
                </div>
            </div>
            <div id='rsa-text-HighlightHead' class='rsa-header' />
            <div style='border-top:2px solid black;'>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-HighNodeShields' />
                    <label class='rsa-label' for='rsa-HighNodeShields'><span id='rsa-text-HighNodeShields' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-HighSegShields' />
                    <label class='rsa-label' for='rsa-HighSegShields'><span id='rsa-text-HighSegShields' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-SegHasDir' />
                    <label class='rsa-label' for='rsa-SegHasDir'><span id='rsa-text-SegHasDir' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-SegInvDir' />
                    <label class='rsa-label' for='rsa-SegInvDir'><span id='rsa-text-SegInvDir' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-SegShieldMissing' />
                    <label class='rsa-label' for='rsa-SegShieldMissing'><span id='rsa-text-SegShieldMissing' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-SegShieldError' />
                    <label class='rsa-label' for='rsa-SegShieldError'><span id='rsa-text-SegShieldError' /></label>
                </div>

                <div class='rsa-option-container no-display'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-NodeShieldMissing' />
                    <label class='rsa-label' for='rsa-NodeShieldMissing'><span id='rsa-text-NodeShieldMissing' /></label>
                </div>
                <div class='rsa-option-container no-display'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-ShowNodeShields' />
                    <label class='rsa-label' for='rsa-ShowNodeShields'><span id='rsa-text-ShowNodeShields' /></label>
                </div>
                <div class='rsa-option-container sub'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-ShowExitShields' />
                    <label class='rsa-label' for='rsa-ShowExitShields'><span id='rsa-text-ShowExitShields' /></label>
                </div>
                <div class='rsa-option-container sub'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-ShowTurnTTS' />
                    <label class='rsa-label' for='rsa-ShowTurnTTS'><span id='rsa-text-ShowTurnTTS' /></label>
                </div>
                <div class='rsa-option-container sub'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-ShowTowards' />
                    <label class='rsa-label' for='rsa-ShowTowards'><span id='rsa-text-ShowTowards' /></label>
                </div>
                <div class='rsa-option-container sub'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-ShowVisualInst' />
                    <label class='rsa-label' for='rsa-ShowVisualInst'><span id='rsa-text-ShowVisualInst' /></label>
                </div>
                <div class='rsa-option-container sub'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-AlertTurnTTS' />
                    <label class='rsa-label' for='rsa-AlertTurnTTS'><span id='rsa-text-AlertTurnTTS' /></label>
                </div>
            </div>
            <div id='rsa-text-HighlightColors' class='rsa-header' />
            <div style='border-top:2px solid black;'>
                <div class='rsa-option-container'>
                    <input type=color class='rsa-color-input' id='rsa-HighSegClr' />
                    <label class='rsa-label' for='rsa-HighSegClr'><span id='rsa-text-HighSegShieldsClr' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=color class='rsa-color-input' id='rsa-SegHasDirClr' />
                    <label class='rsa-label' for='rsa-SegHasDirClr'><span id='rsa-text-SegHasDirClr' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=color class='rsa-color-input' id='rsa-SegInvDirClr' />
                    <label class='rsa-label' for='rsa-SegInvDirClr'><span id='rsa-text-SegInvDirClr' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=color class='rsa-color-input' id='rsa-MissSegClr' />
                    <label class='rsa-label' for='rsa-MissSegClr'><span id='rsa-text-SegShieldMissingClr' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=color class='rsa-color-input' id='rsa-ErrSegClr' />
                    <label class='rsa-label' for='rsa-ErrSegClr'><span id='rsa-text-SegShieldErrorClr' /></label>
                </div>
                <div class='rsa-option-container'>
                    <input type=color class='rsa-color-input' id='rsa-HighNodeClr' />
                    <label class='rsa-label' for='rsa-HighNodeClr'><span id='rsa-text-HighNodeShieldsClr' /></label>
                </div>
                <div class='rsa-option-container no-display'>
                    <input type=color class='rsa-color-input' id='rsa-MissNodeClr' />
                    <label class='rsa-label' for='rsa-MissNodeClr'><span id='rsa-text-NodeShieldMissingClr' /></label>
                </div>
            </div>
            <div style='border-top:2px solid black;'>
                <div class='rsa-option-container'>
                    <input type=button id='rsa-resetSettings' />
                </div>
            </div>
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

    rsaIconLayer = new OpenLayers.Layer.Vector('rsaIconLayer', { uniqueName: 'rsaIconLayer' });
    W.map.addLayer(rsaIconLayer);
    rsaIconLayer.setVisibility(true);

    // Set user options
    function setEleStatus() {
        setChecked('rsa-enableScript', rsaSettings.enableScript);
        setChecked('rsa-HighSegShields', rsaSettings.HighSegShields);
        setChecked('rsa-ShowSegShields', rsaSettings.ShowSegShields);
        setChecked('rsa-SegShieldMissing', rsaSettings.SegShieldMissing);
        setChecked('rsa-SegShieldError', rsaSettings.SegShieldError);
        setChecked('rsa-HighNodeShields', rsaSettings.HighNodeShields);
        setChecked('rsa-ShowNodeShields', rsaSettings.ShowNodeShields);
        setChecked('rsa-ShowExitShields', rsaSettings.ShowExitShields);
        setChecked('rsa-ShowTurnTTS', rsaSettings.ShowTurnTTS);
        setChecked('rsa-AlertTurnTTS', rsaSettings.AlertTurnTTS);
        setChecked('rsa-ShowTowards', rsaSettings.ShowTowards);
        setChecked('rsa-ShowVisualInst', rsaSettings.ShowVisualInst);
        setChecked('rsa-NodeShieldMissing', rsaSettings.NodeShieldMissing);
        setChecked('rsa-SegHasDir', rsaSettings.SegHasDir);
        setChecked('rsa-SegInvDir', rsaSettings.SegInvDir);
        setChecked('rsa-ShowRamps', rsaSettings.ShowRamps);
        setValue('rsa-HighSegClr', rsaSettings.HighSegClr);
        setValue('rsa-MissSegClr', rsaSettings.MissSegClr);
        setValue('rsa-ErrSegClr', rsaSettings.ErrSegClr);
        setValue('rsa-HighNodeClr', rsaSettings.HighNodeClr);
        setValue('rsa-MissNodeClr', rsaSettings.MissNodeClr);
        setValue('rsa-SegHasDirClr', rsaSettings.SegHasDirClr);
        setValue('rsa-SegInvDirClr', rsaSettings.SegInvDirClr);

        function setChecked(ele, status) {
            $(`#${ele}`).prop('checked', status);
        }

        function setValue(ele, value) {
            const inputElem = $(`#${ele}`);
            inputElem.attr('value', value);
            // inputElem.css('border', `1px solid ${value}`);
        }
    }

    // Register event listeners
    WazeWrap.Events.register('selectionchanged', null, tryScan);
    WazeWrap.Events.register('moveend', null, tryScan);
    WazeWrap.Events.register('afteraction', null, tryScan);
    WazeWrap.Events.register('moveend', null, checkOptions);

    setEleStatus();

    $('.rsa-checkbox').change(function () {
        let settingName = $(this)[0].id.substr(4);
        rsaSettings[settingName] = this.checked;

        // Check to ensure highlight nodes and show node shields don't onverlap each other
        // if (settingName = 'ShowNodeShields') {
        //     if (this.checked) {
        //         $('rsa-HighNodeShields').prop('checked', false);
        //         rsaSettings.HighNodeShields = false;
        //     }
        // } else if (settingName = 'HighNodeShields') {
        //     if (this.checked) {
        //         $('rsa-ShowNodeShields').prop('checked', false);
        //         rsaSettings.ShowNodeShields = false;
        //     }
        // }

        saveSettings();

        removeHighlights();
        tryScan();
    });
    $('.rsa-color-input').change(function () {
        let settingName = $(this)[0].id.substr(4);
        rsaSettings[settingName] = this.value;
        saveSettings();
        setEleStatus();
        removeHighlights();
        tryScan();
    });
    // $('#rsa-ShowNodeShields').click(function() {
    //     if (!getId('rsa-ShowNodeShields').checked) $('.rsa-option-container.sub').hide();
    //     else $('.rsa-option-container.sub').show();
    // });
    $('#rsa-resetSettings').click(function() {
        const defaultSettings = {
            lastSaveAction: 0,
            enableScript: true,
            HighSegShields: false,
            ShowSegShields: true,
            SegShieldMissing: false,
            SegShieldError: false,
            SegHasDir: false,
            SegInvDir: false,
            HighNodeShields: true,
            ShowNodeShields: false,
            ShowExitShields: false,
            ShowTurnTTS: false,
            AlertTurnTTS: false,
            ShowTowards: false,
            ShowVisualInst: false,
            NodeShieldMissing: false,
            HighSegClr: '#0066ff',
            MissSegClr: '#00ff00',
            ErrSegClr: '#cc00ff',
            HighNodeClr: '#ff00bf',
            MissNodeClr: '#ff0000',
            SegHasDirClr: '#ffff00',
            SegInvDirClr: '#66ffff'
        }

        rsaSettings = defaultSettings;
        saveSettings();
        setEleStatus();
    });
    // Add translated UI text
    LANG = I18n.currentLocale().toLowerCase();
    if (!Strings[LANG]) LANG = 'en';
    for (let i=0; i < Object.keys(Strings[LANG]).length; i++) {
        let key = Object.keys(Strings[LANG])[i]
        $(`#rsa-text-${key}`).text(Strings[LANG][key]);
    }
    $('#rsa-resetSettings').attr('value', Strings[LANG]['resetSettings']);

    checkOptions();
}

async function loadSettings() {
    const localSettings = $.parseJSON(localStorage.getItem('RSA_Settings'));
    const serverSettings = await WazeWrap.Remote.RetrieveSettings('RSA_Settings');
    if (!serverSettings) {
        console.error('RSA: Error communicating with WW settings server');
    }

    const defaultSettings = {
        lastSaveAction: 0,
        enableScript: true,
        HighSegShields: false,
        ShowSegShields: true,
        SegShieldMissing: false,
        SegShieldError: false,
        SegHasDir: false,
        SegInvDir: false,
        HighNodeShields: true,
        ShowNodeShields: false,
        ShowExitShields: false,
        ShowTurnTTS: false,
        AlertTurnTTS: false,
        ShowTowards: false,
        ShowVisualInst: false,
        NodeShieldMissing: false,
        HighSegClr: '#0066ff',
        MissSegClr: '#00ff00',
        ErrSegClr: '#cc00ff',
        HighNodeClr: '#ff00bf',
        MissNodeClr: '#ff0000',
        SegHasDirClr: '#ffff00',
        SegInvDirClr: '#66ffff',
        ShowRamps: true
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
        enableScript,
        HighSegShields,
        ShowSegShields,
        SegShieldMissing,
        SegShieldError,
        HighNodeShields,
        ShowNodeShields,
        ShowExitShields,
        SegHasDir,
        SegInvDir,
        ShowTurnTTS,
        AlertTurnTTS,
        ShowTowards,
        ShowVisualInst,
        NodeShieldMissing,
        HighSegClr,
        MissSegClr,
        ErrSegClr,
        HighNodeClr,
        MissNodeClr,
        SegHasDirClr,
        SegInvDirClr,
        ShowRamps
    } = rsaSettings;

    const localSettings = {
        lastSaveAction: Date.now(),
        enableScript,
        HighSegShields,
        ShowSegShields,
        SegShieldMissing,
        SegShieldError,
        HighNodeShields,
        ShowNodeShields,
        ShowExitShields,
        SegHasDir,
        SegInvDir,
        ShowTurnTTS,
        AlertTurnTTS,
        ShowTowards,
        ShowVisualInst,
        NodeShieldMissing,
        HighSegClr,
        MissSegClr,
        ErrSegClr,
        HighNodeClr,
        MissNodeClr,
        SegHasDirClr,
        SegInvDirClr,
        ShowRamps
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

function checkOptions() {
    const countries = W.model.countries.getObjectArray();

    if (countries.length < 1) {
        setTimeout(checkOptions(), 500);
        return;
    } else {
        let allowFeat = false;

        for (let i=0; i < countries.length; i++) {
            if (RoadAbbr[countries[i].id]) allowFeat = true;
        }

        if (!allowFeat) {
            $(`#rsa-text-SegShieldMissing`).prop('checked', false);
            $(`#rsa-text-SegShieldError`).prop('checked', false);
            $(`#rsa-text-NodeShieldMissing`).prop('checked', false);

            $(`#rsa-text-SegShieldMissing`).text(Strings[LANG]['SegShieldMissing'] + ' ' + Strings[LANG]['disabledFeat']);
            $(`#rsa-text-SegShieldError`).text(Strings[LANG]['SegShieldError'] + ' ' + Strings[LANG]['disabledFeat']);
            $(`#rsa-text-NodeShieldMissing`).text(Strings[LANG]['NodeShieldMissing'] + ' ' + Strings[LANG]['disabledFeat']);

            $(`#rsa-SegShieldMissing`).prop('disabled', true);
            $(`#rsa-SegShieldError`).prop('disabled', true);
            $(`#rsa-NodeShieldMissing`).prop('disabled', true);

            rsaSettings.SegShieldMissing = false;
            rsaSettings.SegShieldError = false;
            rsaSettings.NodeShieldMissing = false;
            saveSettings();
        } else {
            $(`#rsa-text-SegShieldMissing`).prop('checked', rsaSettings.SegShieldMissing);
            $(`#rsa-text-SegShieldError`).prop('checked', rsaSettings.SegShieldError);
            $(`#rsa-text-NodeShieldMissing`).prop('checked', rsaSettings.NodeShieldMissing);

            $(`#rsa-text-SegShieldMissing`).text(Strings[LANG]['SegShieldMissing']);
            $(`#rsa-text-SegShieldError`).text(Strings[LANG]['SegShieldError']);
            $(`#rsa-text-NodeShieldMissing`).text(Strings[LANG]['NodeShieldMissing']);

            $(`#rsa-SegShieldMissing`).prop('disabled', false);
            $(`#rsa-SegShieldError`).prop('disabled', false);
            $(`#rsa-NodeShieldMissing`).prop('disabled', false);
        }
    }
}

function tryScan() {
    if (!rsaSettings.enableScript) return;

    function scanNode(node) {
        let conSegs = node.attributes.segIDs;

        for (let i=0; i < conSegs.length; i++) {
            let seg1 = W.model.segments.getObjectById(conSegs[i]);
            for (let j=0; j < conSegs.length; j++) {
                let seg2 = W.model.segments.getObjectById(conSegs[j]);
                processNode(node, seg1, seg2);
            }
        }
    }

    function scanSeg(seg, showInfo = false) {
        processSeg(seg, showInfo);
    }

    removeHighlights();
    let selFea = W.selectionManager.getSelectedFeatures();
    if (selFea && selFea.length > 0) {
        // if (selFea.model.type === 'segment') scanSeg(selFea.model, true);
    } else {
        // Scan all segments on screen
        if(rsaSettings.ShowSegShields || rsaSettings.SegShieldMissing || rsaSettings.SegShieldError || rsaSettings.HighSegShields) {
            _.each(W.model.segments.getObjectArray(), s => {
                scanSeg(s);
            });
        }
        // Scan all nodes on screen
        if(rsaSettings.HighNodeShields || rsaSettings.ShowNodeShields) {
            _.each(W.model.nodes.getObjectArray(), n => {
                scanNode(n);
            });
        }
       
    }
}

function processSeg(seg, showNode = false) {
    let segAtt = seg.attributes;
    let street = W.model.streets.getObjectById(segAtt.primaryStreetID);
    let cityID = W.model.cities.getObjectById(street.cityID);
    let stateName = W.model.states.getObjectById(cityID.attributes.stateID).name;
    let countryID = cityID.attributes.countryID;
    let candidate = isStreetCandidate(street, stateName, countryID);
    let hasShield = street.signType !== null;

    if (segAtt.roadType === 4 && !rsaSettings.ShowRamps) return;

    // Display shield on map
    if (hasShield && rsaSettings.ShowSegShields) displaySegShields(seg, street.signType, street.signText, street.direction);

    // If candidate and has shield
    if (candidate.isCandidate && hasShield && rsaSettings.HighSegShields) createHighlight(seg, rsaSettings.HighSegClr);

    // If candidate and missing shield
    if (candidate.isCandidate && !hasShield && rsaSettings.SegShieldMissing) createHighlight(seg, rsaSettings.MissSegClr);

    // If not candidate and has shield
    if (!candidate.isCandidate && hasShield && rsaSettings.SegShieldError) createHighlight(seg, rsaSettings.ErrSegClr);

    // Highlight seg shields with direction
    if (hasShield && street.direction && rsaSettings.SegHasDir) createHighlight(seg, rsaSettings.SegHasDirClr);
    if (hasShield && !street.direction && rsaSettings.SegInvDir) createHighlight(seg, rsaSettings.SegInvDirClr);

    if (showNode) {
        let toNode = W.model.nodes.getObjectById(segAtt.toNode);
        let fromNode = W.model.nodes.getObjectById(segAtt.fromNode);


        function getInfo(node) {
            let conSegs = node.attributes.segIDs;

            for (let i=0; i < conSegs.length; i++) {
                let seg1 = W.model.segments.getObjectById(conSegs[i]);
                for (let j=0; j < conSegs.length; j++) {
                    let seg2 = W.model.segments.getObjectById(conSegs[j]);
                    
                    let turn = W.model.getTurnGraph().getTurnThroughNode(node,seg1,seg2);
                    let turnData = turn.getTurnData();
                    let hasGuidance = turnData.hasTurnGuidance();

                    if (hasGuidance) {
                        let turnGuidance = turnData.getTurnGuidance();
                        let exitSigns = turnGuidance.getExitSigns(); // Returns array of objects
                        let roadShields = turnGuidance.getRoadShields(); // Returns object of objects
                        let TTS = turnGuidance.getTTS(); // Returns string
                        let towards = turnGuidance.getTowards(); // Returns string
                        let visualInstruct = turnGuidance.getVisualInstruction(); // Returns string
                    }
                }
            }
        }
    }
}

function processNode(node, seg1, seg2) {
    let turn = W.model.getTurnGraph().getTurnThroughNode(node,seg1,seg2);
    let turnData = turn.getTurnData();
    let hasGuidence = turnData.hasTurnGuidance();

    if (hasGuidence) {
        let hasExitShield = turnData.turnGuidance.exitSigns.length > 0;
        let hasShields = !$.isEmptyObject(turnData.turnGuidance.roadShields)

        if(rsaSettings.HighNodeShields) {
            createHighlight(node, rsaSettings.HighNodeClr);
        }

        if(rsaSettings.ShowNodeShields) {
            displayNodeShields(node, turnData);
        }
    }
    
}

function isStreetCandidate(s, state, country) {
    let info = {
        isCandidate: false,
        iconID: null
    }

    if (!RoadAbbr[country]) {
        return info;
    }

    let name = s.name;
    let abbrvs = RoadAbbr[country][state];

    for (let i=0; i < Object.keys(abbrvs).length; i++) {
        let abbr = Object.keys(abbrvs)[i];
        // console.log('name: ' + name + ' abbr: ' + abbr);
        if (name && name.includes(abbr)) {
            info.isCandidate = true;
            info.iconID = abbrvs[i];
        }
    }
    // console.log(info);
    return info;
}

function displayNodeShields(node, turnDat) {
    if(debugLvl === 1) return;
    const geo = node.geometry.clone();
    const trnGuid = turnDat.getTurnGuidance();
    const GUIDANCE = {};

    // Obj of objs - RS-0: direction: string, text: string, type: shield number
    GUIDANCE.shields = trnGuid.getRoadShields();
    // Array of objects - 'text': string, 'type': shield number
    if (rsaSettings.ShowExitShields) { GUIDANCE.exitsigns = trnGuid.getExitSigns(); }
    // String
    if (rsaSettings.ShowTurnTTS) { GUIDANCE.tts = trnGuid.getTTS(); }
    // String
    if (rsaSettings.ShowTowards) { GUIDANCE.towards = trnGuid.getTowards(); }
    // String
    if (rsaSettings.ShowVisualInst) { GUIDANCE.visualIn = trnGuid.getVisualInstruction(); }
    if (rsaSettings.AlertTurnTTS) {}


    const styleNode = {
        //strokeColor: color,
        strokeOpacity: 0.75,
        strokeWidth: 4,
        //fillColor: color,
        fillOpacity: 0.75,
        pointRadius: 3
    }
    const styleLabel = {
        externalGraphic: 'https://renderer.gcp.wazestg.com/renderer/v1/signs/6',
        graphicHeight: 30,
        graphicWidth: 30,
        label: 'TG',
        fontSize: 12,
        graphicZIndex: 700
    };

    // Array of points for line connecting node to display box
    let points = [];

    // Point coords
    let pointNode = new OpenLayers.Geometry.Point(geo.x, geo.y);
    points.push(pointNode);
    // Label coords
    let pointLabel = new OpenLayers.Geometry.Point(geo.x + LabelDistance(), geo.y + LabelDistance());
    points.push(pointLabel);

    // Point on node
    var pointFeature = new OpenLayers.Feature.Vector(pointNode, null, styleNode);
    rsaIconLayer.addFeatures([pointFeature]);

    // Line between node and label
    var newline = new OpenLayers.Geometry.LineString(points);
    var lineFeature = new OpenLayers.Feature.Vector(newline, null, styleNode);
    rsaIconLayer.addFeatures([lineFeature]);

    // Label
    var pointFeature = new OpenLayers.Feature.Vector(pointLabel, null, styleLabel);
    rsaIconLayer.addFeatures([pointFeature]);
}

function displaySegShields(segment, shieldID, shieldText, shieldDir) {
    if (W.map.getZoom() < 2) return;

    const iconURL = `https://renderer-am.waze.com/renderer/v1/signs/${shieldID}?text=${shieldText}`;
    let SegmentPoints = [];
    let oldparam = {};
    let labelDis = LabelDistance();

    oldparam.x = null;
    oldparam.y = null;
    let AtLeastOne = false;
    $.each(segment.geometry.getVertices(), function(idx, param) {
        // Build a new segment with same geometry
        SegmentPoints.push(new OpenLayers.Geometry.Point(param.x, param.y));

        // Shield icon style
        const style = {
            externalGraphic: iconURL,
            graphicWidth: 37,
            graphicHeight: 37,
            graphicYOffset: -20,
            graphicZIndex: 650
        };
        // Direction label styel
        const style2 = {
            label: shieldDir !== null ? shieldDir : '',
            fontColor: 'green',
            labelOutlineColor: 'white',
            labelOutlineWidth: 1,
            fontSize: 12
        };

        if (oldparam.x !== null && oldparam.y !== null) {
            if ( Math.abs(oldparam.x - param.x) > labelDis.space || Math.abs(oldparam.y - param.y) > labelDis.space  || AtLeastOne === false) {
                let centerparam = {};
                centerparam.x = ((oldparam.x + param.x) / 2);
                centerparam.y = ((oldparam.y + param.y) / 2);
                if ( Math.abs(centerparam.x - param.x) > labelDis.space || Math.abs(centerparam.y - param.y) > labelDis.space || AtLeastOne === false) {
                    LabelPoint = new OpenLayers.Geometry.Point(centerparam.x, centerparam.y);
                    const pointFeature = new OpenLayers.Feature.Vector(LabelPoint, null, style);
                    // Create point for direction label below shield icon
                    const labelPoint2 = new OpenLayers.Geometry.Point(centerparam.x, centerparam.y - labelDis.label);
                    const imageFeature2 = new OpenLayers.Feature.Vector(labelPoint2, null, style2);
                    rsaIconLayer.addFeatures([pointFeature, imageFeature2]);
                    AtLeastOne = true;
                }
            }
        }
        oldparam.x = param.x;
        oldparam.y = param.y;
    });
}

function createHighlight(obj, color, overSized = false) {
    const geo = obj.geometry.clone();
    let isNode = obj.type == 'node';
    let labelDis = LabelDistance();

    if(isNode) {
        const styleNode = {
            strokeColor: color,
            strokeOpacity: 0.75,
            strokeWidth: 4,
            fillColor: color,
            fillOpacity: 0.75,
            pointRadius: 3
        }
        const styleLabel = {
            externalGraphic: 'https://renderer.gcp.wazestg.com/renderer/v1/signs/6?text=TG',
            graphicHeight: 30,
            graphicWidth: 30,
            graphicZIndex: 700
        };

        let points = [];
        // Point coords
        let pointNode = new OpenLayers.Geometry.Point(geo.x, geo.y);
        points.push(pointNode);
        // Label coords
        let pointLabel = new OpenLayers.Geometry.Point(geo.x + labelDis.label, geo.y + labelDis.label);
        points.push(pointLabel);

        // Point on node
        var pointFeature = new OpenLayers.Feature.Vector(pointNode, null, styleNode);
        rsaIconLayer.addFeatures([pointFeature]);

        // Line between node and label
        var newline = new OpenLayers.Geometry.LineString(points);
        var lineFeature = new OpenLayers.Feature.Vector(newline, null, styleNode);
        rsaIconLayer.addFeatures([lineFeature]);

        // Label
        var pointFeature = new OpenLayers.Feature.Vector(pointLabel, null, styleLabel);
        rsaIconLayer.addFeatures([pointFeature]);
    } else {
        // console.log('seg highlight')
        const style = {
            strokeColor: color,
            strokeOpacity: 0.75,
            strokeWidth: 4,
            fillColor: color,
            fillOpacity: 0.75
        }
        const newFeat =  new OpenLayers.Geometry.LineString(geo.components, {});
        const newVector = new OpenLayers.Feature.Vector(newFeat, null, style);
        rsaMapLayer.addFeatures([newVector]);
    }
}

function removeHighlights() {
    rsaMapLayer.removeAllFeatures();
    rsaIconLayer.removeAllFeatures();
}

function LabelDistance() {
    // Return object with two variables - label is the distance used to place the direction below the icon,
    // space is the space between geo points needed to render another icon
    let label_distance = {};
    switch (W.map.getOLMap().getZoom()) {
        case 9:
            label_distance.label = 2;
            label_distance.space = 20;
            break;
        case 8:
            label_distance.label = 4;
            label_distance.space = 20;
            break;
        case 7:
            label_distance.label = 7;
            label_distance.space = 20;
            break;
        case 6:
            label_distance.label = 12;
            label_distance.space = 30;
            break;
        case 5:
            label_distance.label = 30;
            label_distance.space = 30;
            break;
        case 4:
            label_distance.label = 40;
            label_distance.space = 40;
            break;
        case 3:
            label_distance.label = 70;
            label_distance.space = 70;
            break;
        case 2:
            label_distance.label = 150;
            label_distance.space = 200;
            break;
        case 1:
            label_distance.label = 200;
            label_distance.space = 250;
            break;
    }
    return label_distance;
}

rsaBootstrap();
