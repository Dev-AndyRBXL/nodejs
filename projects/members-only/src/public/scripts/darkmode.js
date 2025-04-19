document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  
  const darkToggle = document.getElementById('darkToggle');
  if (!darkToggle) return;

  // Restore dark mode from previous session
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    document.querySelectorAll('img').forEach((img) => img.classList.add('dark'));
    darkToggle.textContent = 'Light Mode';
  }

  darkToggle.addEventListener('click', () => {
    console.log('Button clicked');
    const isDark = document.body.classList.toggle('dark');
    document.querySelectorAll('img').forEach((img) => img.classList.toggle('dark'));

    darkToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
});
