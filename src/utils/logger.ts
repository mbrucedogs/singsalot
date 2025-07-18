// Global debug setting - can be controlled from settings
let debugEnabled = false;

// Setter function to control debug logging
export const setDebugEnabled = (enabled: boolean) => {
  debugEnabled = enabled;
};

// Getter function to check if debug is enabled
export const isDebugEnabled = () => debugEnabled;

// Main logging function that takes the same arguments as console.log
export const debugLog = (...args: unknown[]) => {
  if (debugEnabled) {
    console.log(...args);
  }
};

// Convenience functions for different log levels
export const debugInfo = (...args: unknown[]) => {
  if (debugEnabled) {
    console.info(...args);
  }
};

export const debugWarn = (...args: unknown[]) => {
  if (debugEnabled) {
    console.warn(...args);
  }
};

export const debugError = (...args: unknown[]) => {
  if (debugEnabled) {
    console.error(...args);
  }
}; 