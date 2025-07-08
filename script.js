let notes = []
let currentNoteID = null

function loadNotes() {
    const savedNotes = localStorage.getItem("notes")
    return savedNotes ? JSON.parse(savedNotes) : []
}

function openDialog(noteId = null) {
    const dialog = document.getElementById("noteDialog");
    const titleInput = document.getElementById("noteTitle");
    const contentInput = document.getElementById("noteContent");

    if (noteId) {
        //Editing mode
        const noteToEdit = notes.find(note => note.id == noteId)
        currentNoteID = noteId
        document.getElementById("dialogTitle").textContent = "Editar nota";
        titleInput.value = noteToEdit.title
        contentInput.value = noteToEdit.content
    } else {
        //Add note
        currentNoteID = null
        document.getElementById("dialogTitle").textContent = "Añadir nota"
        titleInput.value = ""
        contentInput.value = ""
    }

    dialog.showModal()
    titleInput.focus()
}

function closeDialog() {
    document.getElementById("noteDialog").close()
}


const cancelButton = document.querySelector(".close-btn").addEventListener("click", closeDialog);
const closeButton = document.querySelector(".cancel-btn").addEventListener("click", closeDialog);

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark-theme")
    localStorage.setItem("theme", isDark ? "dark" : "light")
}

function applyTheme() {
    if (localStorage.getItem("theme") == "dark") {
        document.body.classList.add("dark-theme")
    }
}

document.addEventListener("DOMContentLoaded", function() {
    applyTheme()
    notes = loadNotes()
    showNotes()

    document.getElementById("themeToggleBtn").addEventListener("click", toggleTheme)
    document.getElementById("noteDialog").addEventListener("click", function(e){
        if(e.target === this){
            closeDialog()
        }
    })
});

document.getElementById("noteForm").addEventListener("submit", saveNote)


function saveNote(e) {
    e.preventDefault()

    const title = document.getElementById("noteTitle").value;
    const content = document.getElementById("noteContent").value;

    if (currentNoteID) {
        //Update existing note
        const noteIndex = notes.findIndex(note => note.id == currentNoteID);
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }
    } else {
        //Add note
        notes.unshift({
        id : randomID(),
        title : title,
        content : content
    })
    }
    closeDialog()
    saveAllNotes()
    showNotes()
}

function randomID() {
    return (notes.length)
}

function saveAllNotes() {
    localStorage.setItem("notes", JSON.stringify(notes))
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id != noteId)
    saveAllNotes()
    showNotes()
}

function showNotes() {
    const notesBox = document.getElementById("notesContainer");

    if (notes.length === 0) {
        notesBox.innerHTML = `
        <div class="empty-state">
            <h2>No hay notas aún</h2>
            <p>Crea una nota para empezar</p>
            <button type="button" class="add-note-btn" onclick="openDialog()">
                +Añade una nota
            </button>
        </div>
        `
        return
    } else {
        notesBox.innerHTML = notes.map(note=>`
            <div class="note-card">
                <h3 class="note-title">${note.title}</h3>
                <p class="note-content">${note.content}</p>
                <div class="note-actions">
                    <button class="edit-btn" onclick="openDialog('${note.id}')" title="Edit Note">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                        </svg>
                    </button>
                </div>
            </div>
    `).join('')
    }
}
