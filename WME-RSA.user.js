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
const countryShields = {
    // US
    235: {
        // Generic US Shields
        0: {
            // Interstate
            5: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAABEtJREFUeNrtWV1IVFEQnutWu4F/yJKiRYabCoX5F0gISvQSShkq9vOQoFBSgQnRSw+7JEREkhRUYFAPUqKSWtKL1IMShhspZhquZqYhaKaibAtXbc7ubF5ld++PP/cu7cDsuffsmXPPNzN3Zs65AAEKUIAC5E/EiQ1YXl42YlOCbELuRn7Gcdy8RLlzyJnIPHKHTNnzyMnIVuQnYnKcyITZ2NQjGwXdY8hm5Fqc/I8HmWBahHmNnFv2BnKdD9kSGiOUHUE+jjIDsoGQVvqdE05PW2FysgMSEjLwPoOGzJCWbXS9jTR4DNngHNHV9R6amn6CXr8IeXkHICnpoGRZnm+FoaFBiI7OgZCQ/djDQKR4UgDQBN7ouhPE6OhbqKhIQ2TpwHFfIS2tHhd1COLj40Gny10lsbiIukPltbcPQVubDuz2I//+6+kBCA39BtnZO1EhUbjAXIiJAZxDKM9Db28XNDR8gf7+LOzJwf9/QE3NJ5RNwft85glygWQ7f6uqfiOIMDJTAlitjF0j9PppMBiW8GE8OBw7YGEhgmTjPM44N7cPWlpW94WFTQHTst2+HeeIxJ7DxG5we6C2tg/KysCDq/oGgm7F+l1uMD6+3ytUhyMCeX3hZnbWKDqmr28XXbHAUe1pSJAX0USnr9rtw7C0lKR6bJ2cjKGrZG9DvAFJIE1MayJJ8HwkuiUzvYkim+R3xOQKeiOzFPrUJ5uNh9RUE3mLVSqQ3c7fgoI3XGHhXS3gWG5sfEkKjvMEJMgnEK1Yg2xCbaycdySc2l8aAjK1Zm2SgARrsC6coDZKDhAj+BkF+dFa3dWvwd+B8EqAjGgQSLigcpYMZN5n8acOGdasTRIQm1htowIl+vIWMdfK0CCQATlAPrgtgkWaQfXyxLWtyHRv0SQDwe1kJ2XSlX2JupRFSbob1zYmN/y+pjZfA0DKqW1SkhDdO7FyNG2Uim51Eht2NsAOHR7LBoIm7CYNGOggQg0QzJ0e0O0jXNOE0hLFQhn1Ik4aqwKWm7SlYNa4rbjWIqs8JavUU/TYKmuwHHaZbit9WUNqrXWV8ko68p0tDLcPKWp2illDEhA6cy0kF2MvftEWuVQG1VVncA286DplaOkCe+EI0GmcvHETLVFKz8nD57RKkdVJfYjFYvloNpuZi51gxxJ4PYx9vRscoZ4jnxUoq1mqPKfggTnYvKBMew/5mhTTi8zJ8lQ9rHyCkG1xndyHohUG0RrvKEmx0/Oj7B77ZxSCYO8CO+pJpRK9QI4lFFtEsABWjb4C11kTi/Psm0a1VOuQFW4hF1PXZ+RTKG9Tsh5unS5hpAhTSqGSLaISXB+BeC8yLCddIuDh5ErMRS1SvmZtCpA1yeu+oNRmQaEGXCeC3wnkXnB9qigWnNKwHHEFAVjXuwZug8NnEWlarPS3UrZu3qhnbygQASCm+SKqBtzaZ/sb9rmtjvY7AQpQgAL0H9NfQKp13wDDShwAAAAASUVORK5CYII=',
            // Highway
            6: 'data:image/png;base64,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',
            // State Route
            7: 'data:image/png;base64,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'
        },
        Alabama: {

        },
        // Michigan
        100000035: {
            2056: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAEZ0FNQQAAsY58+1GTAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAA0RJREFUeNrtmc9LG0EUx18mvzCaSC+RYigG/AeERKQQKM2lBXPyUMgphxyKUNpDSkGQnJu20ILQowgipSQnpV60vfRkpccSQgo5CAUPNopSE3eTvrdkxaabH7Mzye4hX/guGzM7M59582ImD2CkkUbqJkef7eLoBPoO+tYQ5/cb/RP9Ef1NBOQxY+xdo9Hw2GDRf6HT6E9cIAjwAQEete7B4/GA0+kEh8PR98hTU1OwuroKl5eXkM1m4eLigmvmzWYT6vU6KIqi3bf0HP26va2rQx/PdIixsTHw+/0aDI+CwSAUCgWYnZ3VXs/NzUEymeSGIamqCmdnZ1Cr1ehlDv2jPTLODtH4iivAfD4fTE5OckXBCII0PT0NCwsLsL29DVdXV1z90SLSgtJzCEWTuY9+808bg+eWMRpOepgiwSsjCF3z8/OwtbUF4+PjppIkEAjoi3r7P1iD9g/oQjkhIxIyYShH3W63cdQM/qaFweVyCUGEw2FIJBLX70ejUYjFYsIwPCBStlOlUoGdnR0oFouwv78Ph4eHcHR0JByZTruEDQJCVygUgo2NDdjc3ISZmRnpOSMNpFdOpFIpDSKfz2v3snNGCkg/iR2Px7Vci0QihhGRCcMGBaFrd3cX1tfXe7YThTHKnC/oexMTE0AWgTCjg4ODrt8Azs/PNbfPnQ0qEmZlNjLMThAiMMxuEGZhmB0hzMAwu0LwwrBuhyKrIXhgOoKsra3ZAuImzMrKCj+I1+u13S8l3ebUESSTycDx8bFtIMrlMuRyOX6QUqkES0tLtoAhiF5zYaId2AGir/8jVsLwjM1kd2gFBNd3rWHCmBmLDXqAYUCYOlgNEkakbzbsAQfVJ7NqYNl9MasnIGtBmJWrKTOqzKr9LTvPmBXJKgKhqmqzX5A/dLlRIZIKIxqJer3eN8hnulC5THZkRCEajQZFxHAXGVWsvqNfYES096hOwquTkxPY29uDxcXF6+OpjJyoVqtqC6SKftkLREEH0HepECkKQ8dlOtuk02nTELTNT09Pm7VaTY/Gk9aCX6tbSYqKjQ+1/deq6vIWf2RIURQCIBh9ru/Ry+3tetXWXqGfot02OO3ShxD9+vAWRhppJG79BWI/8fTu5tV4AAAAAElFTkSuQmCC'
        }
    },
    // Canada
    40: {}
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
            <div style='margin-bottom:5px;border-bottom:1px solid black;'><span style='font-weight:bold;'>Road Shield Assistant</span> - v${GM_info.script.version}</div>
            <div class='rsa-option-container'>
                <input type=checkbox class='rsa-checkbox' id='rsa-enableScript' />
                <label class='rsa-label' for='rsa-enableScript'>Script Enabled</label>
            </div>
            <div style='border:1px solid black;'>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-HighSegShields' />
                    <label class='rsa-label' for='rsa-HighSegShields'>Highlight Segments with Shields</label>
                </div>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-ShowSegShields' />
                    <label class='rsa-label' for='rsa-ShowSegShields'>Show Segment Shield Info</label>
                </div>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-SegShieldMissing' />
                    <label class='rsa-label' for='rsa-SegShieldMissing'>Highlight segments that might be missing shields</label>
                </div>
            </div>
            <div style='border:1px solid black;'>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-HighNodeShields' />
                    <label class='rsa-label' for='rsa-HighNodeShields'>Highlight Nodes with Shields</label>
                </div>
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-ShowNodeShields' />
                    <label class='rsa-label' for='rsa-ShowNodeShields'>Show Node Shield Info</label>
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
                <div class='rsa-option-container'>
                    <input type=checkbox class='rsa-checkbox' id='rsa-NodeShieldMissing' />
                    <label class='rsa-label' for='rsa-NodeShieldMissing'>Highlight nodes that might be missing shields</label>
                </div>
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
        setChecked('rsa-enableScript', rsaSettings.enableScript);
        setChecked('rsa-HighSegShields', rsaSettings.HighSegShields);
        setChecked('rsa-ShowSegShields', rsaSettings.ShowSegShields);
        setChecked('rsa-SegShieldMissing', rsaSettings.SegShieldMissing);
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

        removeHighlights();
        tryScan();
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
        enableScript: true,
        HighSegShields: true,
        ShowSegShields: true,
        SegShieldMissing: true,
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
        enableScript,
        HighSegShields,
        ShowSegShields,
        SegShieldMissing,
        HighNodeShields,
        ShowNodeShields,
        ShowTurnShields,
        ShowTurnTTS,
        AlertTurnTTS,
        NodeShieldMissing
    } = rsaSettings;

    const localSettings = {
        lastSaveAction: Date.now(),
        enableScript,
        HighSegShields,
        ShowSegShields,
        SegShieldMissing,
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
    if(!getId('rsa-enableScript').checked) return;

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
        //rsaLog('Selected stuff', 2);
    } else {
        //rsaLog('General Scan', 2);

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
    //rsaLog('Seg Scan', 2);
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
    // rsaLog('Highlights fired', 2);
    let style = {};
    let isNode = obj.type == 'node';

    if(isNode) {
        style = {
            strokeColor: 'orange',
            strokeOpacity: 0.75,
            strokeWidth: 0,
            fillColor: "orange",
            fillOpacity: 0.75,
            pointRadius: 9
        }
    } else {
        // nodeStyle.fillColor = 'green';
    }

    const geo = obj.geometry.clone();
    const newPoint = new OpenLayers.Geometry.Point(geo.x, geo.y);
    const newVector = new OpenLayers.Feature.Vector(newPoint, null, style);
    // const newVector = new OpenLayers.Feature.Vector(geo, style, style);
    rsaMapLayer.addFeatures([newVector]);
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
