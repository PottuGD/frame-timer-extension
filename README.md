<div align="center">
  <a href="/images/logo-original.png">
    <img src="/images/logo-original.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">frame timer extension</h3>

  <p align="center">
    Quickly calculate the time between 2 frames in a youtube video.
    <br />
    <a href="https://github.com/PottuGD/frame-timer-extension/wiki"><strong>Documentation »</strong></a>
    <br />
    <br />
    <a href="https://addons.mozilla.org/en-US/firefox/addon/frame-timer-extension/">Firefox Install</a>
    ·
    <a href="https://github.com/PottuGD/frame-timer-extension/wiki/Installation-Guide">Chrome Install</a>
    ·
    <a href="https://github.com/PottuGD/frame-timer-extension/issues">Report Bug</a>
  </p>
</div>

frame-timer-extension is a browser extension that allows you to quickly and accurately calculate the time between 2 frames in a YouTube video. This tool is made for retiming speedruns. The core function that calculates the times is made by [@slashinfty](https://github.com/slashinfty/yt-frame-timer).

**Please report any bugs [here](https://github.com/PottuGD/frame-timer-extension/issues).**

## Installation

The extension can be downloaded for Firefox from the official [Firefox Add-Ons Store](https://addons.mozilla.org/en-US/firefox/addon/frame-timer-extension/).

Chrome users, please check the [installation guide](https://github.com/PottuGD/frame-timer-extension/wiki/Installation-guide). (Chrome extension is submitted for review and will be available soon.)

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

- [ ] Simplify the helper request functions by making a new function to do the chrome.tabs.query and sendMessage
- [ ] Make the tool also work on speedrun.com

## Credits

The original [yt-frame-timer](https://github.com/slashinfty/yt-frame-timer/) made by [@slashinfty](https://github.com/slashinfty/)
