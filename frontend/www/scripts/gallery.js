/**
 * MAIN GALLERY FUNCTIONALITY 
 */
async function retrieveWorkoutImages(id) {  
	const response = await sendRequest('GET', `${HOST}/api/workouts/${id}/`); //eslint-disable-line no-undef
	if (!response.ok) {
		const data = await response.json();
		showAlert('Could not retrieve workout data!', data);
		return;
	}

	const workoutData = await response.json();

	getElement('workout-title').innerHTML = `Workout name: ${workoutData.name}`;
	getElement('workout-owner').innerHTML = `Owner: ${workoutData.owner_username}`;

	if(workoutData.files.length == 0){
		const noImageText = getFirstElement('#no-images-text');
		noImageText.classList.remove('hide');
		return;
	}

	const filesDiv = getElement('img-collection');
	const filesDeleteDiv = getElement('img-collection-delete');
        

	workoutData.forEach((file, i) => {
		if (isFileImg(createFileLink(file))) {
			const deleteImgButton = createDeleteImgButton(file);
			filesDeleteDiv.appendChild(deleteImgButton);

			const img = document.createElement('img');
			img.src = file.file;
                
			filesDiv.appendChild(img);
			positionDeleteImgButton(deleteImgButton, i);

			if (i === 0) {
				getFirstElement('#current').src = file.file;
			}
		}
	});

	const currentImageFileElement = getFirstElement('#current');
	const otherImageFileElements = getFirstElement('.imgs img');
	const imgOpacity = 0.6;
	
	otherImageFileElements[0].style.opacity = imgOpacity;

	addEventListnersForImageFileElements(currentImageFileElement, otherImageFileElements, imgOpacity);
}

/**
 * WINDOW EVENT LISTNER 
 */
window.addEventListener('DOMContentLoaded', async () => {
	const goBackButton = getFirstElement('#btn-back-workout');
	goBackButton.addEventListener('click', handleGoBackToWorkoutClick);

	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('id');
	await retrieveWorkoutImages(id);
});

/**
 * HELPERS 
 */
async function validateImgFileType(id, host_variable, acceptedFileTypes) {
	const file = await sendRequest('GET', `${host_variable}/api/workout-files/${id}/`); //eslint-disable-line no-undef
    
	return acceptedFileTypes.includes(file.json().file.split('/')[file.json().file.split('/').length - 1].split('.')[1]);
}

async function handleDeleteImgClick (id, http_keyword, fail_alert_text, host_variable, acceptedFileTypes) {
	if(validateImgFileType(id, host_variable, acceptedFileTypes)){
		return;
	}

	const response = await sendRequest(http_keyword, `${host_variable}/api/workout-files/${id}/`); //eslint-disable-line no-undef

	if (!response.ok) {
		const data = await response.json();
		showAlert(fail_alert_text, data);
	} else {
		location.reload();
	}
}

function handleGoBackToWorkoutClick() {
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('id');
	window.location.replace(`workout.html?id=${id}`);
}

function createDeleteImgButton(file) {
	const deleteImgButton =  document.createElement('input');
	deleteImgButton.type = 'button';
	deleteImgButton.className = 'btn btn-close';
	deleteImgButton.id = file.url.split('/')[file.url.split('/').length - 2];
	deleteImgButton.addEventListener(
		'click',
		() => {
			handleDeleteImgClick(
				deleteImgButton.id,
				'DELETE',
				`Could not delete workout ${deleteImgButton.id}!`,
				HOST, //eslint-disable-line no-undef
				['jpg', 'png', 'gif', 'jpeg', 'JPG', 'PNG', 'GIF', 'JPEG']
			);
		}
	);
}

function positionDeleteImgButton(deleteImgButton, fileCounter) {
	deleteImgButton.style.left = `${(fileCounter % 4) * 191}px`;
	deleteImgButton.style.top = `${Math.floor(fileCounter / 4) * 105}px`;
}

function createFileLink(file) {
	const a = document.createElement('a');
	a.href = file.file;
	const pathArray = file.file.split('/');
	a.text = pathArray[pathArray.length - 1];
	a.className = 'me-2';
}

function addEventListnersForImageFileElements(currentImageFileElement, otherImageFileElements, imgOpacity) {
	otherImageFileElements.forEach((imageFileElement) => imageFileElement.addEventListener('click', (event) => {
		//Changes the main image
		currentImageFileElement.src = event.target.src;

		//Adds the fade animation
		currentImageFileElement.classList.add('fade-in');
		setTimeout(() => currentImageFileElement.classList.remove('fade-in'), 500);

		//Sets the opacity of the selected image to 0.4
		otherImageFileElements.forEach((imageFileElement) => imageFileElement.style.opacity = 1);
		event.target.style.opacity = imgOpacity;
	}));
}

function isFileImg(fileLink) {
	return ['jpg', 'png', 'gif', 'jpeg', 'JPG', 'PNG', 'GIF', 'JPEG'].includes(fileLink.text.split('.')[1]);
}

function getElement(elementId) {
	return document.getElementById(elementId);
}

function getFirstElement(elementId) {
	return document.querySelector(elementId);
}

function showAlert(alertText, data) {
	document.body.prepend(createAlert(alertText, data)); //eslint-disable-line no-undef
}