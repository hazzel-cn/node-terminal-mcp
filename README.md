# node-terminal-mcp

MCP server for terminal/PTY sessions using node-pty and xterm headless, designed for AI agents to interact with terminal environments.

## Features

- **Multiple Terminal Sessions**: Create and manage multiple concurrent terminal sessions
- **AI Agent Integration**: Send commands and read output from terminals programmatically
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Real-time Communication**: Bidirectional communication between AI agents and terminal sessions
- **Session Management**: Create, resize, and close terminal sessions as needed
- **Stdio Compatible**: Optimized for stdio transport with proper error handling and signal management

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

## Development

```bash
npm run dev
```

## Configuration

### Gemini CLI

Add this to your Gemini CLI configuration file (usually `~/.gemini/settings.json`):

```json
{
  "mcpServers": {
    "node-terminal-mcp": {
      "command": "npx",
      "args": ["--yes", "@hazzel-cn/node-terminal-mcp"],
      "env": {}
    }
  }
}
```

### Google ADK

Add this to your Google ADK configuration file:

```json
{
  "mcpServers": {
    "node-terminal-mcp": {
      "command": "npx",
      "args": ["--yes", "@hazzel-cn/node-terminal-mcp"],
      "env": {}
    }
  }
}
```

## Usage

The server provides the following MCP tools:

- `create_terminal`: Create a new terminal session
- `write_to_terminal`: Send input to a terminal session
- `send_key_to_terminal`: Send special keys to a terminal session
- `read_from_terminal`: Read output from a terminal session
- `resize_terminal`: Resize a terminal session
- `list_terminals`: List all active terminal sessions
- `close_terminal`: Close a terminal session

## Architecture

- **TerminalManager**: Manages multiple terminal sessions using node-pty
- **PTY Integration**: Uses node-pty for terminal emulation and process management
- **MCP Server**: Provides standardized interface for AI agents

## Requirements

- Node.js 18+
- Compatible with MCP (Model Context Protocol) clients
