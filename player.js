// Dynamically load the YouTube IFrame API
(function loadYouTubeIframeAPI() {
  const scriptId = 'youtube-iframe-api';
  if (document.getElementById(scriptId)) return;
  const tag = document.createElement('script');
  tag.id = scriptId;
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScript = document.getElementsByTagName('script')[0] || document.body;
  firstScript.parentNode.insertBefore(tag, firstScript);
})();

let ytPlayer = null;

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function getInitialVideoId() {
  const fromQuery = getQueryParam('v') || getQueryParam('video') || getQueryParam('id');
  if (fromQuery) return parseVideoId(fromQuery) || 'M7lc1UVf-VE';
  const input = document.getElementById('videoId');
  if (input && input.value) return parseVideoId(input.value) || 'M7lc1UVf-VE';
  return 'M7lc1UVf-VE'; // official sample video
}

// Extract 11-char video ID from a URL or plain ID
function parseVideoId(urlOrId) {
  if (!urlOrId) return null;
  const str = String(urlOrId).trim();

  const byParam = str.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (byParam && byParam[1]) return byParam[1];

  const shortUrl = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortUrl && shortUrl[1]) return shortUrl[1];

  const embedUrl = str.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedUrl && embedUrl[1]) return embedUrl[1];

  const plain = str.match(/^[a-zA-Z0-9_-]{11}$/);
  if (plain) return str;

  return null;
}

// Called by the IFrame API once it is ready
window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
  const hostElementId = 'player';
  const host = document.getElementById(hostElementId);
  if (!host) return;

  ytPlayer = new YT.Player(hostElementId, {
    height: '390',
    width: '640',
    videoId: getInitialVideoId(),
    playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
    events: { onReady: onPlayerReady }
  });
};

function onPlayerReady() {
  const playButton = document.getElementById('play');
  const pauseButton = document.getElementById('pause');
  const loadButton = document.getElementById('load');
  const input = document.getElementById('videoId');

  if (playButton) playButton.addEventListener('click', () => ytPlayer && ytPlayer.playVideo());
  if (pauseButton) pauseButton.addEventListener('click', () => ytPlayer && ytPlayer.pauseVideo());
  if (loadButton && input) {
    loadButton.addEventListener('click', () => {
      const id = parseVideoId(input.value);
      if (id) {
        ytPlayer.loadVideoById(id);
        const url = new URL(window.location.href);
        url.searchParams.set('v', id);
        window.history.replaceState({}, '', url.toString());
      } else {
        alert('Enter a valid YouTube URL or 11-character video ID.');
      }
    });
  }
}
