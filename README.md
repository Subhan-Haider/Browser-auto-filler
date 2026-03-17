# ⚡ Bypass Pro

**Bypass Pro** is a high-performance browser extension designed for developers and power users to strip away intrusive login walls, overlays, and content blockers that clutter the web experience.

## 🌟 Features

-   **Automatic De-Clutter**: Intelligently identifies and removes high `z-index` overlays and `fixed` position modals that block page content.
-   **Scroll Restoration**: Automatically re-enables scrolling on websites that attempt to lock the page (e.g., setting `overflow: hidden` on the body).
-   **Precision Zap Mode**: Enter a specialized mode where your cursor becomes a "zapper." Click any element on the page—no matter how nested—to instantly remove it.
-   **Identity Auto-Fill**: Generates a random "throwaway" email (via yopmail), password, and name, and instantly fills them into any open sign-up form on the page.
-   **Verification Bypass**: Force-closes local/client-side popups requesting OTP codes, unlocking the page behind them (Note: server-side verification cannot be bypassed).
-   **Context Menu Integration**: Right-click any annoying element and select "Zap this element" to clean the page on the fly.
-   **Modern Dashboard**: A sleek, glassmorphic UI to toggle features and manage your browsing experience.

## 🛠️ Installation

1.  **Clone or Download** this repository to your local machine.
2.  Open your browser and navigate to the extensions management page:
    -   **Chrome**: `chrome://extensions/`
    -   **Edge**: `edge://extensions/`
    -   **Brave**: `brave://extensions/`
3.  Enable **Developer mode** (usually a toggle in the top right).
4.  Click the **Load unpacked** button.
5.  Select the `browser-bypass-extension` folder.
6.  **Pin** the extension to your toolbar for easy access.

## 🚀 Usage

-   **Automatic**: Most login walls are removed as soon as the page finishes loading.
-   **Manual (Zap)**: Click the "Enter Zap Mode" button in the extension popup. Hover over the element you want to get rid of (it will be highlighted) and click to delete it.
-   **Quick Zap**: Right-click any element and select "Zap this element".
-   **Keyboard Shortcut**: Press `Alt+Shift+Z` (or `Ctrl+Shift+Z`) to enter Zap Mode instantly without opening the popup.

## 📂 Project Structure

-   `manifest.json`: Extension metadata and permissions.
-   `content.js`: The core logic for page cleaning and the Zap tool.
-   `background.js`: Handles context menus and initialization.
-   `popup.html/css/js`: The premium control panel interface.
-   `icon.png`: Custom 3D glassmorphic branding.

---

*Built with ❤️ for a cleaner web.*
