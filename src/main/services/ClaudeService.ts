import { exec } from 'child_process';
import { promisify } from 'util';
import type {
  MCPAddOptions,
  MCPServer,
  MCPScope,
  MCPCommandResult,
} from '../../shared/types/mcp.types';

const execAsync = promisify(exec);

export interface ClaudeInstallationInfo {
  installed: boolean;
  version: string | null;
  path: string | null;
}

export class ClaudeService {
  /**
   * Check if Claude Code CLI is installed and get its version
   */
  async checkInstallation(): Promise<ClaudeInstallationInfo> {
    try {
      const { stdout, stderr } = await execAsync('which claude');

      if (stderr || !stdout.trim()) {
        return {
          installed: false,
          version: null,
          path: null,
        };
      }

      const claudePath = stdout.trim();

      // Get version
      try {
        const { stdout: versionOutput } = await execAsync('claude --version');
        const version = versionOutput.trim();

        return {
          installed: true,
          version,
          path: claudePath,
        };
      } catch {
        // Claude is installed but version command failed
        return {
          installed: true,
          version: null,
          path: claudePath,
        };
      }
    } catch (error) {
      return {
        installed: false,
        version: null,
        path: null,
      };
    }
  }

  /**
   * Get Claude Code version (assumes it's installed)
   */
  async getVersion(): Promise<string | null> {
    try {
      const { stdout } = await execAsync('claude --version');
      return stdout.trim();
    } catch {
      return null;
    }
  }

  // ========================================================================
  // MCP Server Management Methods
  // ========================================================================

  /**
   * Add a new MCP server via `claude mcp add` command
   */
  async addMCPServer(options: MCPAddOptions): Promise<MCPCommandResult> {
    console.log('[ClaudeService] Adding MCP server:', options.name);

    try {
      const command = this.buildMCPAddCommand(options);
      console.log('[ClaudeService] Executing command:', command);

      const { stdout, stderr } = await execAsync(command);

      // Parse output to determine success
      const output = stdout + stderr;
      const success =
        !stderr.toLowerCase().includes('error') && !output.toLowerCase().includes('failed');

      console.log('[ClaudeService] MCP add result:', { success, output });

      return {
        success,
        message: success ? `Successfully added MCP server: ${options.name}` : output,
        error: success ? undefined : output,
      };
    } catch (error) {
      console.error('[ClaudeService] Failed to add MCP server:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to add MCP server: ${errorMessage}`,
      };
    }
  }

  /**
   * Remove an MCP server via `claude mcp remove` command
   */
  async removeMCPServer(name: string, scope: MCPScope): Promise<MCPCommandResult> {
    console.log('[ClaudeService] Removing MCP server:', { name, scope });

    try {
      const command = `claude mcp remove ${this.escapeArg(name)} --scope ${scope}`;
      console.log('[ClaudeService] Executing command:', command);

      const { stdout, stderr } = await execAsync(command);

      const output = stdout + stderr;
      const success =
        !stderr.toLowerCase().includes('error') && !output.toLowerCase().includes('failed');

      console.log('[ClaudeService] MCP remove result:', { success, output });

      return {
        success,
        message: success ? `Successfully removed MCP server: ${name}` : output,
        error: success ? undefined : output,
      };
    } catch (error) {
      console.error('[ClaudeService] Failed to remove MCP server:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: `Failed to remove MCP server: ${errorMessage}`,
      };
    }
  }

  /**
   * List MCP servers via `claude mcp list` command
   */
  async listMCPServers(scope?: MCPScope): Promise<MCPServer[]> {
    console.log('[ClaudeService] Listing MCP servers, scope:', scope || 'all');

    try {
      // Use JSON format for easier parsing
      const scopeArg = scope ? ` --scope ${scope}` : '';
      const command = `claude mcp list --format json${scopeArg}`;
      console.log('[ClaudeService] Executing command:', command);

      const { stdout, stderr } = await execAsync(command);

      if (stderr && stderr.toLowerCase().includes('error')) {
        console.error('[ClaudeService] Error listing MCP servers:', stderr);
        return [];
      }

      // Parse JSON output
      try {
        const servers = JSON.parse(stdout) as MCPServer[];
        console.log('[ClaudeService] Found MCP servers:', servers.length);
        return servers;
      } catch (parseError) {
        console.error('[ClaudeService] Failed to parse MCP list output:', parseError);
        // Fall back to parsing text output if JSON parsing fails
        return this.parseTextServerList(stdout);
      }
    } catch (error) {
      console.error('[ClaudeService] Failed to list MCP servers:', error);
      return [];
    }
  }

