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
    <a href="https://chromewebstore.google.com/detail/frame-timer/mdmhlahljnlcbigbbeadccddfbkagecf?pli=1">Chrome Install</a>
    ·
    <a href="https://github.com/PottuGD/frame-timer-extension/issues">Report Bug</a>
  </p>
</div>

frame-timer-extension is a browser extension that allows you to quickly and accurately calculate the time between 2 frames in a YouTube video. This tool is made for retiming speedruns. The core function that calculates the times is made by [@slashinfty](https://github.com/slashinfty/yt-frame-timer).

**Please report any bugs [here](https://github.com/PottuGD/frame-timer-extension/issues).**

## Installation

The extension can be downloaded for Firefox from the official [Firefox Add-Ons Store](https://addons.mozilla.org/en-US/firefox/addon/frame-timer-extension/).

For Chrome, it can be downloaded from the [Chrome Web Store guide](https://chromewebstore.google.com/detail/frame-timer/mdmhlahljnlcbigbbeadccddfbkagecf?pli=1).

## Documentation

The documentation for this project can be found [here](https://github.com/PottuGD/frame-timer-extension/wiki).
It includes:

- [Getting Started](https://github.com/PottuGD/frame-timer-extension/wiki/Getting-started)
- [Installation](https://github.com/PottuGD/frame-timer-extension/wiki/Installation-guide)
- [Usage Guide](https://github.com/PottuGD/frame-timer-extension/wiki/Usage-guide)
- [Contributing](https://github.com/PottuGD/frame-timer-extension/wiki/Contributing)
- [Credits](https://github.com/PottuGD/frame-timer-extension/wiki/Credits)

## Packaging

To package the extension from source:

1. Navigate to the folder called `/src`.
2. Replace the contents of the file, `manifest.json`, with those from either [manifest.firefox.json](/manifests/manifest.firefox.json) or [manifest.chrome.json](/manifests/manifest.chrome.json).
3. Zip/archive all the files and folders in the `/src` directory. **Make sure the archiced file has the extension `.zip`.** I recommend [7-Zip](7-zip.org), but you can use any archiving tool of your choice.
4. (optional) Rename the generated `.zip` file.
5. Done.

## TODO:

- [ ] Simplify the helper request functions by making a new function to do the chrome.tabs.query and sendMessage
- [ ] Make the tool also work on speedrun.com

## Credits

The original [yt-frame-timer](https://github.com/slashinfty/yt-frame-timer/) made by [@slashinfty](https://github.com/slashinfty/)

The tooltips are made with [Tippy.js](https://atomiks.github.io/tippyjs/)
