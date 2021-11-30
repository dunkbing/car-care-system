import { logger, consoleTransport } from 'react-native-logs';

export const log = logger.createLogger({
  transport: __DEV__ ? consoleTransport : undefined,
  severity: __DEV__ ? 'debug' : 'error',
  transportOptions: {
    colors: 'ansi',
  },
  async: true,
  dateFormat: 'local',
  enabled: __DEV__,
});
