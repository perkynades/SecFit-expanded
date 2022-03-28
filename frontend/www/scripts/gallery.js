let goBackButton;

async function retrieveWorkoutImages(id) {  
	let workoutData = null;
	const response = await sendRequest('GET', `${HOST}/api/workouts/${id}/`); //eslint-disable-line no-undef
	if (!response.ok) {
		const data = await response.json();
		showAlert('Could not retrieve workout data!', data);
	} else {
		workoutData = await response.json();

		getElement('workout-title').innerHTML = `Workout name: ${workoutData.name}`;
		getElement('workout-owner').innerHTML = `Owner: ${workoutData.owner_username}`;

		const hasNoImages = workoutData.files.length == 0;
		const noImageText = getFirstElement('#no-images-text');

		if(hasNoImages){
			noImageText.classList.remove('hide');
			return;
		}

		noImageText.classList.add('hide');

        
		const filesDiv = getElement('img-collection');
		const filesDeleteDiv = getElement('img-collection-delete');
        
		const currentImageFileElement = getFirstElement('#current');
		let isFirstImg = true;

		let fileCounter = 0;

		for (const file of workoutData.files) {
			const a = document.createElement('a');
			a.href = file.file;
			const pathArray = file.file.split('/');
			a.text = pathArray[pathArray.length - 1];
			a.className = 'me-2';

            

			const isImage = ['jpg', 'png', 'gif', 'jpeg', 'JPG', 'PNG', 'GIF', 'JPEG'].includes(a.text.split('.')[1]);

			if(isImage){
				const deleteImgButton = document.createElement('input');
				deleteImgButton.type = 'button';
				deleteImgButton.className = 'btn btn-close';
				deleteImgButton.id = file.url.split('/')[file.url.split('/').length - 2];
				deleteImgButton.addEventListener('click', () => handleDeleteImgClick(deleteImgButton.id, 'DELETE', `Could not delete workout ${deleteImgButton.id}!`, HOST, ['jpg', 'png', 'gif', 'jpeg', 'JPG', 'PNG', 'GIF', 'JPEG'])); //eslint-disable-line no-undef
				filesDeleteDiv.appendChild(deleteImgButton);
                
				const img = document.createElement('img');
				img.src = file.file;
                
				filesDiv.appendChild(img);
				deleteImgButton.style.left = `${(fileCounter % 4) * 191}px`;
				deleteImgButton.style.top = `${Math.floor(fileCounter / 4) * 105}px`;

				if(isFirstImg){
					currentImageFileElement.src = file.file;
					isFirstImg = false;
				}
				fileCounter++;
			}
		}

		const otherImageFileElements = getFirstElement('.imgs img');
		const selectedOpacity = 0.6;
		otherImageFileElements[0].style.opacity = selectedOpacity;

		otherImageFileElements.forEach((imageFileElement) => imageFileElement.addEventListener('click', (event) => {
			//Changes the main image
			currentImageFileElement.src = event.target.src;

			//Adds the fade animation
			currentImageFileElement.classList.add('fade-in');
			setTimeout(() => currentImageFileElement.classList.remove('fade-in'), 500);

			//Sets the opacity of the selected image to 0.4
			otherImageFileElements.forEach((imageFileElement) => imageFileElement.style.opacity = 1);
			event.target.style.opacity = selectedOpacity;
		}));

	}
	return workoutData;     
}

async function validateImgFileType(id, host_variable, acceptedFileTypes) {
	const file = await sendRequest('GET', `${host_variable}/api/workout-files/${id}/`); //eslint-disable-line no-undef
	const fileData = await file.json();
	const fileType = fileData.file.split('/')[fileData.file.split('/').length - 1].split('.')[1];
    
	return acceptedFileTypes.includes(fileType);
}

async function handleDeleteImgClick (id, http_keyword, fail_alert_text, host_variable, acceptedFileTypes) {
    
	if(validateImgFileType(id, host_variable, acceptedFileTypes, )){
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

window.addEventListener('DOMContentLoaded', async () => {

	goBackButton = getFirstElement('#btn-back-workout');
	goBackButton.addEventListener('click', handleGoBackToWorkoutClick);

	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('id');
	await retrieveWorkoutImages(id);
});

function getElement(elementId) {
	return document.getElementById(elementId);
}

function getFirstElement(elementId) {
	document.querySelector(elementId);
}

function showAlert(alertText, data) {
	document.body.prepend(createAlert(alertText, data)); //eslint-disable-line no-undef
}