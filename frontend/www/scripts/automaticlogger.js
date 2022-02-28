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
        "fitnessCenter": "Sit Sit Gløshaugen idrettsbygg",
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
    
}

async function onSitWideStance() {
    
}

async function onSitNarrowStance() {

}
