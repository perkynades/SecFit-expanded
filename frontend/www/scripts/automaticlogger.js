async function onSitWideGripBenchPress() {
    let body = {
        "fitnessCenter": "Sit Sit Gløshaugen idrettsbygg",
        "loggedExercise": "Wide grip bench press"
    }
    let response = await sendRequest("POST", `${HOST}/api/logger/`, body)

    if (response.ok) {
        window.location.replace("automaticlogger.html")
    } else {
        console.log("not ok")
    }
}

function onSitShortGripBenchPress() {
    
}

function onSitWideStance() {
    
}

function onSitNarrowStance() {

}