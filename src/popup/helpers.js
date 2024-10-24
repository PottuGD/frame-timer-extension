// Variables for caching
let cachedFPS;

// Function to show and resize the text area
function autoResize(textarea) {
  textarea.classList.remove("hidden"); // Make the text area visible

  textarea.offsetHeight; // Trigger a reflow

  textarea.style.height = "auto"; // Reset height to auto to shrink first
  textarea.style.height = textarea.scrollHeight + "px"; // Adjust height to fit content
}

// Function to toggle the hideStats button
function toggleHideStatsButton(toggled) {
  const button = document.getElementById("hideStatsButton");
  document.getElementById("hideStats").checked = toggled;
  toggleStats(toggled);
  if (toggled) {
    button.src = "../icons/symbols/visibility.svg";
    button.classList.remove("pressed");
  } else {
    button.src = "../icons/symbols/visibility_off.svg";
    button.classList.add("pressed");
  }
  savePopupState();
}

// Helper function to save the popup state
function savePopupState() {
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;
  const frameRate = document.getElementById("frameRate").value;
  const stepFramesValue = document.getElementById("stepFramesValue").value;
  const hideStatsChecked = document.getElementById("hideStats").checked;
  const playbackRate = document.getElementById("playbackRate").value;

  chrome.storage.local.set(
    {
      startTime,
      endTime,
      frameRate,
      stepFramesValue,
      hideStatsChecked,
      playbackRate,
    },
    () => {
      console.log("Popup state saved.");
    }
  );
}

// Helper function to load the popup state
async function loadPopupState() {
  chrome.storage.local.get(
    [
      "startTime",
      "endTime",
      "frameRate",
      "stepFramesValue",
      "hideStatsChecked",
      "playbackRate",
    ],
    (result) => {
      // Helper function to set the element value or a default value
      const setValue = (key, elementId, defaultValue) => {
        // Check if the value is valid
        let value;
        if (result[key] === undefined || result[key] === "") {
          // Value is not valid, set it to the default value
          value = defaultValue;
        } else {
          // Value is valid
          value = result[key];
        }
        // Update the DOM
        document.getElementById(elementId).value = value;
      };

      // Set the values
      setValue("startTime", "startTime", "");
      setValue("endTime", "endTime", "");
      setValue("frameRate", "frameRate", 60);
      setValue("stepFramesValue", "stepFramesValue", "");
      setValue("playbackRate", "playbackRate", 1);

      if (result["hideStatsChecked"]) {
        toggleHideStatsButton(result["hideStatsChecked"]);
        toggleStats(result["hideStatsChecked"]);
      }
    }
  );
}

// Function to request current time from the content script
async function getCurrentTime(timeType) {
  try {
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error("Failed to query active tabs."));
        } else {
          resolve(tabs);
        }
      });
    });

    if (tabs.length === 0) {
      throw new Error("No active tabs found.");
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getCurrentTime" },
        (response) => {
          if (response && response.currentTime !== null) {
            resolve(response);
          } else {
            reject(new Error("Could not retrieve current time."));
          }
        }
      );
    });

    if (timeType === "start") {
      document.getElementById("startTime").value = parseTime(
        response.currentTime
      );
    } else if (timeType === "end") {
      document.getElementById("endTime").value = parseTime(
        response.currentTime
      );
    }

    savePopupState();
    return response;
  } catch (error) {
    console.error(
      "Current time could not be retrieved. Try restarting your browser.",
      error
    );
    throw error; // Re-throw error
  }
}

// Function to request FPS from the content script
async function getFPS(isStepFrames = false, shouldSave = true) {
  // Check if the cached FPS exists
  if (cachedFPS !== undefined) {
    console.log("Using cached FPS: ", cachedFPS);
    return new Promise((resolve) => {
      // Update the DOM
      document.getElementById("frameRate").value = cachedFPS;

      // Save the popup if shouldSave is true
      shouldSave && savePopupState();

      // Resolve the Promise
      resolve({ fps: cachedFPS, cached: true });
    });
  }

  // Cached FPS doesn't exist
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getFPS" }, (response) => {
        if (response && response.fps) {
          document.getElementById("frameRate").value = response.fps;

          // Save only if shouldSave is true
          shouldSave && savePopupState();

          // Cache the fps
          cachedFPS = response.fps;

          // Resolve the Promise
          resolve({ fps: response.fps, cached: false });
        } else {
          console.error("FPS could not be retrieved.");
          if (!isStepFrames) {
            showError(
              document.getElementById("autoFrameRateButton"),
              'Could not retrieve FPS. Did you click on "Stats For Nerds"?'
            );
          } else {
            showError(
              document.getElementById("stepFramesValue"),
              'Could not retrieve FPS. Did you click on "Stats For Nerds"?'
            );
          }
          reject(new Error("Could not retrieve FPS."));
        }
      });
    });
  });
}

