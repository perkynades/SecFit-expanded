async function fetchProgrammers(request) {
    let response = await sendRequest("GET", `${HOST}/api/programmedExercises/`)

    if (response.ok) {
        let data = await response.json()

        let programmers = data.results
        let container = document.getElementById('div-content')
        let programmerTemplates = document.querySelector('#template-programmed-exercise')

        programmers.forEach(programmer => {
            const programmerAnchor = programmerTemplates.content.firstElementChild.cloneNode(true)
            
            const h5 = programmerAnchor.querySelector("h5")
            h5.textContent = programmer.terrain

            const p = programmerAnchor.querySelector("p")
            p.textContent = "Length: " + programmer.length + "km | Speed: " + programmer.speed + "km/h" 

            container.appendChild(programmerAnchor)
        })
    }

    return response
}

function onAddProgrammedExercise() {
    window.location.replace("programexercise.html")
}

function startProgrammedExercise() {
    alert("The exercise has been started at your exercise equipment")
}

window.addEventListener("DOMContentLoaded", async () => {
    let response = await fetchProgrammers()

    if (!response.ok) {
        let data = await response.json();
        let alert = createAlert("Could not retrieve programmed exercises!", data);
        document.body.prepend(alert);
    }
})