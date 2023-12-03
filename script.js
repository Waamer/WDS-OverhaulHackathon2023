document.addEventListener("DOMContentLoaded", attachListeners);
document.addEventListener("DOMContentLoaded", checkPage);

function attachListeners() {
    document.querySelector('.login_form')?.addEventListener('submit', login);
    let logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    let addButton = document.querySelector('.add_file');
    if (addButton) {
        addButton.addEventListener('click', addFile);
    }

    let textToSpeechBtn = document.getElementById('textToSpeechBtn');
    if (textToSpeechBtn) {
        textToSpeechBtn.addEventListener('click', playTextToSpeech);
    }
    let translateBtn = document.getElementById('translateBtn');
    if (translateBtn) {
        translateBtn.addEventListener('click', translateNote);
    }
}

async function translateNote() {
    let noteText = document.querySelector('.writing').value;
    let sourceLanguage = document.getElementById('sourceLanguage').value;
    let targetLanguage = document.getElementById('targetLanguage').value;

    if (noteText.trim() === "") {
        alert("Note is empty. Please write something before translating.");
        return;
    }

    try {
        // Make a request to the MyMemory Translation API
        let response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(noteText)}&langpair=${sourceLanguage}|${targetLanguage}`);
        let data = await response.json();

        if (data && data.responseData && data.responseData.translatedText) {
            // Update the note content with the translated text
            document.querySelector('.writing').value = data.responseData.translatedText;
        } else {
            console.error("Translation failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during translation:", error);
    }
}

function playTextToSpeech() {
    let noteText = document.querySelector('.writing').value;

    let utterance = new SpeechSynthesisUtterance(noteText);
    window.speechSynthesis.speak(utterance);
}

function addFile() {
    let filebar = document.querySelector('.files');

    let noteContent = document.querySelector('.writing').value.trim();

    if (noteContent !== "") {
        let fileName = prompt("Enter file name:");

        if (fileName) {
            let newFileContainer = document.createElement('div');
            newFileContainer.className = "file-container";

            let newFileButton = document.createElement('button');
            newFileButton.textContent = fileName;

            newFileButton.dataset.noteContent = noteContent;

            newFileButton.className = "btn";
            newFileButton.addEventListener('click', loadFile);

            let deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.className = "btn delete-btn";
            deleteButton.addEventListener('click', deleteFile);

            newFileContainer.appendChild(newFileButton);
            newFileContainer.appendChild(deleteButton);

            filebar.appendChild(newFileContainer);

            document.querySelector('.writing').value = "";
        }
    } else {
        alert("Cannot create a file with an empty notepad.");
    }
}

function deleteFile(event) {
    event.stopPropagation();

    let fileContainer = event.target.parentElement;
    let noteContent = document.querySelector('.writing').value.trim();
    let fileContent = fileContainer.querySelector('button').dataset.noteContent.trim();

    if (noteContent === fileContent) {
        document.querySelector('.writing').value = "";
    }

    let confirmDelete = confirm("Are you sure you want to delete this file?");

    if (confirmDelete) {
        fileContainer.remove();
    }
}



function loadFile(event) {
    event.stopPropagation();

    let noteContent = event.target.dataset.noteContent;

    document.querySelector('.writing').value = noteContent;
}



function checkPage() {
    let username = localStorage.getItem('username');
    if (window.location.href.includes('login.html') && username)
        window.location = 'notes.html';
    if (window.location.href.includes('notes.html') && !username)
        window.location = 'login.html';
}

function login(event) {
    event.preventDefault();

    let username = document.querySelector('.login_form input[type="username"]').value;
    let password = document.querySelector('.login_form input[type="password"]').value;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    window.location = 'notes.html';
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    window.location.href = 'login.html';
}