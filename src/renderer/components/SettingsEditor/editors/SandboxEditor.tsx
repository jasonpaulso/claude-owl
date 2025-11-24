import React, { useState } from 'react';
import { Input } from '@/renderer/components/ui/input';
import { Button } from '@/renderer/components/ui/button';
import { Label } from '@/renderer/components/ui/label';
import { Checkbox } from '@/renderer/components/ui/checkbox';
import { X, Plus, Shield } from 'lucide-react';
import type { SandboxConfig } from '@/shared/types/config.types';

interface SandboxEditorProps {
  sandbox: SandboxConfig;
  updateSandbox: (sandbox: SandboxConfig) => void;
  readOnly?: boolean;
}

export const SandboxEditor: React.FC<SandboxEditorProps> = ({
  sandbox,
  updateSandbox,
  readOnly = false,
}) => {
  const [newCommand, setNewCommand] = useState('');
  const [newUnixSocket, setNewUnixSocket] = useState('');

  const addExcludedCommand = () => {
    if (!newCommand.trim()) return;

    updateSandbox({
      ...sandbox,
      excludedCommands: [...(sandbox.excludedCommands || []), newCommand.trim()],
    });

    setNewCommand('');
  };

  const removeExcludedCommand = (index: number) => {
    const commands = [...(sandbox.excludedCommands || [])];
    commands.splice(index, 1);
    updateSandbox({
      ...sandbox,
      excludedCommands: commands,
    });
  };

  const addUnixSocket = () => {
    if (!newUnixSocket.trim()) return;

    updateSandbox({
      ...sandbox,
      network: {
        ...(sandbox.network || {}),
        allowUnixSockets: [
          ...(sandbox.network?.allowUnixSockets || []),
          newUnixSocket.trim(),
        ],
      },
    });

    setNewUnixSocket('');
  };

  const removeUnixSocket = (index: number) => {
    const sockets = [...(sandbox.network?.allowUnixSockets || [])];
    sockets.splice(index, 1);
    updateSandbox({
      ...sandbox,
      network: {
        ...(sandbox.network || {}),
        allowUnixSockets: sockets,
      },
    });
  };

  const updateNetworkConfig = (field: string, value: boolean | number | undefined) => {
    updateSandbox({
      ...sandbox,
      network: {
        ...(sandbox.network || {}),
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-neutral-700">
            Sandbox mode isolates Claude Code execution for enhanced security. When enabled, file
            system and network access are restricted. Use excluded commands to allow specific tools
            that need to bypass sandbox restrictions.
          </p>
        </div>
      </div>

      {/* Enable Sandbox */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Checkbox
            id="sandbox-enabled"
            checked={sandbox.enabled || false}
            onCheckedChange={checked =>
              updateSandbox({ ...sandbox, enabled: checked as boolean })
            }
            disabled={readOnly}
          />
          <Label htmlFor="sandbox-enabled" className="text-base font-semibold cursor-pointer">
            Enable Sandbox Mode
          </Label>
        </div>
        <p className="text-sm text-neutral-600 ml-9">
          Restrict file system and network access for enhanced security
        </p>
      </div>

      {/* Additional Sandbox Options */}
      <div className="space-y-4 pl-9">
        <div className="flex items-center gap-3">
          <Checkbox
            id="auto-allow-bash"
            checked={sandbox.autoAllowBashIfSandboxed || false}
            onCheckedChange={checked =>
              updateSandbox({ ...sandbox, autoAllowBashIfSandboxed: checked as boolean })
            }
            disabled={readOnly || !sandbox.enabled}
          />
          <Label
            htmlFor="auto-allow-bash"
            className="text-sm cursor-pointer text-neutral-700"
          >
            Automatically allow bash commands when sandboxed
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="allow-unsandboxed"
            checked={sandbox.allowUnsandboxedCommands || false}
            onCheckedChange={checked =>
              updateSandbox({ ...sandbox, allowUnsandboxedCommands: checked as boolean })
            }
            disabled={readOnly || !sandbox.enabled}
          />
          <Label
            htmlFor="allow-unsandboxed"
            className="text-sm cursor-pointer text-neutral-700"
          >
            Allow commands to run outside sandbox
          </Label>
        </div>

        <div className="flex items-center gap-3">
          <Checkbox
            id="weaker-nested"
            checked={sandbox.enableWeakerNestedSandbox || false}
            onCheckedChange={checked =>
              updateSandbox({ ...sandbox, enableWeakerNestedSandbox: checked as boolean })
            }
            disabled={readOnly || !sandbox.enabled}
          />
          <Label htmlFor="weaker-nested" className="text-sm cursor-pointer text-neutral-700">
            Enable weaker nested sandbox (for compatibility)
          </Label>
        </div>
      </div>

      {/* Excluded Commands */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Excluded Commands ({(sandbox.excludedCommands || []).length})
        </h3>
        <p className="text-sm text-neutral-600">
          Commands that are allowed to bypass sandbox restrictions
        </p>

        {(sandbox.excludedCommands || []).length === 0 ? (
          <p className="text-neutral-500 italic text-sm">No excluded commands configured</p>
        ) : (
          <div className="space-y-2">
            {(sandbox.excludedCommands || []).map((command, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-md p-3"
              >
                <code className="flex-1 text-sm font-mono text-neutral-900">{command}</code>
                {!readOnly && (
                  <Button
                    onClick={() => removeExcludedCommand(index)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    title="Remove command"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {!readOnly && (
          <div className="space-y-2">
            <Label htmlFor="new-command">Add Excluded Command</Label>
            <div className="flex gap-2">
              <Input
                id="new-command"
                type="text"
                value={newCommand}
                onChange={e => setNewCommand(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    addExcludedCommand();
                  }
                }}
                placeholder="npm, git, docker, etc."
                className="flex-1"
              />
              <Button onClick={addExcludedCommand} disabled={!newCommand.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Network Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Network Settings</h3>
        <p className="text-sm text-neutral-600">
          Configure network access restrictions for sandboxed execution
        </p>

        {/* Allow Local Binding */}
        <div className="flex items-center gap-3">
          <Checkbox
            id="allow-local-binding"
            checked={sandbox.network?.allowLocalBinding || false}
            onCheckedChange={checked => updateNetworkConfig('allowLocalBinding', checked as boolean)}
            disabled={readOnly}
          />
          <Label htmlFor="allow-local-binding" className="text-sm cursor-pointer text-neutral-700">
            Allow local network binding
          </Label>
        </div>

        {/* Proxy Ports */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="http-proxy-port">HTTP Proxy Port</Label>
            <Input
              id="http-proxy-port"
              type="number"
              value={sandbox.network?.httpProxyPort || ''}
              onChange={e => {
                const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                updateNetworkConfig('httpProxyPort', value);
              }}
              placeholder="8080"
              readOnly={readOnly}
              min={1}
              max={65535}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="socks-proxy-port">SOCKS Proxy Port</Label>
            <Input
              id="socks-proxy-port"
              type="number"
              value={sandbox.network?.socksProxyPort || ''}
              onChange={e => {
                const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                updateNetworkConfig('socksProxyPort', value);
              }}
              placeholder="1080"
              readOnly={readOnly}
              min={1}
              max={65535}
            />
          </div>
        </div>

        {/* Unix Sockets */}
        <div className="space-y-2">
          <Label>Allowed Unix Sockets ({(sandbox.network?.allowUnixSockets || []).length})</Label>
          <p className="text-xs text-neutral-600">
            Unix socket paths that are allowed when sandboxed
          </p>

          {(sandbox.network?.allowUnixSockets || []).length === 0 ? (
            <p className="text-neutral-500 italic text-sm">No Unix sockets configured</p>
          ) : (
            <div className="space-y-2">
              {(sandbox.network?.allowUnixSockets || []).map((socket, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-md p-3"
                >
                  <code className="flex-1 text-sm font-mono text-neutral-900">{socket}</code>
                  {!readOnly && (
                    <Button
                      onClick={() => removeUnixSocket(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                      title="Remove socket"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {!readOnly && (
            <div className="flex gap-2">
              <Input
                type="text"
                value={newUnixSocket}
                onChange={e => setNewUnixSocket(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    addUnixSocket();
                  }
                }}
                placeholder="/var/run/docker.sock"
                className="flex-1"
              />
              <Button onClick={addUnixSocket} disabled={!newUnixSocket.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
