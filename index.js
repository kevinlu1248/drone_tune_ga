// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    MediaObject
    // Suggestions,
} = require("actions-on-google");
// Import the firebase-functions package for deployment.
const functions = require("firebase-functions");

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true });

let speed = 1;
let note = "A";
let accidental = "natural";
const BLEEP = 987;

const note_to_speed = {
    A: 0,
    B: 2,
    C: 3,
    D: 5,
    E: 7,
    F: 8,
    G: 10
};

const semi_tone = Math.pow(2, 1 / 12);

function update_speed(note, accidental = "natural") {
    var semi_steps = note_to_speed[note];
    if (accidental === "sharp") {
        semi_steps++;
    } else if (accidental === "flat") {
        semi_steps--;
    }
    return Math.pow(semi_tone, semi_steps) * 440;
}

app.intent("play note", (conv, { note, accidental }) => {
    speed = update_speed(note, accidental);
    conv.add(`<speak>
        Sure. Playing
        <say-as interpret-as="verbatim">${note} </say-as> ${accidental} at
        <say-as interpret-as="unit">${speed.toFixed(2)} Hz.</say-as>
        <audio
             src="https://firebasestorage.googleapis.com/v0/b/actions-codelab-70db8.appspot.com/o/audiocheck.net_sin_${speed.toFixed(2)}Hz_-3dBFS_10s.wav?alt=media">
             Looks like we have a technical issue.
        </audio>
        Again?
    </speak>`);
    // conv.ask(
    //     new MediaObject({
    //         name: `${note} ${accidental}`,
    //         url: `https://firebasestorage.googleapis.com/v0/b/actions-codelab-70db8.appspot.com/o/audiocheck.net_sin_${speed.toFixed(2)}Hz_-3dBFS_10s.wav?alt=media`,
    //         description: "A sine wave produced by an oscillator",
    //     })
    // );
});

app.intent("play note - yes", (conv, {}) => {
    note = conv.contexts.get("note").parameters.note;
    accidental = conv.contexts.get("accidental").parameters.accidental;
    speed = update_speed(note, accidental);
    conv.add(`<speak>
        Sure. Playing 
        <say-as interpret-as="verbatim">${note} </say-as> ${accidental} at
        <say-as interpret-as="unit">${speed.toFixed(2)} Hz.</say-as>
        <audio
             src="https://firebasestorage.googleapis.com/v0/b/actions-codelab-70db8.appspot.com/o/audiocheck.net_sin_${speed.toFixed(
                 2
             )}Hz_-3dBFS_10s.wav?alt=media">
             Looks like we have a technical issue.
        </audio>
        Again?
    </speak>`);
});

app.intent("octave change", (conv, { direction, number }) => {
    // let note = conv.contexts.get('note');
    // let accidental = conv.contexts.get('accidental');
    // speed = conv.contexts.get('speed', speed);
    // if (direction === 'higher') {
    //     speed *= Math.pow(2, number);
    // } else {
    //     speed /= Math.pow(2, number);
    // }
    speed = 1;
    conv.add(`<speak>
        For sure. Playing
        <say-as interpret-as="verbatim">${note} </say-as> ${accidental} at ${speed.toFixed(
        2
    )} Hertz.
        <audio
            src="https://firebasestorage.googleapis.com/v0/b/actions-codelab-70db8.appspot.com/o/audiocheck.net_sin_${speed.toFixed(
                2
            )}Hz_-3dBFS_10s.wav?alt=media">
            Looks like we have a technical issue.
        </audio>
    </speak>`);
});

// // Handle the Dialogflow intent named 'actions_intent_PERMISSION'. If user
// // agreed to PERMISSION prompt, then boolean value 'permissionGranted' is true.
// app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
//     if (!permissionGranted) {
//         conv.ask(`Ok, no worries. What's your favorite color?`);
//         conv.ask(new Suggestions('Blue', 'Red', 'Green'));
//     } else {
//         conv.data.userName = conv.user.name.display;
//         conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);
//         conv.ask(new Suggestions('Blue', 'Red', 'Green'));
//     }
// });

// https://www.audiocheck.net/audiofrequencysignalgenerator_sinetone.php

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
