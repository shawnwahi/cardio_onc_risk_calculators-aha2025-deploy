// Global app configuration.
// Edit these values before build/deploy.

const APP_CONFIG = {
  version: "2.0",
  versionDateMonthYear: "Nov 2025",

  // "stable" | "dev"
  buildTier: "dev",

  // "tki" | "ici"
  defaultCalculator: "tki",

  flags: {
    // Show a small "NEW" badge on the TKI item in the sidebar
    showNewBadgeOnTKI: true
  },

  // ---- TKI-specific settings ----
  tki: {
    // can change cutoff to 50 later, if needed
    lvefAbnormalThreshold: 40
  }
};

export default APP_CONFIG;
