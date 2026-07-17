const songs = [
  { title: "Saiyaara", artist: "Arijit Singh", src: "songs/Saiyaara - SirfJatt.Com.mp3", cover: "songs/song4.jpg" },
  { title: "Aawan Jaawan", artist: "Arijit Singh", src: "songs/Aavan Jaavan - PagalWorld.mp3", cover: "songs/song7.jpg" },
  { title: "Ragile Ragile", artist: "Anirudh R", src: "songs/Ragile Ragile - SirfJatt.Com.mp3", cover: "songs/ragile.jpg" },
  { title: "Sapphire", artist: "Ed Sheeran", src: "songs/Ed_Sheeran_Ft_Arijit_Singh_-_Sapphire_Offblogmedia.com.mp3", cover: "songs/sapphire.jpg" },
  { title: "Perfect", artist: "Ed Sheeran", src: "songs/ed-sheeran-perfect.mp3", cover: "songs/perfect.jpg" },
  { title: "Sky full of Stars", artist: "Coldplay", src: "songs/coldplay-a-sky-full-of-stars.mp3", cover: "songs/sky full of stars.jpg" },
  { title: "Desi Kalakar", artist: "Yo Yo Honey Singh", src: "songs/yo-yo-honey-singh-desi-kalakaar-djmaza-info.mp3", cover: "songs/desi kalakar.jpg" },
  { title: "VIP", artist: "Anirudh R", src: "songs/anirudh-ravichander-vip-title-song.mp3", cover: "songs/vip.jpg" },
  { title: "Softly", artist: "Karan Aujla", src: "songs/karan-aujla-softly.mp3", cover: "songs/softly.jpg" },
  { title: "Electronic Dream", artist: "SoundHelix", src: "songs/SoundHelix1.mp3", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80" },
  { title: "Chill Vibes", artist: "SoundHelix", src: "songs/SoundHelix2.mp3", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" },
  { title: "Synthwave", artist: "SoundHelix", src: "songs/SoundHelix3.mp3", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80" },
  { title: "Acoustic Pop", artist: "SoundHelix", src: "songs/SoundHelix4.mp3", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80" },
  { title: "Piano Melody", artist: "SoundHelix", src: "songs/SoundHelix5.mp3", cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&q=80" },
  { title: "Upbeat Rock", artist: "SoundHelix", src: "songs/SoundHelix6.mp3", cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&q=80" }
];

let songIndex = 0;
let isShuffle = false;
let isRepeat = false;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const muteBtn = document.getElementById("mute");
const volumeSlider = document.getElementById("volume-slider");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const coverWrapper = document.querySelector(".cover-wrapper");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");

// Initialize Playlist
function initPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.classList.add("playlist-item");
    if (index === songIndex) {
      li.classList.add("playing");
    }
    li.innerHTML = `
      <span class="item-index">${index + 1}</span>
      <div class="item-info">
        <h4 class="item-title">${song.title}</h4>
        <p class="item-artist">${song.artist}</p>
      </div>
    `;
    li.addEventListener("click", () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function updatePlaylistUI() {
  const items = document.querySelectorAll(".playlist-item");
  items.forEach((item, index) => {
    if (index === songIndex) {
      item.classList.add("playing");
    } else {
      item.classList.remove("playing");
    }
  });
}

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.src;
  updatePlaylistUI();
}

function playSong() {
  coverWrapper.classList.add("playing");
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  audio.play();
}

function pauseSong() {
  coverWrapper.classList.remove("playing");
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  audio.pause();
}

function nextSong() {
  if (isShuffle) {
    let newIndex = songIndex;
    while (newIndex === songIndex) {
      newIndex = Math.floor(Math.random() * songs.length);
    }
    songIndex = newIndex;
  } else {
    songIndex = (songIndex + 1) % songs.length;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

// Event Listeners
playBtn.addEventListener("click", () => {
  const isPlaying = coverWrapper.classList.contains("playing");
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

// Update Progress
audio.addEventListener("timeupdate", (e) => {
  const { duration, currentTime } = e.srcElement;
  if (!duration) return;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  let mins = Math.floor(currentTime / 60);
  let secs = Math.floor(currentTime % 60);
  if (secs < 10) secs = "0" + secs;
  currentTimeEl.textContent = `${mins}:${secs}`;

  let dmins = Math.floor(duration / 60);
  let dsecs = Math.floor(duration % 60);
  if (dsecs < 10) dsecs = "0" + dsecs;
  durationEl.textContent = `${dmins}:${dsecs}`;
});

// Set Progress
progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const width = rect.width;
  const clickX = e.clientX - rect.left;
  const duration = audio.duration;
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
});

// Auto Next/Repeat
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    playSong();
  } else {
    nextSong();
  }
});

// Volume Control
volumeSlider.addEventListener("input", (e) => {
  const value = e.target.value;
  audio.volume = value / 100;
  if (audio.volume === 0) {
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else if (audio.volume < 0.5) {
    muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
});

muteBtn.addEventListener("click", () => {
  if (audio.volume > 0) {
    audio.dataset.savedVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
    muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    const saved = audio.dataset.savedVolume || 1;
    audio.volume = saved;
    volumeSlider.value = saved * 100;
    muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
});

// Init
initPlaylist();
loadSong(songs[songIndex]);
