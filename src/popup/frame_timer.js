// Function to show and resize the text area
function autoResize(textarea) {
  textarea.classList.remove("hidden"); // Make the text area visible

  textarea.offsetHeight; // Trigger a reflow

  textarea.style.height = "auto"; // Reset height to auto to shrink first
  textarea.style.height = textarea.scrollHeight + "px"; // Adjust height to fit content
}

// Helper function to save the popup state
function savePopupState() {
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const frameRate = document.getElementById("frameRate").value;

  chrome.storage.local.set(
    {
      startTime,
      endTime,
      frameRate,
    },
    () => {
      console.log("Popup state saved.");
    }
  );
}

// Helper function to load the popup state
function loadPopupState() {
  chrome.storage.local.get(["startTime", "endTime", "frameRate"], (result) => {
    if (result.startTime) {
      document.getElementById("startTime").value = result.startTime;
    }
    if (result.endTime) {
      document.getElementById("endTime").value = result.endTime;
    }
    if (result.frameRate) {
      document.getElementById("frameRate").value = result.frameRate;
    } else {
      document.getElementById("frameRate").value = 60;
    }
    console.log("Popup state loaded.");
  });
}

// Function to request current time from the content script
function requestCurrentTime(isStartTime) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getCurrentTime" },
      (response) => {
        if (response && response.currentTime !== null) {
          if (isStartTime) {
            document.getElementById("startTime").value = response.currentTime;
          } else {
            document.getElementById("endTime").value = response.currentTime;
          }
          savePopupState(); // Save the state after updating the input
        } else {
          console.error("Current time could not be retrieved.");
        }
      }
    );
  });
}

// Function to request FPS from the content script
function requestFPS() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getFPS" }, (response) => {
      if (response && response.fps) {
        document.getElementById("frameRate").value = response.fps;
        savePopupState(); // Save the state after updating the input
      } else {
        console.log("FPS could not be retrieved.");
        showError(
          document.getElementById("autoFrameRateBtn"),
          'Could not retrieve FPS. Did you click on "Stats For Nerds"?'
        );
      }
    });
  });
}

// Function to show error on input field and display an error message
function showError(inputElement, errorMessage) {
  // Set the input border to red
  inputElement.style.border = "2px solid #F73D3D";

  // Get the error message container and show it
  const errorContainer = document.getElementById("errorContainer");
  const errorMessageElement = document.getElementById("errorMessage");

  // Set the error message text
  errorMessageElement.textContent = errorMessage;

  // Display the error section
  errorContainer.classList.remove("hidden");
}

// Function to validate input and show error message
function validateInput(input, inputName) {
  if (input.value.trim() === "") {
    showError(input, `${inputName} cannot be empty!`);
    return false;
  }

  const value = parseFloat(input.value);
  if (isNaN(value)) {
    showError(input, `${inputName} must be a number`);
    return false;
  }

  if (input === document.getElementById("frameRate") && value <= 0) {
    showError(input, "Frame rate cannot be negative or 0!");
    return false;
  }

  input.style.border = "none"; // Clear border style
  return true;
}

// Function to check if values are valid
function checkValues() {
  // Get input elements
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");
  const frameRateInput = document.getElementById("frameRate");

  // Validate each input
  if (!validateInput(startTimeInput, "Start time")) {
    return false;
  }
  if (!validateInput(endTimeInput, "End time")) {
    return false;
  }
  if (!validateInput(frameRateInput, "Frame rate")) {
    return false;
  }

  // If all inputs are valid, hide the error message
  document.getElementById("errorContainer").classList.add("hidden");
  return true;
}

// Function to calculate and format the mod message
function compute(frameRate, startTime, endTime) {
  /*
   * Credits:
   * This function was originally created by slashinifty (https://github.com/slashinfty/yt-frame-timer),
   * but was modified for the needs of this project.
   */

  // Ensure that values are valid
  if (!checkValues()) {
    return;
  }

  // Calculate total frames
  let totalFrames = (endTime - startTime) * frameRate;

  // Calculate seconds, minutes, and hours
  let totalSeconds = Math.floor(totalFrames / frameRate);
  let milliseconds = Math.round((totalFrames % frameRate) * (1000 / frameRate));

  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  seconds = totalSeconds % 60;

  // Format time values
  seconds = seconds < 10 ? "0" + seconds : seconds;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  milliseconds =
    milliseconds < 10
      ? "00" + milliseconds
      : milliseconds < 100
      ? "0" + milliseconds
      : milliseconds;

  // Show the mod message
  let finalTime = `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
  let modMessage = `Mod Message: Time starts at ${startTime.toFixed(
    3
  )}s and ends at ${endTime.toFixed(
    3
  )}s at ${frameRate} fps to get a final time of ${finalTime}.`;
  let credits =
    "Retimed using [frame-timer-extension](https://github.com/PottuGD/frame-timer-extension)";

  console.log("time: ", finalTime);
  console.log(`mod message: ${modMessage} ${credits}`);

  document.getElementById("resultMessage").textContent = modMessage + credits;
  document.getElementById("output").classList.remove("hidden");
  document.getElementById("copyBtn").classList.remove("hidden");

  // Auto resize the text area
  autoResize(document.getElementById("resultMessage"));
}

// Event listeners for the buttons
document.getElementById("autoStartBtn").addEventListener("click", function () {
  requestCurrentTime(true);
});

document.getElementById("autoEndBtn").addEventListener("click", function () {
  requestCurrentTime(false);
});

document
  .getElementById("autoFrameRateBtn")
  .addEventListener("click", function () {
    requestFPS();
  });

document.getElementById("calculateBtn").addEventListener("click", function () {
  // Perform calculation logic
  const startTime = parseFloat(document.getElementById("startTime").value);
  const endTime = parseFloat(document.getElementById("endTime").value);
  const frameRate = parseFloat(document.getElementById("frameRate").value);

  compute(frameRate, startTime, endTime);
  savePopupState(); // Save the state after calculation
});

document.getElementById("copyBtn").addEventListener("click", function () {
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

// Load the saved popup state when the popup is opened
document.addEventListener("DOMContentLoaded", loadPopupState);
