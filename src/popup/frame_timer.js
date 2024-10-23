import * as helpers from "./helpers.js";

// Event listeners for the auto buttons
document
  .getElementById("autoStartBtn")
  .addEventListener("click", async function () {
    // Set the start time to the current time
    await helpers.requestCurrentTime("start");

    // Update the FPS
    await helpers.requestFPS();

    // Format the time values
    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");
    startTime.value = helpers.parseTime(startTime.value);
    endTime.value = helpers.parseTime(endTime.value);
  });

document
  .getElementById("autoEndBtn")
  .addEventListener("click", async function () {
    // Set the end time to the current time
    await helpers.requestCurrentTime("end");

    // Update the FPS
    await helpers.requestFPS();

    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");
    startTime.value = helpers.parseTime(startTime.value);
    endTime.value = helpers.parseTime(endTime.value);
  });

document
  .getElementById("autoFrameRateBtn")
  .addEventListener("click", async function () {
    await helpers.requestFPS();

    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");
    startTime.value = helpers.parseTime(startTime.value);
    endTime.value = helpers.parseTime(endTime.value);
  });

// Event listener for the calculate button
document.getElementById("calculateBtn").addEventListener("click", function () {
  // Compute the final time
  helpers.compute();
  helpers.savePopupState(); // Save the state after calculation
});

// Event listener for the copy button
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

// Event listeners for the step frames buttons
document
  .getElementById("backwardsButton")
  .addEventListener("click", async () => {
    try {
      const response = await helpers.requestFPS(true, false);
      const frames = document.getElementById("stepFramesValue").value;
      const negativeFrames = -frames;
      helpers.requestStepFrames(negativeFrames, response.fps);
    } catch (error) {
      console.error("Error fetching FPS:", error);
    }
  });

// Event listeners for the step frames buttons
document
  .getElementById("forwardsButton")
  .addEventListener("click", async () => {
    try {
      const response = await helpers.requestFPS(true, false);
      const frames = document.getElementById("stepFramesValue").value;
      helpers.requestStepFrames(frames, response.fps);
    } catch (error) {
      console.error("Error fetching FPS:", error);
    }
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

// Load the saved popup state when the popup is opened
document.addEventListener("DOMContentLoaded", function () {
  helpers.loadPopupState();
});
