import hoursOptions from './hoursOptions.mjs';
import blockersOptions from './blockersOptions.mjs';
import settings from './settings.mjs';

import download from './download.mjs';


const OPTIONS_OUTER_CONTAINER_CLASS_NAME = 'optionsOuterContainer';
const OPTIONS_INNER_CONTAINER_CLASS_NAME = 'optionsInnerContainer';
const OPTIONS_CLASS_NAME = 'options';
const EXIT_BUTTON_CLASS_NAME = 'exitButton';

const HOURS_FILE_BUTTON_SELECTOR = '#hoursButton';
const SLOT_BLOCKERS_BUTTON_SELECTOR = '#slotBlockersButton';
const UPDATE_TUTORS_BUTTON_SELECTOR = '#updateTutorsButton';
const TUTORS_LIST_BUTTON_SELECTOR = '#tutorsListButton';
const SETTINGS_BUTTON_SELECTOR = '#settingsButton';


const hoursFileButton = document.querySelector(HOURS_FILE_BUTTON_SELECTOR);
const slotBlockersButton = document.querySelector(SLOT_BLOCKERS_BUTTON_SELECTOR);
const updateTutorsButton = document.querySelector(UPDATE_TUTORS_BUTTON_SELECTOR);
const tutorsListButton = document.querySelector(TUTORS_LIST_BUTTON_SELECTOR);
const settingsButton = document.querySelector(SETTINGS_BUTTON_SELECTOR);


hoursFileButton.onclick = () => {
  fetch('/options/hours')
    .then(res => res.text())
    .then(hoursOptionsHTML => renderOptions(hoursOptionsHTML, hoursOptions.setup))
    .catch(alert);
};

slotBlockersButton.onclick = () => {
  fetch('/options/blockers')
    .then(res => res.text())
    .then(blockersOptionsHTML => renderOptions(blockersOptionsHTML, blockersOptions.setup))
    .catch(alert);
};

updateTutorsButton.onclick = () => {
  fetch('/tutors/update', { method: 'POST' })
    .then(res => res.json())
    .catch(alert);
};

tutorsListButton.onclick = () => {
  fetch('/tutors/list', { method: 'GET' })
    .then(res => res.json())
    .then(tutors => tutors.map(tutor => (
      `${tutor.name}\n`
      + `Classes: ${tutor.services.join(', ')}`
    )))
    .then(tutors => tutors.join('\n\n'))
    .then(tutors => download('tutors list - 10-18-2018.txt', tutors))
    .catch(alert);
};

settingsButton.onclick = () => {
  fetch('/options/settings')
    .then(res => res.text())
    .then(settingsHTML => renderOptions(settingsHTML, settings.setup))
    .catch(alert);
};

let optionsOpen = 0;

function renderOptions(html, setup, force) {
  if (!force && optionsOpen) return;

  optionsOpen += 1;

  const optionsOuterContainer = document.createElement('div');
  optionsOuterContainer.className = OPTIONS_OUTER_CONTAINER_CLASS_NAME;

  const optionsInnerContainer = document.createElement('div');
  optionsInnerContainer.className = OPTIONS_INNER_CONTAINER_CLASS_NAME;

  const exitButton = document.createElement('span');
  exitButton.className = EXIT_BUTTON_CLASS_NAME;
  exitButton.innerText = 'X';
  exitButton.onclick = () => {
    document.body.removeChild(optionsOuterContainer);
    optionsOpen -= 1;
  };

  const optionsDiv = document.createElement('div');
  optionsDiv.className = OPTIONS_CLASS_NAME;
  optionsDiv.innerHTML = html;

  optionsInnerContainer.appendChild(exitButton);
  optionsInnerContainer.appendChild(optionsDiv);
  optionsOuterContainer.appendChild(optionsInnerContainer);
  document.body.appendChild(optionsOuterContainer);

  if (setup) setup();
}

export default {
  renderOptions
};
