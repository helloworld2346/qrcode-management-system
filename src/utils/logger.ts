const enabled =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOG === "true";

type LogFn = (...args: unknown[]) => void;
const noop: LogFn = () => {};

/* eslint-disable no-console */
export const logger = {
  log: enabled ? console.log.bind(console) : noop,
  info: enabled ? console.info.bind(console) : noop,
  warn: enabled ? console.warn.bind(console) : noop,
  error: enabled ? console.error.bind(console) : noop,
  debug: enabled ? console.debug.bind(console) : noop,
};
/* eslint-enable no-console */
