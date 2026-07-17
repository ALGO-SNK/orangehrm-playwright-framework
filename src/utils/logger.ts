type Metadata = Readonly<Record<string, unknown>>;

function write(level: 'info' | 'warn' | 'error', message: string, metadata: Metadata): void {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata,
  });
  const sink = level === 'error' ? console.error : level === 'warn' ? console.warn : console.info;
  sink(entry);
}

export const logger = {
  info: (message: string, metadata: Metadata = {}): void => write('info', message, metadata),
  warn: (message: string, metadata: Metadata = {}): void => write('warn', message, metadata),
  error: (message: string, metadata: Metadata = {}): void => write('error', message, metadata),
};
