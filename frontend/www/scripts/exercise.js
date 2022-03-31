let cancelButton;
let okButton;
let deleteButton;
let editButton;
let oldFormData;

/**
 * Data class for muscle group
 */
class MuscleGroup { 
	constructor(type) {
		this.isValidType = false;
		this.validTypes = ['Legs', 'Chest', 'Back', 'Arms', 'Abdomen', 'Shoulders'];

		this.type = this.validTypes.includes(type) ? type : undefined;
	}

	setMuscleGroupType = (newType) => {
		this.isValidType = false;
        
		if(this.validTypes.includes(newType)){
			this.isValidType = true;
			this.type = newType;
		}
		else{
			alert('Invalid muscle group!');
		}

	};
    
	getMuscleGroupType = () => {
		return this.type;
	};
}

/**
 * CANCEL CLICKED DURING EDITING
 */
function handleCancelButtonDuringEdit() {
	setReadOnly(true, '#form-exercise'); //eslint-disable-line no-undef
	document.querySelector('select').setAttribute('disabled', '');

	hideButtonsAtCancelPressedDuringEdit();

	const form = document.querySelector('#form-exercise');
	replaceOldFormData(form);
}

function hideButtonsAtCancelPressedDuringEdit() {
	okButton.className += ' hide';
	deleteButton.className += ' hide';
	cancelButton.className += ' hide';
	editButton.className = editButton.className.replace(' hide', '');

	cancelButton.removeEventListener('click', handleCancelButtonDuringEdit);
}


/**
 * CREATE EXERCISE CLICKED
 */
function handleCancelButtonDuringCreate() {
	window.location.replace('exercises.html');
}

async function createExercise() {
	document.querySelector('select').removeAttribute('disabled');

	const response = await sendRequest( //eslint-disable-line no-undef
		'POST', 
		`${HOST}/api/exercises/`, //eslint-disable-line no-undef
		getFormDataBody(
			new FormData(document.querySelector('#form-exercise')),
			new FormData(document.querySelector('#form-exercise')).get('muscleGroup')
		)
	); 

	if (response.ok) {
		window.location.replace('exercises.html');
		return;
	}

	document.body.prepend(createAlert('Could not create new exercise!', await response.json())); //eslint-disable-line no-undef
}

/**
 * EDIT EXERCISE CLICKED
 */
function handleEditExerciseButtonClick() {
	setReadOnly(false, '#form-exercise'); //eslint-disable-line no-undef

	document.querySelector('select').removeAttribute('disabled');

	hideButtonsAtEditClicked();

	cancelButton.addEventListener('click', handleCancelButtonDuringEdit);

	oldFormData = new FormData(document.querySelector('#form-exercise'));
}

function hideButtonsAtEditClicked() {
	editButton.className += ' hide';
	okButton.className = okButton.className.replace(' hide', '');
	cancelButton.className = cancelButton.className.replace(' hide', '');
	deleteButton.className = deleteButton.className.replace(' hide', '');
}


async function deleteExercise(id) {
	const response = await sendRequest('DELETE', `${HOST}/api/exercises/${id}/`); //eslint-disable-line no-undef
	if (!response.ok) {
		document.body.prepend(createAlert(`Could not delete exercise ${id}`, await response.json())); //eslint-disable-line no-undef
	} else {
		window.location.replace('exercises.html');
	}
}

async function retrieveExercise(id) {
	const response = await sendRequest('GET', `${HOST}/api/exercises/${id}/`); //eslint-disable-line no-undef

	if (!response.ok) {
		document.body.prepend(createAlert('Could not retrieve exercise data!', await response.json())); //eslint-disable-line no-undef
		return;
	}
	document.querySelector('select').removeAttribute('disabled');

	const exerciseData = await response.json();
	const formData = new FormData(document.querySelector('#form-exercise'));

	for (const key of formData.keys()) {
		const selector = key !== 'muscleGroup' ? `input[name="${key}"], textarea[name="${key}"]` : `select[name=${key}]`;
		const input = document.querySelector('#form-exercise').querySelector(selector);
		input.value = exerciseData[key];
	}

	document.querySelector('select').setAttribute('disabled', '');
}

