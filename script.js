// ==================== ELEMENTS ====================
const collapsedForm = document.querySelector(".form-container");
const expandedForm = document.querySelector(".active-form");
const notesContainer = document.querySelector(".notes");
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const sidebarItems = document.querySelectorAll(".sidebar-item");
const searchArea = document.querySelector(".search-input");
const darkModeToggle = document.getElementById("darkModeToggle");

searchArea.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(query) ||
    note.text.toLowerCase().includes(query)
  );

  renderNotes(filteredNotes);
});

// INPUTS (main form)
const titleInput = expandedForm.querySelector(".note-title");
const textInput = expandedForm.querySelector(".note-text");

// MODAL INPUTS
const modalTitle = modalContent.querySelector(".note-title");
const modalText = modalContent.querySelector(".note-text");

// ==================== STATE ====================
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editIndex = null;

// ==================== SIDEBAR ACTIVE ====================
sidebarItems.forEach(item => {
  item.addEventListener("click", () => {
    sidebarItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
  });
});

// ==================== FORM EXPAND / COLLAPSE ====================
// Expand single-line form to full form
collapsedForm.addEventListener("click", () => {
  collapsedForm.style.display = "none";
  expandedForm.style.display = "block";
  titleInput.focus();
});

// Collapse expanded form when clicking outside or on search
document.addEventListener("click", (e) => {
  const clickedInsideForm = expandedForm.contains(e.target);
  const clickedSearchArea = searchArea.contains(e.target);
  const clickedCollapsedForm = collapsedForm.contains(e.target);

  if (!clickedInsideForm && !clickedSearchArea && !clickedCollapsedForm) {
    expandedForm.style.display = "none";
    collapsedForm.style.display = "block";
  }
});

// ==================== CLOSE FORM + SAVE NOTE ====================
expandedForm.querySelector(".close-btn").addEventListener("click", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if (title || text) {
    notes.push({ title, text, urgent: false });
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
  }

  // reset inputs
  titleInput.value = "";
  textInput.value = "";

  expandedForm.style.display = "none";
  collapsedForm.style.display = "block";
});

// Check localStorage for dark mode preference
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark-mode");
}

// Toggle Dark Mode AI Assisted Feature
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
  } else {
    localStorage.setItem("darkMode", "disabled");
  }
});

// ==================== RENDER NOTES ====================
function renderNotes(filteredNotes = notes) {
  notesContainer.innerHTML = "";

filteredNotes.forEach((note) => {
  const index = notes.indexOf(note);
    const noteEl = document.createElement("div");
noteEl.classList.add("note");

if (note.urgent) {
  noteEl.classList.add("urgent");
}

    noteEl.innerHTML = `
      <span class="material-symbols-outlined check-circle">check_circle</span>
      <div class="title">${note.title}</div>
      <div class="text">${note.text}</div>

      <div class="note-footer">
        <div class="tooltip"><span class="material-symbols-outlined hover small-icon">add_alert</span><span class="tooltip-text">Remind me</span></div>
        <div class="tooltip"><span class="material-symbols-outlined hover small-icon">person_add</span><span class="tooltip-text">Collaborator</span></div>
        <div class="tooltip"><span class="material-symbols-outlined hover small-icon">palette</span><span class="tooltip-text">Change Color</span></div>
        <div class="tooltip"><span class="material-symbols-outlined hover small-icon">image</span><span class="tooltip-text">Add Image</span></div>
        <div class="tooltip"><span class="material-symbols-outlined hover small-icon">archive</span><span class="tooltip-text">Archive</span></div>
        <div class="tooltip"><span class="material-symbols-outlined hover small-icon more_vert">More</span><span class="tooltip-text">More</span></div>
        <div class="tooltip"><span class="material-symbols-outlined hover small-icon urgent-btn">priority_high</span><span class="tooltip-text">Urgent</span></div>
        <div class="tooltip"><span class="material-symbols-outlined hover small-icon delete-btn">delete</span><span class="tooltip-text">Delete</span></div>
      </div>
    `;

    // 👉 OPEN MODAL
    noteEl.addEventListener("click", () => openModal(index));

    // 👉 DELETE
    noteEl.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteNote(index);
    });

    noteEl.querySelector(".urgent-btn").addEventListener("click", (e) => {
  e.stopPropagation();

  // Toggle urgent state in data
  notes[index].urgent = !notes[index].urgent;

  // Save to localStorage
  localStorage.setItem("notes", JSON.stringify(notes));

  // Re-render UI
  renderNotes();
});

    notesContainer.appendChild(noteEl);
  });
}

// ==================== DELETE NOTE ====================
function deleteNote(index) {
  notes.splice(index, 1);
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
}

// ==================== MODAL FUNCTIONS ====================
function openModal(index) {
  editIndex = index;

  modal.classList.add("open-modal");
  modalTitle.value = notes[index].title;
  modalText.value = notes[index].text;
}

// Close modal when clicking outside
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal();
  }
});


// Close modal when clicking search area
searchArea.addEventListener("focus", () => {
  if (modal.classList.contains("open-modal")) {
    closeModal();
  }
});

// Save modal changes
function closeModal() {
  if (editIndex !== null) {
    notes[editIndex].title = modalTitle.value;
    notes[editIndex].text = modalText.value;
  }

  localStorage.setItem("notes", JSON.stringify(notes));

  modal.classList.remove("open-modal");
  editIndex = null;

  renderNotes();
}

renderNotes();