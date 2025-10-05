import { spawn, IPty } from 'node-pty';

export interface TerminalSession {
  id: string;
  pty: IPty;
  outputBuffer: string;
  isActive: boolean;
}

export interface TerminalOptions {
  shell?: string;
  cols?: number;
  rows?: number;
}

export class TerminalManager {
  private sessions: Map<string, TerminalSession> = new Map();

  async createSession(sessionId: string, options: TerminalOptions = {}): Promise<void> {
    if (this.sessions.has(sessionId)) {
      throw new Error(`Terminal session '${sessionId}' already exists`);
    }

    const {
      shell = process.env.SHELL || '/bin/bash',
      cols = 80,
      rows = 24,
    } = options;

    // Create PTY process
    const pty = spawn(shell, [], {
      name: 'xterm-color',
      cols,
      rows,
      cwd: process.cwd(),
      env: process.env,
    });

    // Handle PTY exit
    pty.onExit((e: { exitCode: number; signal?: number }) => {
      // Use process.stderr.write for stdio compatibility
      process.stderr.write(`Terminal session '${sessionId}' exited with code ${e.exitCode}, signal: ${e.signal}\n`);
      this.sessions.delete(sessionId);
    });

    // Create session object
    const session: TerminalSession = {
      id: sessionId,
      pty,
      outputBuffer: '',
      isActive: true,
    };

    // Capture terminal output for reading
    pty.onData((data: string) => {
      session.outputBuffer += data;
    });

    this.sessions.set(sessionId, session);
  }

  async writeToSession(sessionId: string, input: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Terminal session '${sessionId}' not found`);
    }

    if (!session.isActive) {
      throw new Error(`Terminal session '${sessionId}' is not active`);
    }

    session.pty.write(input);
  }

  async sendKeyToSession(sessionId: string, key: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Terminal session '${sessionId}' not found`);
    }

    if (!session.isActive) {
      throw new Error(`Terminal session '${sessionId}' is not active`);
    }

    // Map special keys to their corresponding escape sequences
    const keyMap: { [key: string]: string } = {
      'enter': '\r',
      'return': '\r',
      'tab': '\t',
      'backspace': '\b',
      'delete': '\u007F',
      'escape': '\u001B',
      'esc': '\u001B',
      'up': '\u001B[A',
      'down': '\u001B[B',
      'right': '\u001B[C',
      'left': '\u001B[D',
      'home': '\u001B[H',
      'end': '\u001B[F',
      'pageup': '\u001B[5~',
      'pagedown': '\u001B[6~',
      'ctrl+c': '\u0003',
      'ctrl+d': '\u0004',
      'ctrl+z': '\u001A',
      'ctrl+l': '\u000C',
      'ctrl+a': '\u0001',
      'ctrl+e': '\u0005',
      'ctrl+k': '\u000B',
      'ctrl+u': '\u0015',
      'ctrl+w': '\u0017',
      'ctrl+r': '\u0012',
      'ctrl+s': '\u0013',
      'ctrl+q': '\u0011',
      'space': ' ',
      'f1': '\u001BOP',
      'f2': '\u001BOQ',
      'f3': '\u001BOR',
      'f4': '\u001BOS',
      'f5': '\u001B[15~',
      'f6': '\u001B[17~',
      'f7': '\u001B[18~',
      'f8': '\u001B[19~',
      'f9': '\u001B[20~',
      'f10': '\u001B[21~',
      'f11': '\u001B[23~',
      'f12': '\u001B[24~',
    };

    const keySequence = keyMap[key.toLowerCase()];
    if (keySequence) {
      session.pty.write(keySequence);
    } else {
      // If it's not a special key, treat it as a regular character
      session.pty.write(key);
    }
  }

  async readFromSession(sessionId: string): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Terminal session '${sessionId}' not found`);
    }

    if (!session.isActive) {
      throw new Error(`Terminal session '${sessionId}' is not active`);
    }

    // Return the current output buffer and clear it
    const output = session.outputBuffer;
    session.outputBuffer = '';
    return output;
  }

  async resizeSession(sessionId: string, cols: number, rows: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Terminal session '${sessionId}' not found`);
    }

    if (!session.isActive) {
      throw new Error(`Terminal session '${sessionId}' is not active`);
    }

    session.pty.resize(cols, rows);
  }

  listSessions(): string[] {
    return Array.from(this.sessions.keys());
  }

  async closeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Terminal session '${sessionId}' not found`);
    }

    session.isActive = false;
    session.pty.kill();
    this.sessions.delete(sessionId);
  }

  async closeAllSessions(): Promise<void> {
    const sessionIds = Array.from(this.sessions.keys());
    await Promise.all(sessionIds.map(id => this.closeSession(id)));
  }

  getSession(sessionId: string): TerminalSession | undefined {
    return this.sessions.get(sessionId);
  }

  getSessionCount(): number {
    return this.sessions.size;
  }
}
