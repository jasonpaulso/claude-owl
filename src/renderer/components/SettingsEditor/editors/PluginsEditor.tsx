import React, { useState } from 'react';
import { Input } from '@/renderer/components/ui/input';
import { Button } from '@/renderer/components/ui/button';
import { Label } from '@/renderer/components/ui/label';
import { Checkbox } from '@/renderer/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/renderer/components/ui/select';
import { X, Plus, Package } from 'lucide-react';

interface PluginsEditorProps {
  enabledPlugins: Record<string, boolean>;
  extraKnownMarketplaces: Array<{
    name: string;
    type: 'github' | 'git' | 'directory';
    repo?: string;
    url?: string;
    path?: string;
  }>;
  updateEnabledPlugins: (plugins: Record<string, boolean>) => void;
  updateMarketplaces: (
    marketplaces: Array<{
      name: string;
      type: 'github' | 'git' | 'directory';
      repo?: string;
      url?: string;
      path?: string;
    }>
  ) => void;
  readOnly?: boolean;
}

type MarketplaceType = 'github' | 'git' | 'directory';

export const PluginsEditor: React.FC<PluginsEditorProps> = ({
  enabledPlugins,
  extraKnownMarketplaces,
  updateEnabledPlugins,
  updateMarketplaces,
  readOnly = false,
}) => {
  const [newMarketplaceName, setNewMarketplaceName] = useState('');
  const [newMarketplaceType, setNewMarketplaceType] = useState<MarketplaceType>('github');
  const [newMarketplaceRepo, setNewMarketplaceRepo] = useState('');
  const [newMarketplaceUrl, setNewMarketplaceUrl] = useState('');
  const [newMarketplacePath, setNewMarketplacePath] = useState('');

  const togglePlugin = (pluginId: string, enabled: boolean) => {
    updateEnabledPlugins({
      ...enabledPlugins,
      [pluginId]: enabled,
    });
  };

  const addMarketplace = () => {
    if (!newMarketplaceName.trim()) return;

    const newMarketplace: {
      name: string;
      type: MarketplaceType;
      repo?: string;
      url?: string;
      path?: string;
    } = {
      name: newMarketplaceName.trim(),
      type: newMarketplaceType,
    };

    // Add type-specific fields
    switch (newMarketplaceType) {
      case 'github':
        if (!newMarketplaceRepo.trim()) return;
        newMarketplace.repo = newMarketplaceRepo.trim();
        break;
      case 'git':
        if (!newMarketplaceUrl.trim()) return;
        newMarketplace.url = newMarketplaceUrl.trim();
        break;
      case 'directory':
        if (!newMarketplacePath.trim()) return;
        newMarketplace.path = newMarketplacePath.trim();
        break;
    }

    updateMarketplaces([...extraKnownMarketplaces, newMarketplace]);

    // Reset form
    setNewMarketplaceName('');
    setNewMarketplaceRepo('');
    setNewMarketplaceUrl('');
    setNewMarketplacePath('');
    setNewMarketplaceType('github');
  };

  const removeMarketplace = (index: number) => {
    const marketplaces = [...extraKnownMarketplaces];
    marketplaces.splice(index, 1);
    updateMarketplaces(marketplaces);
  };

  const pluginEntries = Object.entries(enabledPlugins);

  return (
    <div className="space-y-6">
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3">
        <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-neutral-700">
            Plugins extend Claude Code with additional functionality like custom tools, integrations,
            and features. Enable or disable installed plugins, and add custom marketplaces to
            discover more plugins from the community.
          </p>
        </div>
      </div>

      {/* Enabled Plugins Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Enabled Plugins ({pluginEntries.length})</h3>
        <p className="text-sm text-neutral-600">
          Toggle plugins on or off. Disabled plugins won&apos;t load when Claude Code starts.
        </p>

        {pluginEntries.length === 0 ? (
          <p className="text-neutral-500 italic text-sm">
            No plugins installed. Install plugins from marketplaces to extend Claude Code
            functionality.
          </p>
        ) : (
          <div className="space-y-2">
            {pluginEntries.map(([pluginId, enabled]) => (
              <div
                key={pluginId}
                className="flex items-center gap-3 bg-neutral-50 border border-neutral-200 rounded-md p-3"
              >
                <Checkbox
                  id={`plugin-${pluginId}`}
                  checked={enabled}
                  onCheckedChange={checked => togglePlugin(pluginId, checked as boolean)}
                  disabled={readOnly}
                />
                <Label
                  htmlFor={`plugin-${pluginId}`}
                  className="flex-1 text-sm font-mono cursor-pointer"
                >
                  {pluginId}
                </Label>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    enabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Marketplaces Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Custom Marketplaces ({extraKnownMarketplaces.length})
        </h3>
        <p className="text-sm text-neutral-600">
          Add custom plugin marketplaces to discover and install community plugins
        </p>

        {extraKnownMarketplaces.length === 0 ? (
          <p className="text-neutral-500 italic text-sm">No custom marketplaces configured</p>
        ) : (
          <div className="space-y-2">
            {extraKnownMarketplaces.map((marketplace, index) => (
              <div
                key={index}
                className="bg-neutral-50 border border-neutral-200 rounded-md p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-semibold text-neutral-900">
                        {marketplace.name}
                      </code>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {marketplace.type}
                      </span>
                    </div>
                  </div>
                  {!readOnly && (
                    <Button
                      onClick={() => removeMarketplace(index)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                      title="Remove marketplace"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="text-sm text-neutral-600 font-mono bg-white px-2 py-1 rounded border border-neutral-200">
                  {marketplace.type === 'github' && marketplace.repo && `GitHub: ${marketplace.repo}`}
                  {marketplace.type === 'git' && marketplace.url && `Git: ${marketplace.url}`}
                  {marketplace.type === 'directory' && marketplace.path && `Path: ${marketplace.path}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {!readOnly && (
          <div className="space-y-4 bg-neutral-100 border border-neutral-300 rounded-md p-4">
            <h4 className="text-sm font-semibold text-neutral-900">Add Custom Marketplace</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="marketplace-name">Marketplace Name</Label>
                <Input
                  id="marketplace-name"
                  type="text"
                  value={newMarketplaceName}
                  onChange={e => setNewMarketplaceName(e.target.value)}
                  placeholder="my-marketplace"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketplace-type">Marketplace Type</Label>
                <Select
                  value={newMarketplaceType}
                  onValueChange={value => setNewMarketplaceType(value as MarketplaceType)}
                >
                  <SelectTrigger id="marketplace-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="github">GitHub Repository</SelectItem>
                    <SelectItem value="git">Git URL</SelectItem>
                    <SelectItem value="directory">Local Directory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newMarketplaceType === 'github' && (
                <div className="space-y-2">
                  <Label htmlFor="marketplace-repo">GitHub Repository</Label>
                  <Input
                    id="marketplace-repo"
                    type="text"
                    value={newMarketplaceRepo}
                    onChange={e => setNewMarketplaceRepo(e.target.value)}
                    placeholder="owner/repo"
                    className="font-mono"
                  />
                  <p className="text-xs text-neutral-600">
                    Format: <code className="bg-white px-1 rounded">owner/repository</code>
                  </p>
                </div>
              )}

              {newMarketplaceType === 'git' && (
                <div className="space-y-2">
                  <Label htmlFor="marketplace-url">Git URL</Label>
                  <Input
                    id="marketplace-url"
                    type="text"
                    value={newMarketplaceUrl}
                    onChange={e => setNewMarketplaceUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo.git"
                    className="font-mono"
                  />
                  <p className="text-xs text-neutral-600">Full Git repository URL (HTTPS or SSH)</p>
                </div>
              )}

              {newMarketplaceType === 'directory' && (
                <div className="space-y-2">
                  <Label htmlFor="marketplace-path">Directory Path</Label>
                  <Input
                    id="marketplace-path"
                    type="text"
                    value={newMarketplacePath}
                    onChange={e => setNewMarketplacePath(e.target.value)}
                    placeholder="/path/to/marketplace"
                    className="font-mono"
                  />
                  <p className="text-xs text-neutral-600">
                    Absolute path to local plugin marketplace directory
                  </p>
                </div>
              )}

              <Button
                onClick={addMarketplace}
                disabled={
                  !newMarketplaceName.trim() ||
                  (newMarketplaceType === 'github' && !newMarketplaceRepo.trim()) ||
                  (newMarketplaceType === 'git' && !newMarketplaceUrl.trim()) ||
                  (newMarketplaceType === 'directory' && !newMarketplacePath.trim())
                }
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Marketplace
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Plugin Marketplace Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">About Plugin Marketplaces</h3>
        <div className="space-y-3">
          <details className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-neutral-900">
              Marketplace Types
            </summary>
            <ul className="mt-3 space-y-3 text-sm">
              <li>
                <strong className="text-neutral-900">GitHub Repository:</strong> Load plugins from a
                GitHub repository. Specify the repository in{' '}
                <code className="bg-white px-1 py-0.5 rounded">owner/repo</code> format. Claude Code
                will fetch the plugin manifest from the repository.
              </li>
              <li>
                <strong className="text-neutral-900">Git URL:</strong> Load plugins from any Git
                repository using HTTPS or SSH URL. Useful for private repositories or non-GitHub Git
                servers.
              </li>
              <li>
                <strong className="text-neutral-900">Local Directory:</strong> Load plugins from a
                local directory on your machine. Ideal for developing or testing plugins before
                publishing.
              </li>
            </ul>
          </details>

          <details className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-neutral-900">
              Installing Plugins
            </summary>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                After adding a custom marketplace, use the Claude Code CLI to install plugins from
                it:
              </p>
              <pre className="bg-white border border-neutral-200 rounded p-2 text-xs overflow-x-auto">
                {`# List available plugins from marketplace
claude plugin list --marketplace my-marketplace

# Install a plugin
claude plugin install plugin-name --marketplace my-marketplace`}
              </pre>
              <p className="text-xs text-neutral-600 mt-2">
                Installed plugins will appear in the &quot;Enabled Plugins&quot; section above.
              </p>
            </div>
          </details>

          <details className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-neutral-900">
              Creating Plugin Marketplaces
            </summary>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                A plugin marketplace is a Git repository containing a{' '}
                <code className="bg-white px-1 py-0.5 rounded">plugins.json</code> manifest file:
              </p>
              <pre className="bg-white border border-neutral-200 rounded p-2 text-xs overflow-x-auto">
                {`{
  "name": "My Plugin Marketplace",
  "plugins": [
    {
      "id": "my-plugin",
      "name": "My Plugin",
      "version": "1.0.0",
      "description": "Plugin description",
      "source": "https://github.com/owner/plugin-repo"
    }
  ]
}`}
              </pre>
              <p className="text-xs text-neutral-600 mt-2">
                See Claude Code documentation for complete plugin marketplace specifications.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};
