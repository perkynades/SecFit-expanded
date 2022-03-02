function onThreeTMidtbyen() {
    document.getElementById("three-t-midtbyen-exercise-equipment").classList.remove("hide")
}

function onThreeTRunningMachine() {
    document.getElementById("three-t-program-exercise-div").classList.remove("hide")
}

async function onThreeTCreateExercise() {
    let form = document.querySelector("#three-t-running-machine-program-exercise-form")
    let formData = new FormData(form)

    let body = {
        "terrain": formData.get("terrainGroup"),
        "length": Number(formData.get("length")),
        "speed": Number(formData.get("speed"))
    }
    
    let response = await sendRequest("POST", `${HOST}/api/`)

    if (response.ok) {
        window.location.replace("exerciseprogramming.html");
    } else {
        console.log("not ok")
    }
}