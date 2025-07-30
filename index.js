const API_KEY = 'fdb15821ce084787a82202550253007';

// webcam setup for mirror

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    document.getElementById('cam').srcObject = stream;
  })
  .catch(err => {
    console.error('Camera error:', err);
    document.getElementById('cam').poster = "fallback.jpg"; // Optional fallback
  });


// display time 
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'});
  document.getElementById('time').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

//update date
function updateDate() {
  const now = new Date();
  const dateString = now.toLocaleDateString(undefined, {weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'});
  document.getElementById('date').textContent = dateString;
}
setInterval(updateDate, 1000);
updateDate();

// get weather via current location
function getWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById('weather').innerHTML = `
          <p>⋆｡˚ ☁︎  ${data.current.temp_f}°F</p>
          <p>${data.current.condition.text}˚｡⋆</p>
        `;
      } catch (err) {
        document.getElementById('weather').textContent = 'Weather unavailable';
      }
    }, () => {
      document.getElementById('weather').textContent = 'Location permission denied';
    });
  }
}
getWeather();

// cycle through lyrics and use button to go through cycle as needed
let lyrics = [];
let lyricIndex = 0;
let lyricTimeout;

async function loadLyrics() {
  try {
    const res = await fetch('lyrics.json');
    lyrics = await res.json();
    cycleLyrics();
  } catch (err) {
    document.getElementById('lyrics').textContent = 'Lyrics unavailable';
  }
}

function cycleLyrics() {
  if (lyrics.length === 0) return;
  document.getElementById('lyrics').textContent = lyrics[lyricIndex];
  lyricIndex = (lyricIndex + 1) % lyrics.length;

  lyricTimeout = setTimeout(cycleLyrics, 15000); // Change lyric every 15 seconds
}

function nextLyric() {
  if (lyrics.length === 0) return;

  clearTimeout(lyricTimeout); // stop the current auto-cycle timer

  document.getElementById('lyrics').textContent = lyrics[lyricIndex];
  lyricIndex = (lyricIndex + 1) % lyrics.length;

  lyricTimeout = setTimeout(cycleLyrics, 15000); // restart auto cycle timer
}

// Hook up the button
document.getElementById('next-lyric-bttn').addEventListener('click', nextLyric);

loadLyrics();

