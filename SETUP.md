# Setup Instructions for Gemini CLI

## Quick Setup

1. **Build the project** (already done):
   ```bash
   npm install
   npm run build
   ```

2. **Add to your gemini-cli config**:
   
   **Option A: Using npx (recommended)**:
   ```json
   {
     "mcpServers": {
       "node-terminal-mcp": {
         "command": "npx",
         "args": ["@hazzel-cn/node-terminal-mcp"],
         "env": {}
       }
     }
   }
   ```

   **Option B: Using direct path**:
   ```json
   {
     "mcpServers": {
       "node-terminal-mcp": {
         "command": "node",
         "args": ["/Users/henry/Desktop/Projects/node-terminal-mcp/dist/index.js"],
         "env": {}
       }
     }
   }
   ```

   **Important**: For Option B, update the path to match your actual project location.

3. **Test the server**:
   ```bash
   # Test with npx (recommended)
   npx @hazzel-cn/node-terminal-mcp
   
   # Or test with direct path
   node /Users/henry/Desktop/Projects/node-terminal-mcp/dist/index.js
   ```

## Available MCP Tools

Once configured, you'll have access to these tools in Gemini CLI:

- **`create_terminal`**: Create persistent terminal sessions
- **`write_to_terminal`**: Send commands/text to terminals  
- **`send_key_to_terminal`**: Send special keys (enter, ctrl+c, etc.)
- **`read_from_terminal`**: Read terminal output (CRITICAL - use after every command)
- **`resize_terminal`**: Adjust terminal dimensions
- **`list_terminals`**: See all active sessions
- **`close_terminal`**: Close terminal sessions

## Usage Example

1. Create a terminal: `create_terminal` with sessionId "main"
2. Send a command: `write_to_terminal` with input "ls -la"  
3. **Always read output**: `read_from_terminal` to see results
4. Continue with more commands as needed

## Troubleshooting

- **Path issues**: Make sure the path in your config matches your actual project location
- **Permissions**: Ensure the built files are executable
- **Dependencies**: Run `npm install` if you get module errors
- **Build**: Run `npm run build` if you make changes to the source code

## Development

- **Watch mode**: `npm run dev` for automatic rebuilding
- **Clean build**: `npm run clean && npm run build`
- **Logs**: Check console output for any server errors