// Function to request stepping forward a certain amount of FRAMES in the video
async function stepFrames(frames, fps) {
  try {
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error("Failed to query active tabs."));
        } else {
          resolve(tabs);
        }
      });
    });

    if (tabs.length === 0) {
      throw new Error("No active tabs found.");
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "stepFrames",
          frames: frames,
          fps: fps,
        },
        (response) => {
          // Check if we got a valid response
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response && response.status === "completed") {
            resolve(response);
          } else {
            reject(new Error("Could not step frames"));
          }
        }
      );
    });

    return response;
  } catch (error) {
    console.error("Error during stepping frames: ", error);
    throw error; // Re-throw error
  }
}

// Function to request stepping forward a certain amount of SECONDS in the video
async function stepSeconds(seconds) {
  try {
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error("Failed to query active tabs."));
        } else {
          resolve(tabs);
        }
      });
    });

    if (tabs.length === 0) {
      throw new Error("No active tabs found.");
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "stepSeconds",
          seconds: seconds,
        },
        (response) => {
          // Check if we got a valid response
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response && response.status === "completed") {
            resolve(response);
          } else {
            reject(new Error("Could not step seconds"));
          }
        }
      );
    });

    return response;
  } catch (error) {
    console.error("Error during stepping seconds: ", error);
    throw error; // Re-throw error
  }
}

// Function to request going to a specific time in the video
async function jumpToTime(time) {
  try {
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error("Failed to query active tabs."));
        } else {
          resolve(tabs);
        }
      });
    });

    if (tabs.length === 0) {
      throw new Error("No active tabs found.");
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "jumpToTime",
          time: time,
        },
        (response) => {
          // Check if we got a valid response
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response && response.status === "completed") {
            resolve(response);
          } else {
            reject(new Error("Could not go to the specified time"));
          }
        }
      );
    });

    return response;
  } catch (error) {
    console.error("Error during jumpToTime: ", error);
    throw error; // Re-throw error
  }
}

// Function to request the state of the video
async function getVideoState() {
  try {
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error("Failed to query active tabs."));
        } else {
          resolve(tabs);
        }
      });
    });

    if (tabs.length === 0) {
      throw new Error("No active tabs found.");
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "getVideoState",
        },
        (response) => {
          // Check if we got a valid response
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response && response.status === "completed") {
            resolve(response);
          } else {
            reject(new Error("Could not get the video state"));
          }
        }
      );
    });

    return response;
  } catch (error) {
    console.error("Error during the request of video status: ", error);
    throw error; // Re-throw error
  }
}

// Function to request to open/close the "Stats for nerds" panel
async function toggleStats(shouldOpen) {
  try {
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error("Failed to query active tabs."));
        } else {
          resolve(tabs);
        }
      });
    });

    if (tabs.length === 0) {
      throw new Error("No active tabs found.");
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "toggleStats",
          shouldOpen: shouldOpen,
        },
        (response) => {
          // Check if we got a valid response
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response && response.status === "completed") {
            resolve(response);
          } else {
            reject(new Error("Could not toggle the stats"));
          }
        }
      );
    });

    return response;
  } catch (error) {
    console.error("Error during toggleStats: ", error);
    throw error; // Re-throw error
  }
}

// Function to request the pause/unpause of the video
async function pauseVideo(shouldPause) {
  try {
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error("Failed to query active tabs."));
        } else {
          resolve(tabs);
        }
      });
    });

    if (tabs.length === 0) {
      throw new Error("No active tabs found.");
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "pauseVideo",
          shouldPause: shouldPause,
        },
        (response) => {
          // Check if we got a valid response
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response && response.status === "completed") {
            resolve(response);
          } else {
            reject(new Error("Could not pause the video"));
          }
        }
      );
    });

    return response;
  } catch (error) {
    console.error("Error during pausing video: ", error);
    throw error; // Re-throw error
  }
}

// Function to request to set the playback rate of the video
async function setPlaybackRate(playbackRate) {
  try {
    const tabs = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error("Failed to query active tabs."));
        } else {
          resolve(tabs);
        }
      });
    });

    if (tabs.length === 0) {
      throw new Error("No active tabs found.");
    }

    const response = await new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "setPlaybackRate",
          playbackRate: playbackRate,
        },
        (response) => {
          // Check if we got a valid response
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else if (response && response.status === "completed") {
            resolve(response);
          } else {
            reject(new Error("Could not set the playback rate"));
          }
        }
      );
    });

    return response;
  } catch (error) {
    console.error("Error during setPlaybackRate: ", error);
    throw error; // Re-throw error
  }
}