async function updateExercise(id) {
	const formData = new FormData(document.querySelector('#form-exercise'));

	document.querySelector('select').removeAttribute('disabled');
	
	const response = await sendRequest( //eslint-disable-line no-undef
		'PUT', 
		`${HOST}/api/exercises/${id}/`, //eslint-disable-line no-undef
		getFormDataBody( 
			new FormData(document.querySelector('#form-exercise')), 
			new MuscleGroup(formData.get('muscleGroup')).getMuscleGroupType()
		)
	);

	if (!response.ok) {
		document.body.prepend(createAlert(`Could not update exercise ${id}`, await response.json())); //eslint-disable-line no-undef
		return;
	}

	document.querySelector('select').setAttribute('disabled', '');
	// duplicate code from handleCancelButtonDuringEdit
	// you should refactor this
	setReadOnly(true, '#form-exercise'); //eslint-disable-line no-undef
	
	hideButtonsOnUpdate();
}

function hideButtonsOnUpdate() {
	okButton.className += ' hide';
	deleteButton.className += ' hide';
	cancelButton.className += ' hide';
	editButton.className = editButton.className.replace(' hide', '');
    
	cancelButton.removeEventListener('click', handleCancelButtonDuringEdit);
}

/**
 * WINDOW EVENTLISTNER
 */
window.addEventListener('DOMContentLoaded', async () => {
	setButtons();

	// view/edit
	if (new URLSearchParams(window.location.search).has('id')) {
		const exerciseId = new URLSearchParams(window.location.search).get('id');
		await retrieveExercise(exerciseId);

		onEditOrViewSetButtonEventListners(exerciseId);

		return;
	} 
	//create
	setReadOnly(false, '#form-exercise'); //eslint-disable-line no-undef

	onCreateSetupButtons();
});

function setButtons() {
	cancelButton = document.querySelector('#btn-cancel-exercise');
	okButton = document.querySelector('#btn-ok-exercise');
	deleteButton = document.querySelector('#btn-delete-exercise');
	editButton = document.querySelector('#btn-edit-exercise');
	oldFormData = null;
}

function onEditOrViewSetButtonEventListners(exerciseId) {
	editButton.addEventListener('click', handleEditExerciseButtonClick);
	deleteButton.addEventListener('click', (async (id) => await deleteExercise(id)).bind(undefined, exerciseId));
	okButton.addEventListener('click', (async (id) => await updateExercise(id)).bind(undefined, exerciseId));
}

function onCreateSetupButtons() {
	editButton.className += ' hide';
	okButton.className = okButton.className.replace(' hide', '');
	cancelButton.className = cancelButton.className.replace(' hide', '');

	okButton.addEventListener('click', async () => await createExercise());
	cancelButton.addEventListener('click', handleCancelButtonDuringCreate);
}

function getFormDataBody(formData, muscleGroup) {
	return  {
		'name': formData.get('name'), 
		'description': formData.get('description'),
		'duration': formData.get('duration'),
		'calories': formData.get('calories'),
		'muscleGroup': muscleGroup, 
		'unit': formData.get('unit')
	};
}

function replaceOldFormData(form) {
	if (oldFormData.has('name')) form.name.value = oldFormData.get('name');
	if (oldFormData.has('description')) form.description.value = oldFormData.get('description');
	if (oldFormData.has('duration')) form.duration.value = oldFormData.get('duration');
	if (oldFormData.has('calories')) form.calories.value = oldFormData.get('calories');
	if (oldFormData.has('muscleGroup')) form.muscleGroup.value = oldFormData.get('muscleGroup');
	if (oldFormData.has('unit')) form.unit.value = oldFormData.get('unit');
}