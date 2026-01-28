# Debugging Skill

## Purpose

Help AI agents debug issues in the application using the built-in devtools.

## Available Tools

### Devtools Server
- **Health Check**: `curl http://localhost:3001/health`
- **Context**: `curl http://localhost:3001/context` - Get latest logs, errors, state, network
- **Commands**: `curl http://localhost:3001/commands` - List available commands
- **WebSocket**: `ws://localhost:3001` - Live event stream + RPC

### In-Browser Overlay
- Console tab: Live log stream with level badges
- Network tab: Fetch requests with status/timing
- State tab: Current Zustand state snapshot
- Commands tab: Execute registered commands

## Debugging Workflow

1. **Start Dev Environment**
   ```bash
   pnpm dev:full  # Runs vite + assist server concurrently
   ```

2. **Check Context**
   - Query `/context` endpoint to see current state
   - Review console logs, errors, network requests
   - Check Zustand store state

3. **Identify Issues**
   - Look for error patterns in console
   - Check network request failures
   - Verify state mutations

4. **Use Commands**
   - Execute registered commands via WebSocket or overlay
   - Test state changes
   - Trigger actions programmatically

5. **Fix and Verify**
   - Make code changes
   - Verify fixes in devtools
   - Ensure no new errors appear

## ChatGPT Escalation

If debugging becomes complex or requires deeper analysis:

1. Gather all relevant context:
   - Error messages from `/context` endpoint
   - Relevant code snippets
   - State snapshots
   - Network request details

2. Present the issue clearly:
   - What was expected?
   - What actually happened?
   - What debugging steps were taken?
   - What context is available?

3. Request assistance with:
   - Root cause analysis
   - Solution approaches
   - Code review for potential issues

## Common Issues

- **WebSocket not connecting**: Ensure `pnpm assist` is running
- **State not updating**: Check Zustand store subscriptions
- **Network errors**: Verify API endpoints and CORS settings
- **Build errors**: Run `pnpm lint` and check TypeScript errors
