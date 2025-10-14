let player = null;

function extractVideoId(input) {
  try {
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const url = new URL(trimmed);
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const pathname = url.pathname;
      const match = pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[1];
    }
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.replace('/', '');
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
  } catch (_) {}
  return null;
}

function onYouTubeIframeAPIReady() {
  // The API looks for this global; we re-initialize when needed
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

function loadVideoById(videoId, options) {
  const startSeconds = Number(options.startSeconds || 0) || 0;
  const playerVars = {
    autoplay: options.autoplay ? 1 : 0,
    cc_load_policy: options.cc ? 1 : 0,
    controls: options.controls ? 1 : 0,
    rel: 0,
    playsinline: 1,
    start: startSeconds,
  };

  if (!player) {
    player = new YT.Player('player', {
      height: '100%',
      width: '100%',
      videoId,
      playerVars,
      events: {
        onReady: (ev) => {
          if (playerVars.autoplay) ev.target.playVideo();
        },
      },
    });
  } else {
    player.loadVideoById({ videoId, startSeconds });
  }
}

function initForm() {
  const form = document.getElementById('load-form');
  const input = document.getElementById('video-input');
  const startInput = document.getElementById('start-seconds');
  const autoplaySelect = document.getElementById('autoplay');
  const ccSelect = document.getElementById('cc');
  const controlsSelect = document.getElementById('controls');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = extractVideoId(input.value);
    if (!id) {
      alert('Please enter a valid YouTube URL or 11-character video ID.');
      return;
    }
    const options = {
      startSeconds: startInput.value,
      autoplay: autoplaySelect.value === '1',
      cc: ccSelect.value === '1',
      controls: controlsSelect.value === '1',
    };
    loadVideoById(id, options);
  });
}

window.addEventListener('DOMContentLoaded', initForm);