// Function to show error on input field and display an error message
function showError(inputElement, errorMessage) {
  // Set the input border to red
  inputElement.classList.add("error");

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

  input.classList.remove("error"); // Remove the error styling
  return true;
}

// Function to check if values are valid
function checkValues() {
  // Get input elements
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");
  const frameRateInput = document.getElementById("frameRate");

  // Round the value to the nearest frame
  const startFrame = parseTime(startTimeInput.value);
  const endFrame = parseTime(endTimeInput.value);

  // Update DOM
  if (!(startFrame == null || isNaN(startFrame))) {
    startTimeInput.value = startFrame;
  }
  if (!(endFrame == null || isNaN(endFrame))) {
    endTimeInput.value = endFrame;
  }

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

// Function to compute the times
function compute() {
  // Ensure that values are valid
  if (!checkValues()) {
    return;
  }

  // Get the input elements
  const startTimeInput = document.getElementById("startTime");
  const endTimeInput = document.getElementById("endTime");
  const frameRateInput = document.getElementById("frameRate");

  // Get the values of the input elements
  const startTime = parseFloat(startTimeInput.value);
  const endTime = parseFloat(endTimeInput.value);
  const frameRate = parseInt(frameRateInput.value);

  // Round the value to the nearest frame
  const startFrame = roundToFrame(startTime, frameRate);
  const endFrame = roundToFrame(endTime, frameRate);

  // Initiate variables to be in the global scope
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let milliseconds = 0;

  // Calculate frame rate
  let frames = (endFrame - startFrame) * frameRate;
  seconds = Math.floor(frames / frameRate);
  frames = frames % frameRate;
  milliseconds = Math.round((frames / frameRate) * 1000);

  if (milliseconds < 10) {
    milliseconds = "00" + milliseconds;
  } else if (milliseconds < 100) {
    milliseconds = "0" + milliseconds;
  }
  if (seconds >= 60) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
  }
  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
  }

  // Set the mod message
  const finalTime =
    hours.toString() +
    "h " +
    minutes.toString() +
    "m " +
    seconds.toString() +
    "s " +
    milliseconds.toString() +
    "ms";

  const modMessage = `Mod Message: Time starts at ${startFrame.toFixed(
    3
  )} and ends at ${endFrame.toFixed(
    3
  )} at ${frameRate} fps to get a final time of ${finalTime}.`;
  const credits =
    "Retimed using [frame-timer-extension](https://github.com/PottuGD/frame-timer-extension)";

  // Update the DOM elements
  document.getElementById("resultMessage").textContent =
    modMessage + " " + credits;
  document.getElementById("finalTime").textContent = finalTime;
  document.getElementById("output").classList.remove("hidden");
  // document.getElementById("finalTime").classList.remove("hidden");
  // document.getElementById("copyButton").classList.remove("hidden");

  // Auto resize the text area
  autoResize(document.getElementById("resultMessage"));
}

// Function to round the time values to the nearest frame to improve accuracy
function roundToFrame(targetFrameStr, frameRateStr) {
  const targetFrame = parseFloat(targetFrameStr);
  const frameRate = parseInt(frameRateStr);

  // Check if values are valid
  if (
    isNaN(frameRate) ||
    isNaN(targetFrame) ||
    typeof targetFrame !== "number" ||
    typeof frameRate !== "number"
  ) {
    return null;
  }

  // Calculate the frame
  let frameFromObj = (time, fps) => Math.floor(time * fps) / fps; //round to the nearest frame
  let finalFrame = frameFromObj(targetFrame, frameRate);

  return finalFrame;
}

// Function to parse the input JSON and format it
function parseTime(targetFrame) {
  // Get the frame rate from the input element
  const frameRate = document.getElementById("frameRate").value;

  // Parse the debug info JSON from the input element
  let frameFromInputText;
  try {
    frameFromInputText = JSON.parse(targetFrame).lct;
  } catch {
    return roundToFrame(targetFrame, frameRate);
  }

  // Check if the value is a valid
  if (typeof frameFromInputText !== "undefined") {
    // Use the time from the JSON
    return roundToFrame(frameFromInputText, frameRate);
  } else {
    // Use the time from the input element
    return roundToFrame(targetFrame, frameRate);
  }
}

// Export the functions
export {
  toggleHideStatsButton,
  getCurrentTime,
  getFPS,
  stepFrames,
  stepSeconds,
  jumpToTime,
  getVideoState,
  pauseVideo,
  setPlaybackRate,
  toggleStats,
  savePopupState,
  loadPopupState,
  checkValues,
  compute,
  parseTime,
  showError,
};
