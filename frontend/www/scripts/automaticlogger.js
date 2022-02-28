// Functions for handling on fitness selection
function onSit() {
    document.getElementById("sit-exercise-equipment").classList.remove("hide")
    document.getElementById("three-t-midtbyen-exercise-equipment").classList.add("hide")
    document.getElementById("impulse-exercise-equipment").classList.add("hide")
}

function onThreeT() {
    document.getElementById("sit-exercise-equipment").classList.add("hide")
    document.getElementById("three-t-midtbyen-exercise-equipment").classList.remove("hide")
    document.getElementById("impulse-exercise-equipment").classList.add("hide")
}

function onImpulse() {
    document.getElementById("sit-exercise-equipment").classList.add("hide")
    document.getElementById("three-t-midtbyen-exercise-equipment").classList.add("hide")
    document.getElementById("impulse-exercise-equipment").classList.remove("hide")
}

// Functions for handling on fitness selection
async function onSitWideGripBenchPress() {
    let body = {
        "fitnessCenter": "Sit Gløshaugen idrettsbygg",
        "loggedExercise": "Wide grip bench press"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onSitShortGripBenchPress() {
    let body = {
        "fitnessCenter": "Sit Gløshaugen idrettsbygg",
        "loggedExercise": "Short grip bench press"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onSitWideStance() {
    let body = {
        "fitnessCenter": "Sit Gløshaugen idrettsbygg",
        "loggedExercise": "Wide stance"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onSitNarrowStance() {
    let body = {
        "fitnessCenter": "Sit Gløshaugen idrettsbygg",
        "loggedExercise": "Wide grip narrow stance"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onThreeTWideGripBenchPress() {
    let body = {
        "fitnessCenter": "3T-Midtby'n",
        "loggedExercise": "Wide grip bench press"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onThreeTShortGripBenchPress() {
    let body = {
        "fitnessCenter": "3T-Midtby'n",
        "loggedExercise": "Short grip bench press"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onThreeTWideStance() {
    let body = {
        "fitnessCenter": "3T-Midtby'n",
        "loggedExercise": "Wide stance"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onThreeTNarrowStance() {
    let body = {
        "fitnessCenter": "3T-Midtby'n",
        "loggedExercise": "Wide grip narrow stance"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onImpulseWideGripBenchPress() {
    let body = {
        "fitnessCenter": "Impulse Treningssenter",
        "loggedExercise": "Wide grip bench press"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onImpulseShortGripBenchPress() {
    let body = {
        "fitnessCenter": "Impulse Treningssenter",
        "loggedExercise": "Short grip bench press"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onImpulseWideStance() {
    let body = {
        "fitnessCenter": "Impulse Treningssenter",
        "loggedExercise": "Wide stance"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}

async function onImpulseNarrowStance() {
    let body = {
        "fitnessCenter": "Impulse Treningssenter",
        "loggedExercise": "Wide grip narrow stance"
    }
    let response = await sendRequest("POST", `${HOST}/api/exerciseLoggers/`, body)

    if (response.ok) {
        window.location.replace("automaticloggers.html")
    } else {
        console.log("not ok")
    }
}