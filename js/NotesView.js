export default class NotesView {
    constructor(
        root,
        { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}
    ) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteDelete = onNoteDelete;
        this.onNoteEdit = onNoteEdit;
        this.root.innerHTML = `<div class="notes__sidebar">
            <button class="notes__add" type="button">New Note</button>
            <div class="notes__list">
                
            </div>
        </div>
        <div class="notes__preview">
            <input class="notes__title" type="text" placeholder="Enter a title...">
            <textarea class="notes__body">Take Note</textarea>
        </div>`;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach((inputField) => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();
                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });
    }

    _createListHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;
        return `
        <div class ="notes__list-item" data-note-id="${id}">
            <div class ="notes__small-title">${title}</div>
            <div class ="notes__small-body">
                ${body.substring(0, MAX_BODY_LENGTH)}
                ${body.length > MAX_BODY_LENGTH ? "...." : ""}
            </div>
            <div class"notes__small-updated">
            ${updated.toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "short",
            })}
            </div>
        </div>
        `;
    }
    //TODO : hide the note preview by default
    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");
        //Empty the list
        notesListContainer.innerHTML = "";
        for (const note of notes) {
            const html = this._createListHTML(
                note.id,
                note.title,
                note.body,
                new Date(note.updated)
            );
            notesListContainer.insertAdjacentHTML("beforeend", html);
            //Add select/delete event for each list-item
            notesListContainer
                .querySelectorAll(".notes__list-item")
                .forEach((noteListItem) => {
                    noteListItem.addEventListener("click", () => {
                        this.onNoteSelect(noteListItem.dataset.noteId);
                    });
                    noteListItem.addEventListener("dblclick", () => {
                        const doDelete = confirm(
                            "Are you surw want to delete?"
                        );
                        if (doDelete) {
                            this.onNoteDelete(noteListItem.dataset.noteId);
                        }
                    });
                });
        }
    }
    updateActiveNote(note) {
        this.root.querySelector(".note__title").value = note.title;
        this.root.querySelector(".note__body").value = note.body;
    }
}
