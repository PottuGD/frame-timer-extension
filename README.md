# frame timer extension

frame-timer-extension is a browser extension that allows you to quickly and accurately calculate the time between 2 frames in a YouTube video. This tool is made for retiming speedruns. The core function that calculates the times is made by [@slashinfty](https://github.com/slashinfty/yt-frame-timer).

**Please report any bugs [here](https://github.com/PottuGD/frame-timer-extension/issues).**

## Installation

The extension can be downloaded for Firefox from the official [Firefox Add-Ons Store](https://addons.mozilla.org/en-US/firefox/addon/frame-timer-extension/).

Chrome users, please check the [installation guide](https://github.com/PottuGD/frame-timer-extension/wiki/Installation-guide).

## Documentation

The documentation for this project can be found [here](https://github.com/PottuGD/frame-timer-extension/wiki).
It includes:

- [Getting Started](https://github.com/PottuGD/frame-timer-extension/wiki/Getting-started)
- [Installation](https://github.com/PottuGD/frame-timer-extension/wiki/Installation-guide)
- [Usage Guide](https://github.com/PottuGD/frame-timer-extension/wiki/Usage-guide)
- [Contributing](https://github.com/PottuGD/frame-timer-extension/wiki/Contributing)
- [Credits](https://github.com/PottuGD/frame-timer-extension/wiki/Credits)

## Building

To package the extension from source:

Packaging documentation for [Firefox](https://extensionworkshop.com/documentation/publish/package-your-extension/)

For Chrome you'll have to visit `chrome://extensions/` and click on `Pack extension`. Then follow the on screen instructions.

**Important:** Change the `manifest.json` to either [Firefox manifest](/manifests/manifest.firefox.json) or to [Chrome manifest](/manifests/manifest.chrome.json), depending on your browser you are packaging for.

## TODO:

- [ ] Implement caching (at least for `requestFPS()`)
- [ ] Save the inputs' state only when input is complete, rather than on every change.
- [ ] Make an `error` css class to clean up `showError()`
- [ ] Clean up `loadPopupState()`
- [ ] Scale UI properly on Chrome

## Credits

The original [yt-frame-timer](https://github.com/slashinfty/yt-frame-timer/) made by [@slashinfty](https://github.com/slashinfty/)
