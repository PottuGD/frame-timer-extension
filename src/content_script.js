// Function to get the FPS of the video
async function getFPS() {
  // Select the span containing the resolution@FPS
  let resSpan = document.querySelector(
    ".html5-video-info-panel-content > div:nth-child(3) > span:nth-child(2)"
  );

  // Check if the span exists
  if (!resSpan) {
    // If it did not exist open the "Stats for nerds" panel
    await openStatsForNerds();

    // And try to look for it again
    resSpan = document.querySelector(
      ".html5-video-info-panel-content > div:nth-child(3) > span:nth-child(2)"
    );
  }

  // Extract the FPS from the resolution text (resolution@FPS)
  const framerate = resSpan ? resSpan.textContent.match(/@(\d+)\s/) : null;

  // Close the "Stats for nerds" popup
  try {
    // Close the "Stats for nerds" popup
    await closeStatsForNerds();
  } catch {
    console.warn("Stats for nerds not closed");
  }

  // Return the FPS
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

// Function to step a certain amount of frames forward in the video
function stepFrames(frames, fps) {
  // Get the player/video element
  const player = document.getElementsByTagName("video")[0];

  // Jump forward set amount of frames
  player.currentTime = player.currentTime + frames / fps;
}

// Function to open the "Stats for nerds" panel
async function openStatsForNerds() {
  return new Promise((resolve) => {
    // Get the player/video element
    const player = document.getElementsByTagName("video")[0];

    // Right click the video element
    const rightClickEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
      view: window,
      button: 2,
      buttons: 2,
    });

    // Dispatch the right click event
    player.dispatchEvent(rightClickEvent);

    // Select the stats for nerds div and click it
    const statsButton = document.querySelector("div.ytp-menuitem:nth-child(7)");
    statsButton.click();

    // Resolve the Promise
    resolve();
  });
}

// Function to close the "Stats for nerds" panel
async function closeStatsForNerds() {
  return new Promise((resolve, reject) => {
    // Select the close button
    const closeButton = document.querySelector(".ytp-sfn-close");

    // Check if the button exists
    if (!closeButton) {
      reject(new Error("Could not get the close button for Stats for nerds"));
    }

    // Click the button
    closeButton.click();

    // Resolve the Promise
    resolve();
  });
}

// Function to step a certain amount of seconds forward in the video
function stepSeconds(seconds) {
  // Get the player/video element
  const player = document.getElementsByTagName("video")[0];

  // Jump forward set amount of seconds
  player.currentTime = player.currentTime + seconds;
}

// Function to pause/unpause the video
function pauseVideo(shouldPause) {
  // Get the player/video element
  const player = document.getElementsByTagName("video")[0];

  // Pause or unpause the video
  if (shouldPause) {
    player.pause();
  } else {
    player.play();
  }
}

// Function to get the state of the video
function getVideoState() {
  // Get the player/video element
  const player = document.getElementsByTagName("video")[0];
  return !player.paused;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // getFPS
  if (message.action === "getFPS") {
    getFPS().then((response) => {
      sendResponse({ fps: response });
    });
    // Return true to indicate that the response will be sent asynchronously
    return true;
  }

  // getCurrentTime
  if (message.action === "getCurrentTime") {
    const currentTime = getCurrentTime();
    sendResponse({ currentTime });
  }

  // stepFrames
  if (message.action === "stepFrames") {
    stepFrames(message.frames, message.fps);
    sendResponse({ status: "completed" });
  }

  // stepSeconds
  if (message.action === "stepSeconds") {
    stepSeconds(message.seconds);
    sendResponse({ status: "completed" });
  }

  // pauseVideo
  if (message.action === "pauseVideo") {
    pauseVideo(message.shouldPause);
    sendResponse({ status: "completed" });
  }

  // getPausedState
  if (message.action === "getVideoState") {
    const state = getVideoState();
    sendResponse({ state: state, status: "completed" });
  }

  // Return true to ensure the channel remains open for async responses
  return true;
});
