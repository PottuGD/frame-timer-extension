import * as helpers from "./helpers.js";

// Event listeners for the auto buttons
document.getElementById("autoStartBtn").addEventListener("click", function () {
  helpers.requestCurrentTime(true);
});

document.getElementById("autoEndBtn").addEventListener("click", function () {
  helpers.requestCurrentTime(false);
});

document
  .getElementById("autoFrameRateBtn")
  .addEventListener("click", function () {
    helpers.requestFPS();
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
document.getElementById("backwardsButton").addEventListener("click", () => {
  helpers.requestFPS(true).then((fps) => {
    const frames = document.getElementById("stepFramesValue").value;
    const negativeFrames = -frames;
    helpers.requestStepFrames(negativeFrames, fps);
  });
});

document.getElementById("forwardsButton").addEventListener("click", () => {
  helpers.requestFPS(true).then((fps) => {
    const frames = document.getElementById("stepFramesValue").value;
    helpers.requestStepFrames(frames, fps);
  });
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
document.addEventListener("DOMContentLoaded", helpers.loadPopupState);
