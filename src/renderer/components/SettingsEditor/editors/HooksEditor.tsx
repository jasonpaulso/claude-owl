import React, { useState } from 'react';
import { Input } from '@/renderer/components/ui/input';
import { Button } from '@/renderer/components/ui/button';
import { Label } from '@/renderer/components/ui/label';
import { X, Plus, Zap } from 'lucide-react';
import type { HooksConfig } from '@/shared/types/config.types';

interface HooksEditorProps {
  hooks: HooksConfig;
  updateHooks: (hooks: HooksConfig) => void;
  readOnly?: boolean;
}

type HookType = 'PreToolUse' | 'PostToolUse' | 'UserPromptSubmit';

const HOOK_TYPES: { key: HookType; label: string; description: string }[] = [
  {
    key: 'PreToolUse',
    label: 'Pre-Tool Use',
    description: 'Executed before Claude Code uses any tool',
  },
  {
    key: 'PostToolUse',
    label: 'Post-Tool Use',
    description: 'Executed after Claude Code completes tool execution',
  },
  {
    key: 'UserPromptSubmit',
    label: 'User Prompt Submit',
    description: 'Executed when a user submits a prompt',
  },
];

export const HooksEditor: React.FC<HooksEditorProps> = ({
  hooks,
  updateHooks,
  readOnly = false,
}) => {
  const [activeHookType, setActiveHookType] = useState<HookType>('PreToolUse');
  const [newHookName, setNewHookName] = useState('');
  const [newHookScript, setNewHookScript] = useState('');

  const addHook = (hookType: HookType) => {
    if (!newHookName.trim() || !newHookScript.trim()) return;

    updateHooks({
      ...hooks,
      [hookType]: {
        ...(hooks[hookType] || {}),
        [newHookName.trim()]: newHookScript.trim(),
      },
    });

    setNewHookName('');
    setNewHookScript('');
  };

  const updateHook = (hookType: HookType, name: string, script: string) => {
    updateHooks({
      ...hooks,
      [hookType]: {
        ...(hooks[hookType] || {}),
        [name]: script,
      },
    });
  };

  const removeHook = (hookType: HookType, name: string) => {
    const updatedHooks = { ...(hooks[hookType] || {}) };
    delete updatedHooks[name];
    updateHooks({
      ...hooks,
      [hookType]: updatedHooks,
    });
  };

  const renderHookSection = (hookType: HookType, label: string, description: string) => {
    const hookEntries = Object.entries(hooks[hookType] || {});

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-semibold text-neutral-900">{label}</h4>
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
        </div>

        {hookEntries.length === 0 ? (
          <p className="text-neutral-500 italic text-sm">No {label.toLowerCase()} hooks configured</p>
        ) : (
          <div className="space-y-2">
            {hookEntries.map(([name, script]) => (
              <div
                key={name}
                className="bg-neutral-50 border border-neutral-200 rounded-md p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <code className="text-sm font-semibold text-neutral-900 flex-1">{name}</code>
                  {!readOnly && (
                    <Button
                      onClick={() => removeHook(hookType, name)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                      title="Remove hook"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {readOnly ? (
                    <code className="text-sm text-neutral-700 bg-white px-2 py-1 rounded border border-neutral-200 flex-1">
                      {script}
                    </code>
                  ) : (
                    <Input
                      type="text"
                      value={script}
                      onChange={e => updateHook(hookType, name, e.target.value)}
                      className="flex-1 font-mono text-sm"
                      placeholder="./hooks/script.sh"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!readOnly && (
          <div className="space-y-4 bg-neutral-100 border border-neutral-300 rounded-md p-4">
            <h5 className="text-sm font-semibold text-neutral-900">Add New {label} Hook</h5>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`hook-name-${hookType}`}>Hook Name</Label>
                <Input
                  id={`hook-name-${hookType}`}
                  type="text"
                  value={newHookName}
                  onChange={e => setNewHookName(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      document.getElementById(`hook-script-${hookType}`)?.focus();
                    }
                  }}
                  placeholder="my-hook"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`hook-script-${hookType}`}>Script Path</Label>
                <Input
                  id={`hook-script-${hookType}`}
                  type="text"
                  value={newHookScript}
                  onChange={e => setNewHookScript(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      addHook(hookType);
                    }
                  }}
                  placeholder="./hooks/script.sh or /absolute/path/to/script"
                  className="font-mono"
                />
              </div>
              <Button
                onClick={() => addHook(hookType)}
                disabled={!newHookName.trim() || !newHookScript.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Hook
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
        <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-neutral-700">
            Hooks allow you to run custom scripts at specific points in Claude Code&apos;s execution. Use
            hooks to integrate with external tools, log activity, or enforce custom policies. Scripts
            can be bash, Python, Node.js, or any executable.
          </p>
        </div>
      </div>

      {/* Hook Type Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        {HOOK_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveHookType(key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeHookType === key
                ? 'border-primary text-primary'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active Hook Type Content */}
      <div>
        {HOOK_TYPES.map(
          ({ key, label, description }) =>
            activeHookType === key && (
              <div key={key}>{renderHookSection(key, label, description)}</div>
            )
        )}
      </div>

      {/* Hook Execution Order Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Hook Execution Order</h3>
        <div className="space-y-3">
          <details className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-neutral-900">
              Understanding Hook Types
            </summary>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <strong>PreToolUse:</strong> Runs before Claude Code executes any tool (Read, Write,
                Bash, etc.). Useful for logging, permission checks, or modifying environment before
                tool execution.
              </li>
              <li>
                <strong>PostToolUse:</strong> Runs after tool execution completes. Useful for
                cleanup, result logging, or triggering downstream processes based on tool output.
              </li>
              <li>
                <strong>UserPromptSubmit:</strong> Runs when a user submits a new prompt. Useful for
                request logging, analytics, or injecting context before Claude processes the request.
              </li>
            </ul>
          </details>

          <details className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-neutral-900">
              Hook Script Requirements
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                • Scripts must be executable:{' '}
                <code className="bg-white px-1 py-0.5 rounded">chmod +x script.sh</code>
              </li>
              <li>
                • Use relative paths (e.g., <code className="bg-white px-1 py-0.5 rounded">
                  ./hooks/script.sh
                </code>) or absolute paths
              </li>
              <li>
                • Scripts receive hook context via environment variables (e.g.,{' '}
                <code className="bg-white px-1 py-0.5 rounded">HOOK_TYPE</code>,{' '}
                <code className="bg-white px-1 py-0.5 rounded">TOOL_NAME</code>)
              </li>
              <li>
                • Exit code 0 = success, non-zero = failure (may block tool execution for PreToolUse)
              </li>
              <li>
                • Hook output is captured and can be viewed in Claude Code logs
              </li>
            </ul>
          </details>

          <details className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-neutral-900">
              Example Hook Scripts
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-1">
                  Bash Script (./hooks/log-tool-use.sh):
                </p>
                <pre className="bg-white border border-neutral-200 rounded p-2 text-xs overflow-x-auto">
                  {`#!/bin/bash
echo "[$(date)] Tool: $TOOL_NAME" >> /tmp/claude-tools.log`}
                </pre>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-1">
                  Python Script (./hooks/validate.py):
                </p>
                <pre className="bg-white border border-neutral-200 rounded p-2 text-xs overflow-x-auto">
                  {`#!/usr/bin/env python3
import os
import sys

tool_name = os.getenv('TOOL_NAME')
if tool_name in ['Write', 'Edit']:
    print(f"Validating {tool_name} operation...")
    # Add validation logic
    sys.exit(0)  # Allow
else:
    sys.exit(0)  # Allow all other tools`}
                </pre>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