  /**
   * Get details of a specific MCP server via `claude mcp get` command
   */
  async getMCPServer(name: string): Promise<MCPServer | null> {
    console.log('[ClaudeService] Getting MCP server:', name);

    try {
      const command = `claude mcp get ${this.escapeArg(name)} --format json`;
      console.log('[ClaudeService] Executing command:', command);

      const { stdout, stderr } = await execAsync(command);

      if (stderr && stderr.toLowerCase().includes('error')) {
        console.error('[ClaudeService] Error getting MCP server:', stderr);
        return null;
      }

      // Parse JSON output
      try {
        const server = JSON.parse(stdout) as MCPServer;
        console.log('[ClaudeService] Found MCP server:', server.name);
        return server;
      } catch (parseError) {
        console.error('[ClaudeService] Failed to parse MCP get output:', parseError);
        return null;
      }
    } catch (error) {
      console.error('[ClaudeService] Failed to get MCP server:', error);
      return null;
    }
  }

  // ========================================================================
  // Private Helper Methods for MCP
  // ========================================================================

  /**
   * Build the `claude mcp add` command from options
   */
  private buildMCPAddCommand(options: MCPAddOptions): string {
    const parts: string[] = ['claude', 'mcp', 'add', this.escapeArg(options.name)];

    // Add transport and scope
    parts.push('--transport', options.transport);
    parts.push('--scope', options.scope);

    // Add environment variables
    if (options.env && Object.keys(options.env).length > 0) {
      for (const [key, value] of Object.entries(options.env)) {
        parts.push('--env', this.escapeArg(`${key}=${value}`));
      }
    }

    // Add HTTP headers (for HTTP/SSE transports)
    if (options.headers && Object.keys(options.headers).length > 0) {
      for (const [key, value] of Object.entries(options.headers)) {
        parts.push('--header', this.escapeArg(`${key}: ${value}`));
      }
    }

    // Add command and args for stdio transport
    if (options.transport === 'stdio' && options.command) {
      parts.push('--', this.escapeArg(options.command));
      if (options.args && options.args.length > 0) {
        parts.push(...options.args.map(arg => this.escapeArg(arg)));
      }
    }

    // Add URL for HTTP/SSE transports
    if ((options.transport === 'http' || options.transport === 'sse') && options.url) {
      parts.push(this.escapeArg(options.url));
    }

    return parts.join(' ');
  }

  /**
   * Escape shell arguments to prevent command injection
   */
  private escapeArg(arg: string): string {
    // If arg contains special characters, wrap in quotes and escape internal quotes
    if (
      arg.includes(' ') ||
      arg.includes('"') ||
      arg.includes("'") ||
      arg.includes('$') ||
      arg.includes('`') ||
      arg.includes('\\') ||
      arg.includes('&') ||
      arg.includes('|') ||
      arg.includes(';')
    ) {
      // Escape internal double quotes and wrap in double quotes
      return `"${arg.replace(/"/g, '\\"')}"`;
    }
    return arg;
  }

  /**
   * Parse text output from `claude mcp list` as fallback
   * This is a simple parser for cases where JSON format isn't available
   */
  private parseTextServerList(output: string): MCPServer[] {
    console.log('[ClaudeService] Parsing text server list (fallback)');

    const servers: MCPServer[] = [];
    const lines = output.split('\n').filter(line => line.trim());

    // Simple parsing: assume each server is on a separate line
    // Format might be: "server-name (stdio)" or similar
    for (const line of lines) {
      const match = line.match(/^(\S+)\s+\((\w+)\)/);
      if (match) {
        const [, name, transport] = match;
        if (transport === 'stdio' || transport === 'http' || transport === 'sse') {
          servers.push({
            name,
            transport: transport as 'stdio' | 'http' | 'sse',
          });
        }
      }
    }

    return servers;
  }
}
