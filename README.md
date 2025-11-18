<h1 align="center" style="font-weight: bold;">Windows Alerts for Photon</h1>

<p align="center"><b>Shows a Windows OS notification whenever a coin graduates on Photon Memescope.</b></p>

<p align="center">Decided to open source all my previous Chrome extensions. Use the code anyway you want, just give credit.</p>

<p align="center"><a href="https://chromewebstore.google.com/detail/windows-alerts-for-photon/kpdpcflkjfhpfihpbcalompdbklegppi">🚀 Download from Chrome Web Store</a></p>

<p align="center">
    <img src="https://lh3.googleusercontent.com/vqzHBo99ycM8aLl4O8sJFEavfLWtDyJSqGzm9sSRMfIfVdulYNQYvw6Ttuj8_3zNoih75zUt-3D1X6-t7btPm3ck=s800-w800-h500" width="400px">
    <img src="../.github/example.png" alt="Image Example" width="400px">
</p>

<h2 id="technologies">🚩 Key Features:</h2>

- Shows a Windows OS notification whenever a coin graduates on Photon Memescope.
- Also displays the current price of Solana right on Photon.

Uses the simple <b>Notifications Web API</b>b> to push OS notifications. Browser must be allowed to show notifications in the OS settings (Windows has this disabled by default).

```bash
new Notification(title, options)
```

<h2 id="started">⚙️ Getting started</h2>
<h3>Prerequisites</h3>

This project uses Webpack module bundler

- [NodeJS](https://webpack.js.org/)

```bash
npm install --save-dev webpack
```

To build it run:

```bash
npx webpack
```

Make sure to modify the included webpack.config to point where your /node/modules/ folder is.

<h3>Installation</h3>

- Install from the Chrome Web Store link above
- Or install locally: Manage Extensions -> Enable Developer Mode -> Load Unpacked -> Select the unzipped folder

<h2 id="contribute">⚠️ License</h2>

Released under the GPL-3 license. Use as you please, but give credit where credit is due.
