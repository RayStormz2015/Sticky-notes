const container = document.getElementById('note-container');
const addBtn = document.getElementById('add-note');
const toggleBtn = document.getElementById('toggle-mode');

// Load dark/light mode from localStorage
let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;
setMode(darkMode);

// Load saved notes from localStorage
let notesData = JSON.parse(localStorage.getItem('notes')) || [];
notesData.forEach(data => createNote(data.content, data.top, data.left, data.colorClass));

addBtn.addEventListener('click', () => {
  createNote('', Math.random() * 300, Math.random() * 300);
  saveNotes();
});

toggleBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  setMode(darkMode);
  localStorage.setItem('darkMode', JSON.stringify(darkMode));
});

function setMode(isDark) {
  if (isDark) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    container.classList.add('dark-mode');
    container.classList.remove('light-mode');
    toggleBtn.textContent = '☀️';
    document.querySelectorAll('.note').forEach(note => {
      // Assign random dark color for each note
      const darkColors = ['note-dark-blue', 'note-dark-purple', 'note-dark-orange'];
      const randomDark = darkColors[Math.floor(Math.random() * darkColors.length)];
      note.classList.remove('note-yellow', 'note-green', 'note-pink', 'note-dark-blue', 'note-dark-purple', 'note-dark-orange');
      note.classList.add(randomDark);
      note.dataset.colorClass = randomDark;
    });
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    container.classList.add('light-mode');
    container.classList.remove('dark-mode');
    toggleBtn.textContent = '🌙';
    document.querySelectorAll('.note').forEach(note => {
      // Restore original color if stored in localStorage
      const colorClass = note.dataset.colorClass;
      note.classList.remove('note-dark-blue', 'note-dark-purple', 'note-dark-orange', 'note-yellow', 'note-green', 'note-pink');
      note.classList.add(colorClass);
    });
  }
}

// Function to create a note
function createNote(content, top, left, savedColor) {
  const note = document.createElement('div');
  note.classList.add('note');

  // Assign color
  let colorClass;
  if (darkMode) {
    const darkColors = ['note-dark-blue', 'note-dark-purple', 'note-dark-orange'];
    colorClass = savedColor || darkColors[Math.floor(Math.random() * darkColors.length)];
  } else {
    const lightColors = ['note-yellow', 'note-green', 'note-pink'];
    colorClass = savedColor || lightColors[Math.floor(Math.random() * lightColors.length)];
  }
  note.classList.add(colorClass);
  note.dataset.colorClass = colorClass; // save color for localStorage

  note.innerHTML = `
    <textarea>${content}</textarea>
    <button>×</button>
  `;

  // Set position
  note.style.top = top + "px";
  note.style.left = left + "px";

  container.appendChild(note);

  const textarea = note.querySelector('textarea');

  // Delete button
  note.querySelector('button').addEventListener('click', () => {
    container.removeChild(note);
    saveNotes();
  });

  // Update content on change
  textarea.addEventListener('input', saveNotes);

  // Drag functionality
  let offsetX, offsetY, isDragging = false;

  note.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'TEXTAREA') return;
    isDragging = true;
    offsetX = e.clientX - note.offsetLeft;
    offsetY = e.clientY - note.offsetTop;
    note.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    note.style.left = (e.clientX - offsetX) + "px";
    note.style.top = (e.clientY - offsetY) + "px";
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      note.style.cursor = 'grab';
      saveNotes();
    }
  });
}

// Save notes content, position, and color to localStorage
function saveNotes() {
  const notes = [];
  document.querySelectorAll('.note').forEach(note => {
    notes.push({
      content: note.querySelector('textarea').value,
      top: parseFloat(note.style.top),
      left: parseFloat(note.style.left),
      colorClass: note.dataset.colorClass
    });
  });
  localStorage.setItem('notes', JSON.stringify(notes));
}