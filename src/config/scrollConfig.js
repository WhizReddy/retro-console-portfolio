// Scroll configuration for the intro system
export const defaultScrollConfig = {
  thresholds: {
    introWarning: 50, // Show initial warning
    developerInfo: 250, // Show developer introduction
    monitorGuidance: 400, // Guide to monitor
  },
  timings: {
    overlayDelay: 600, // Delay before showing overlay
    autoHideDelay: 5000, // Auto-hide overlay after this time
    transitionDuration: 300, // Animation transition duration
  },
  messages: {
    warning: "⚠️ Read carefully",
    introduction:
      "Welcome to my retro studio. Scroll slowly & interact with objects to discover my work.",
    monitorGuidance: "👆 Focus on the monitor area to explore my work!",
  },
};

// Validate and merge user config with defaults
export function createScrollConfig(userConfig = {}) {
  const config = {
    thresholds: { ...defaultScrollConfig.thresholds, ...userConfig.thresholds },
    timings: { ...defaultScrollConfig.timings, ...userConfig.timings },
    messages: { ...defaultScrollConfig.messages, ...userConfig.messages },
  };

  // Validate thresholds are in ascending order
  const thresholds = Object.values(config.thresholds);
  for (let i = 1; i < thresholds.length; i++) {
    if (thresholds[i] <= thresholds[i - 1]) {
      console.warn(
        "Scroll thresholds should be in ascending order. Using defaults."
      );
      return defaultScrollConfig;
    }
  }

  // Validate positive values
  if (Object.values(config.timings).some((val) => val < 0)) {
    console.warn("Timing values should be positive. Using defaults.");
    return defaultScrollConfig;
  }

  return config;
}
