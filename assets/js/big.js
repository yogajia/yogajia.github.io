document.addEventListener("DOMContentLoaded", function () {
  const audio = document.createElement("audio");
  audio.src = "/assets/music/beihai.mp3";
  audio.loop = true;
  audio.autoplay = false;
  audio.volume = 0.5;

  audio.id = "global-bgm";
  audio.style.display = "none";
  document.body.appendChild(audio);

  // 用户首次点击后再播放（防止浏览器拦截）
  document.addEventListener("click", function oncePlay() {
    audio.play().catch(() => {});
    document.removeEventListener("click", oncePlay);
  });
});
