# Privacy Policy for Frame Timer

_Last updated: October 25, 2024_

## 1. Introduction

Your privacy is important. This Privacy Policy outlines the types of information this extension handles and provides transparency about its functionality, including interactions with video content on YouTube and links to external sites.

**Frame Timer does not collect, track, or share any personally identifiable information.**

## 2. Data Collection and Usage

### No Personal Data Collection

Frame Timer does not collect, process, or transmit any personal data or usage statistics outside of your device. The extension functions primarily within your local enviroment.

### Interaction with YouTube videos

To provide video playback features on YouTube, Frame Timer interacts directly with the HTML5 video player on YouTube. This interaction enables the extension to:

- Access non-identifiable video data, such as the current playback time, to support features like automatically setting the start or end times, setting the frame rate automatically, and frame jumps.
- Control video playback (e.g., play, pause, change playback speed, skip forward or backward) based on user input.

These interactions are strictly limited to YouTube's video player and do not involve any access to other page content or data

### Checking the Active Tab URL

Frame Timer checks the current tab's URL to determine whether the active website is supported by Frame Timer or not. If the current tab is not supported, the extension does not interact with or access any information on the page.

### Locally Stored Settings

To offer a smooth experience, Frame Timer saves a limited set of user preferences locally on your browser using the Chrome Storage API. These settings are used to save the state of the extension popup's state.
These values include:

- **Start Time:** The user input used to store the starting frame, which is used to calculate the final time.
- **End Time:** The user input used to store the ending frame, which is used to calculate the final time.
- **Framerate:** Used to accurately calculate the final time and control the ability to skip forward or backward a number of frames.
- **Playback Speed:** Stores the preferred speed of the video playback
- **Frame Jump Value:** Used to store the number of frames to skip forward or backward.
- **"Stats for nerds" Hidden:** Used to store the state of a button to control if the "Stats for nerds" panel is hidden or not

These settings are **non-identifiable**. No information is stored that could personally identify you.

## 3. External Resources

To ensure a good user experience, Frame Timer may retrieve a CSS file from a Content Delivery Network (CDN). While this request does not transmit any personal data from your device, the CDN provider may log basic technical information (e.g. IP address and browser type) as is standard for web requests.

## 4. Links to Third-Party Websites

Frame Timer may include links to third-party websites, such as GitHub or YouTube, for additional resources, documentation, or support. These external sites operate independently of Frame Timer and have their own privacy policies. We recommend reviewing the privacy policies of any third-party sites you visit, as Frame Timer has no control over their content, privacy practices, or data handling.

## 5. Data Storage and Security

All settings saved by Frame Timer are stored locally in your browser via the Chrome Storage API. This data remains on your device and is never transmitted to external servers or third parties by this extension.

## 6. Third-Party Access

Frame Timer does not share or provide access to any data with third parties, as no personally identifiable information is collected or stored by the extension itself. Additionally, Frame Timer does not integrate with third-party analytics or advertising networks.

## 7. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Last updated" date will be revised accordingly. We recommend reviewing this Privacy Policy periodically to stay informed of any updates.

## 8. Contact

If you have any questions or concerns about this Privacy Policy or Frame Timer's data practices, please contact me at [pottu.extensions@gmail.com](pottu.extensions@gmail.com).

**By using Frame Timer, you acknowledge that no identifiable information about you is collected, stored, or shared by the extension itself, except for a standard web request to retrieve styling resources from a CDN. Additionally, please note that the extension may include links to third-party sites that have their own privacy policies.**
