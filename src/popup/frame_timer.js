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
          if (isStartTime) {
            showError(
              document.getElementById("autoStartBtn"),
              "Could not retrieve current time."
            );
          } else {
            showError(
              document.getElementById("autoEndBtn"),
              "Could not retrieve current time."
            );
          }
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
  // Ensure that values are valid
  if (!checkValues()) {
    return;
  }

  // Round to the nearest frame
  const startFrame = Math.floor(startTime * frameRate) / frameRate;
  const endFrame = Math.floor(endTime * frameRate) / frameRate;

  // Convert startTime and endTime to milliseconds
  const startMillis = startFrame * 1000;
  const endMillis = endFrame * 1000;

  // Calculate the time difference in milliseconds
  const timeDifference = endMillis - startMillis;

  // Extract hours, minutes, seconds, and milliseconds
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  const milliseconds = Math.floor(timeDifference % 1000); // Round milliseconds to avoid precision errors

  // Format startTime and endTime in seconds with 3 decimal places
  const formattedStart = startTime.toFixed(3);
  const formattedEnd = endTime.toFixed(3);

  // Format the time difference as "0h 00m 01s 000ms"
  const finalTime = `${hours}h ${minutes.toString().padStart(2, "0")}m ${seconds
    .toString()
    .padStart(2, "0")}s ${milliseconds.toString().padStart(3, "0")}ms`;

  // Set the mod message
  const modMessage = `Time starts at ${formattedStart}s and ends at ${formattedEnd}s to get a final time of ${finalTime}.`;
  const credits =
    "Retimed using [frame-timer-extension](https://github.com/PottuGD/frame-timer-extension)";

  // Update the DOM elements
  document.getElementById("resultMessage").textContent =
    modMessage + " " + credits;
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
