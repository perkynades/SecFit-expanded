function addAutomaticLogger() {
    window.location.replace("automaticlogger.html")
}

window.addEventListener("DOMContentLoaded", async () => {
    let addButton = document.querySelector("#btn-add-logger")
    addButton.addEventListener("click", addAutomaticLogger)
})