<h1 align="center" style="font-weight: bold;">Windows Alerts for Photon</h1>

<p align="center"><b>Shows a Windows OS notification whenever a coin graduates on Photon Memescope.</b></p>

<p align="center">
    <img src="https://lh3.googleusercontent.com/vqzHBo99ycM8aLl4O8sJFEavfLWtDyJSqGzm9sSRMfIfVdulYNQYvw6Ttuj8_3zNoih75zUt-3D1X6-t7btPm3ck=s800-w800-h500" width="400px">
</p>

<hr>

Decided to open source all my previous Chrome extensions. Use the code anyway you want, just give credit.<br>

<h2 id="releases">💾 Releases</h2>

- <p><a href="https://chromewebstore.google.com/detail/windows-alerts-for-photon/kpdpcflkjfhpfihpbcalompdbklegppi">Download from Chrome Web Store</a></p>
- <a href="https://github.com/dkenno2000/Windows-Alerts-for-Photon/releases/download/Photon/alerts_for_photon-v1.1.zip">Download the latest release from Github</a>

<h2 id="features">🚩 Key Features</h2>

- Shows a Windows OS notification whenever a coin graduates on Photon Memescope.
- Also displays the current price of Solana right on Photon.

Uses the simple <b>Notifications Web API</b> to push OS notifications.

```bash
  new Notification(title, options)
```

Browser must be allowed to show notifications in the OS settings. On my system, Windows had this disabled by default.

<h2 id="started">⚙️ Getting started</h2>
<h3>Prerequisites</h3>

This project uses Webpack module bundler

- [Webpack](https://webpack.js.org/)

```bash
  npm install --save-dev webpack
```

To build it run:

```bash
  npx webpack
```

Make sure to modify the included webpack.config to target 'web':

```bash
  target: "web", // Ensure it's targeting web for a browser environment
```

Change the path to point where your /node/modules/ folder is:
```bash
  modules: [path.resolve("D:/node_modules"), "node_modules"],
```

<h3>Installation</h3>

- Install from the Chrome Web Store: Link above
- Install locally: Manage Extensions -> Enable Developer Mode -> Load Unpacked -> Select the unzipped folder

<h2 id="contribute">⚠️ License</h2>

Released under the GPL-3 license. Use as you please, but give credit where credit is due.
