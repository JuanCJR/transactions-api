export abstract class LoggerPort {
  abstract log(message: string): void;
  abstract error(message: string, trace?: string): void;
}
