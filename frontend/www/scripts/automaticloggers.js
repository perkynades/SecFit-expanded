async function fetchLoggers(request) {
    let response = await sendRequest("GET", `${HOST}/api/exerciseLoggers/`)

    if (response.ok) {
        let data = await response.json()

        let loggers = data.results
        let container = document.getElementById('div-content')
        let loggerTemplate = document.querySelector('#template-logger')

        loggers.forEach(logger => {
            const loggerAnchor = loggerTemplate.content.firstElementChild.cloneNode(true)
            
            const h5 = loggerAnchor.querySelector("h5")
            h5.textContent = logger.fitnessCenter

            const p = loggerAnchor.querySelector("p")
            p.textContent = logger.loggedExercise

            container.appendChild(loggerAnchor)
        })
    }

    return response
}

function addAutomaticLogger() {
    window.location.replace("automaticlogger.html")
}

window.addEventListener("DOMContentLoaded", async () => {
    let addButton = document.querySelector("#btn-add-logger")
    addButton.addEventListener("click", addAutomaticLogger)

    let response = await fetchLoggers()

    if (!response.ok) {
        let data = await response.json();
        let alert = createAlert("Could not retrieve automatic loggers!", data);
        document.body.prepend(alert);
    }
})