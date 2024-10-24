import * as helpers from "./helpers.js";

// Event listeners for the auto buttons
document
  .getElementById("autoStartButton")
  .addEventListener("click", async function () {
    // Set the start time to the current time and update the FPS
    await Promise.all([helpers.getCurrentTime("start"), helpers.getFPS()]);

    // Format the time values
    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");
    startTime.value = helpers.parseTime(startTime.value);
    endTime.value = helpers.parseTime(endTime.value);
  });

document
  .getElementById("autoEndButton")
  .addEventListener("click", async function () {
    // Set the end time to the current time and update the FPS
    await Promise.all([helpers.getCurrentTime("end"), helpers.getFPS()]);

    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");
    startTime.value = helpers.parseTime(startTime.value);
    endTime.value = helpers.parseTime(endTime.value);
  });

document
  .getElementById("autoFrameRateButton")
  .addEventListener("click", async function () {
    await helpers.getFPS();

    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");
    startTime.value = helpers.parseTime(startTime.value);
    endTime.value = helpers.parseTime(endTime.value);
  });

// Event listener for the toggle stats button
document
  .getElementById("hideStatsButton")
  .addEventListener("click", function () {
    const toggled = this.matches(".pressed");
    helpers.toggleHideStatsButton(toggled);
  });

// Event listener for the go to time buttons
document
  .getElementById("jumpToEndTimeButton")
  .addEventListener("click", async () => {
    // Get the end time input element
    const endTime = document.getElementById("endTime");

    // Try to parse the input as a float
    let time;
    try {
      time = parseFloat(endTime.value);
    } catch {
      // Show a place holder error message (just in case the checkValues fails)
      helpers.showError(endTime, "Invalid input");

      // Check the values
      helpers.checkValues();
    }
    // Go to the specified time
    await helpers.jumpToTime(time);
  });

document
  .getElementById("jumpToStartTimeButton")
  .addEventListener("click", async () => {
    // Get the start time input element
    const startTime = document.getElementById("startTime");

    // Try to parse the input as a float
    let time;
    try {
      time = parseFloat(startTime.value);
    } catch {
      // Show a place holder error message (just in case the checkValues fails)
      helpers.showError(startTime, "Invalid input");

      // Check the values
      helpers.checkValues();
    }
    // Go to the specified time
    await helpers.jumpToTime(time);
  });

// Event listener for the calculate button
document
  .getElementById("calculateButton")
  .addEventListener("click", function () {
    // Compute the final time
    helpers.compute();
    helpers.savePopupState(); // Save the state after calculation
  });

// Event listener for the copy button
document.getElementById("copyButton").addEventListener("click", function () {
  const resultMessage = document.getElementById("resultMessage").textContent;
  navigator.clipboard
    .writeText(resultMessage)
    .then(() => {
      alert("Result copied to clipboard!");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
});

// Event listeners for the step frames buttons
document
  .getElementById("backwardsButton")
  .addEventListener("click", async () => {
    try {
      const response = await helpers.getFPS(true, false);
      const frames = document.getElementById("stepFramesValue").value;
      const negativeFrames = -frames;
      helpers.stepFrames(negativeFrames, response.fps);
    } catch (error) {
      console.error("Error fetching FPS:", error);
    }
  });

// Event listeners for the step frames buttons
document
  .getElementById("forwardsButton")
  .addEventListener("click", async () => {
    try {
      const response = await helpers.getFPS(true, false);
      const frames = document.getElementById("stepFramesValue").value;
      helpers.stepFrames(frames, response.fps);
    } catch (error) {
      console.error("Error fetching FPS:", error);
    }
  });

// Event listener for the play/pause button
document.getElementById("playButton").addEventListener("click", async () => {
  const videoState = await helpers.getVideoState(); // true: playing, false: paused
  helpers.pauseVideo(videoState.state);

  document.getElementById("playButtonIcon").src = videoState.state
    ? "../icons/symbols/play_arrow.svg"
    : "../icons/symbols/pause.svg";
});

// Event listener for the playback speed dropdown menu
document.getElementById("playbackRate").addEventListener("change", function () {
  const value = this.value;
  helpers.setPlaybackRate(value);
  helpers.savePopupState();
});

// Save the popup state when an input field is no longer in focus
const inputs = document.querySelectorAll("input"); // Selects all input elements

// Loop through all input elements and add an event listener
inputs.forEach((input) => {
  input.addEventListener("blur", function () {
    helpers.checkValues();
    helpers.savePopupState();
  });
});

// When the result element is clicked select all the text
document.getElementById("resultMessage").addEventListener("click", function () {
  this.select();
});

// Add an event listener for keydown events
document.addEventListener("keydown", async (event) => {
  // Check if the active element is the body or a specific background element
  const activeElement = document.activeElement;
  if (activeElement.tagName !== "BODY" && activeElement.tagName !== "HTML") {
    // Check if the active element is an input or a textarea
    if (
      activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      activeElement.isContentEditable
    ) {
      return; // Exit if an input, textarea, or editable element is focused
    }
  }

  // Defocus the active element if exists
  // Fixes problem where buttons activate when EG. space is pressed
  if (document.activeElement) {
    document.activeElement.blur();
  }

  switch (event.key) {
    case "ArrowLeft":
      helpers.stepSeconds(-5);
      break;
    case "ArrowRight":
      helpers.stepSeconds(5);
      break;
    case "j":
    case "J":
      helpers.stepSeconds(-10);
      break;
    case "l":
    case "L":
      helpers.stepSeconds(10);
      break;
    case ",":
    case ".":
      const fpsRequest = await helpers.getFPS(true, false);
      const step = event.key === "," ? -1 : 1;
      helpers.stepFrames(step, fpsRequest.fps);
      break;
    case " ": // Space
      const videoState = await helpers.getVideoState(); // true: playing, false: paused
      helpers.pauseVideo(videoState.state);

      document.getElementById("playButtonIcon").src = videoState.state
        ? "../icons/symbols/play_arrow.svg"
        : "../icons/symbols/pause.svg";
      break;
  }
});

// Load the saved popup state when the popup is opened
document.addEventListener("DOMContentLoaded", async function () {
  await helpers.loadPopupState();
  helpers.setPlaybackRate(document.getElementById("playbackRate").value);
});

// Function to check if the current website is supported
function checkWebsiteSupported(supportedWebsites) {
  // Get the current tab hostname
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let currentTab = tabs[0];
    if (currentTab) {
      const url = new URL(currentTab.url);
      const hostname = url.hostname;

      // Loop through supported websites and check if the current hostname matches
      for (let website of supportedWebsites) {
        // Check if the current hostname ends with the supported website
        if (hostname.endsWith(website)) {
          return true; // The website is supported
        }
      }
      window.open("not_supported.html", "_self");
      return false; // The website is not supported
    }
  });
}

// Check if the site we are in is supported
const supportedWebsites = ["youtube.com"];
checkWebsiteSupported(supportedWebsites);
