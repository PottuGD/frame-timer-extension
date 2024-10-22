function getFPS() {
  // Select the container div with the specified class
  const container = document.querySelector(
    ".html5-video-info-panel-content.ytp-sfn-content"
  );

  // Ensure the container exists before proceeding
  if (!container) {
    return null;
  }

  // Select all divs within the container
  const divs = container.querySelectorAll("div");
  let resDiv = null;

  divs.forEach((div) => {
    if (div.textContent.includes("Current / Optimal Res")) {
      resDiv = div;
      console.log("Found resDiv");
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

function stepFrames(frames, fps) {
  const player = document.getElementsByTagName("video")[0];
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
    const fps = message.fps;
    stepFrames(frames, fps);
  }
});
