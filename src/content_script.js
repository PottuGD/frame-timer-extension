function getFPS() {
  const divs = document.querySelectorAll("div");
  let resDiv = null;

  divs.forEach((div) => {
    if (div.textContent.includes("Current / Optimal Res")) {
      resDiv = div;
    }
  });

  const resSpan = resDiv ? resDiv.nextElementSibling : null;
  const framerate = resSpan ? resSpan.textContent.match(/@(\d+)\s/) : null;

  if (framerate) {
    return framerate[1];
  } else {
    return null;
  }
}

function getCurrentTime() {
  const player = document.getElementsByTagName("video")[0];
  return player ? player.currentTime : null;
}

function stepFrames(frames) {
  const player = document.getElementsByTagName("video")[0];

  fps = 60; // TODO: Set automatically
  player.currentTime = player.currentTime + frames / fps;

  return;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getFPS") {
    const fps = getFPS();
    sendResponse({ fps });
  }

  if (message.action === "getCurrentTime") {
    const currentTime = getCurrentTime();
    sendResponse({ currentTime });
  }

  if (message.action === "stepFrames") {
    const frames = message.frames;
    stepFrames(frames);
  }
});
