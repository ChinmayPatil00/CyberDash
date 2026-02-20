const songs = [
  { title: "Saiyaara", artist: "Arijit Singh", src: "songs/Saiyaara - SirfJatt.Com.mp3", cover: "songs/song4.jpg" },
  { title: "Aawan Jaawan", artist: "Arijit Singh", src: "songs/Aavan Jaavan - PagalWorld.mp3", cover: "songs/song7.jpg" },
  { title: "Ragile Ragile", artist: "Anirudh R", src: "songs/Ragile Ragile - SirfJatt.Com.mp3", cover: "songs/ragile.jpg" },
  { title: "Sapphire", artist: "Ed Sheeran", src: "songs/Ed_Sheeran_Ft_Arijit_Singh_-_Sapphire_Offblogmedia.com.mp3", cover: "songs/sapphire.jpg" },
  { title: "Perfect", artist: "Ed Sheeran", src: "songs/ed-sheeran-perfect.mp3", cover: "songs/perfect.jpg" },
  { title: "Sky full of Stars", artist: "Coldplay", src: "songs/coldplay-a-sky-full-of-stars.mp3", cover: "songs/sky full of stars.jpg" },
  { title: "Desi Kalakar", artist: "Yo Yo Honey Singh", src: "songs/yo-yo-honey-singh-desi-kalakaar-djmaza-info.mp3", cover: "songs/desi kalakar.jpg" },
  { title: "VIP", artist: "Anirudh R", src: "songs/anirudh-ravichander-vip-title-song.mp3", cover: "songs/vip.jpg" },
];

let songIndex = 0;

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.src;
}
function playSong() { audio.play(); playBtn.innerHTML = "❙❙"; }
function pauseSong() { audio.pause(); playBtn.innerHTML = "▶"; }
function nextSong() { songIndex = (songIndex + 1) % songs.length; loadSong(songs[songIndex]); playSong(); }
function prevSong() { songIndex = (songIndex - 1 + songs.length) % songs.length; loadSong(songs[songIndex]); playSong(); }

audio.addEventListener("timeupdate", (e) => {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  progress.style.width = `${progressPercent}%`;

  let mins = Math.floor(currentTime / 60);
  let secs = Math.floor(currentTime % 60);
  if (secs < 10) secs = "0" + secs;
  currentTimeEl.textContent = `${mins}:${secs}`;

  if (duration) {
    let dmins = Math.floor(duration / 60);
    let dsecs = Math.floor(duration % 60);
    if (dsecs < 10) dsecs = "0" + dsecs;
    durationEl.textContent = `${dmins}:${dsecs}`;
  } else {
    durationEl.textContent = "0:00";
  }
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});
audio.addEventListener("ended", nextSong);

playBtn.addEventListener("click", () => {
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

loadSong(songs[songIndex]);
