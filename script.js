const container = document.getElementById('container');
const addNoteBtn = document.getElementById('addNote');
const toggleBtn = document.getElementById('toggleMode');

let darkMode = false;

// Load notes from localStorage when page loads
window.onload = () => {
  const savedMode = localStorage.getItem('darkMode');
  darkMode = savedMode === 'true';
  setMode(darkMode);

  const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
  savedNotes.forEach(note => createNote(note.text, note.x, note.y, note.colorClass));
};

// Create a new note
function createNote(text = '', x = 50, y = 50, savedColor = null) {
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
  note.dataset.colorClass = colorClass;

  note.style.left = `${x}px`;
  note.style.top = `${y}px`;

  const textarea = document.createElement('textarea');
  textarea.value = text;
  note.appendChild(textarea);

  container.appendChild(note);

  makeDraggable(note);

  // Save on typing
  textarea.addEventListener('input', saveNotes);
}

// Make notes draggable
function makeDraggable(note) {
  let isDragging = false;
  let offsetX, offsetY;

  note.addEventListener('mousedown', startDrag);
  note.addEventListener('touchstart', startDrag);

  function startDrag(e) {
    isDragging = true;
    note.style.zIndex = 1000;
    const rect = note.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag);
    document.addEventListener('touchend', stopDrag);
  }

  function onDrag(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    note.style.left = `${clientX - offsetX}px`;
    note.style.top = `${clientY - offsetY}px`;
  }

  function stopDrag() {
    isDragging = false;
    note.style.zIndex = '';
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
    saveNotes();
  }
}

// Save notes to localStorage
function saveNotes() {
  const notes = Array.from(document.querySelectorAll('.note')).map(note => {
    const textarea = note.querySelector('textarea');
    return {
      text: textarea.value,
      x: parseInt(note.style.left),
      y: parseInt(note.style.top),
      colorClass: note.dataset.colorClass
    };
  });
  localStorage.setItem('notes', JSON.stringify(notes));
  localStorage.setItem('darkMode', darkMode);
}

// Set dark/light mode
function setMode(isDark) {
  darkMode = isDark;
  document.body.classList.toggle('dark-mode', isDark);
  document.body.classList.toggle('light-mode', !isDark);
  toggleBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', darkMode);

  // Recolor all notes
  document.querySelectorAll('.note').forEach(note => {
    note.classList.remove('note-yellow', 'note-green', 'note-pink',
                          'note-dark-blue', 'note-dark-purple', 'note-dark-orange');
    const newColors = isDark
      ? ['note-dark-blue', 'note-dark-purple', 'note-dark-orange']
      : ['note-yellow', 'note-green', 'note-pink'];
    const newColor = newColors[Math.floor(Math.random() * newColors.length)];
    note.classList.add(newColor);
    note.dataset.colorClass = newColor;
  });

  saveNotes();
}

// Toggle mode button
toggleBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  setMode(darkMode);
});

// Add note button
addNoteBtn.addEventListener('click', () => {
  createNote();
  saveNotes();
});
