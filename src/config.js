// Global app configuration.
// Edit these values before build/deploy.

const APP_CONFIG = {
  version: "2.0",
  versionDateMonthYear: "Nov 2025",
  // "stable" | "dev"
  buildTier: "dev",

  flags: {
    // Show a small "NEW" badge on the TKI item in the sidebar
    showNewBadgeOnTKI: true
  },

  // ---- TKI-specific settings ----
  tki: {
    // If later you confirm the cutoff is 50, just change this to 50
    lvefAbnormalThreshold: 40
  }
};

export default APP_CONFIG;
