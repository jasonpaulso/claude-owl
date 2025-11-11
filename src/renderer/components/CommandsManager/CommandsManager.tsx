import React, { useState, useMemo } from 'react';
import { useCommands } from '../../hooks/useCommands';
import type { CommandWithMetadata, CommandFrontmatter } from '@/shared/types/command.types';
import './CommandsManager.css';

export const CommandsManager: React.FC = () => {
  const { commands, loading, error, refetch, createCommand, updateCommand, deleteCommand } =
    useCommands();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<CommandWithMetadata | null>(null);
  const [editingCommand, setEditingCommand] = useState<CommandWithMetadata | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<'all' | 'user' | 'project' | 'plugin'>(
    'all'
  );

  const handleCreateCommand = () => {
    setEditingCommand(null);
    setShowCreateModal(true);
  };

  const handleEditCommand = (command: CommandWithMetadata) => {
    setEditingCommand(command);
    setShowCreateModal(true);
    setSelectedCommand(null);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingCommand(null);
  };

  const handleViewCommand = (command: CommandWithMetadata) => {
    setSelectedCommand(command);
  };

  const handleCloseDetail = () => {
    setSelectedCommand(null);
  };

  const handleDeleteCommand = async (command: CommandWithMetadata) => {
    if (!confirm(`Are you sure you want to delete the command "/${command.name}"?`)) {
      return;
    }

    // Plugin commands cannot be deleted
    if (command.location === 'plugin' || command.location === 'mcp') {
      alert('Plugin and MCP commands cannot be deleted.');
      return;
    }

    const result = await deleteCommand(command.filePath, command.location as 'user' | 'project');
    if (result.success) {
      setSelectedCommand(null);
    } else {
      alert(`Failed to delete command: ${result.error}`);
    }
  };

  // Filter commands based on search query and location filter
  const filteredCommands = useMemo(() => {
    let filtered = commands;

    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(cmd => cmd.location === locationFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        cmd =>
          cmd.name.toLowerCase().includes(query) ||
          cmd.frontmatter.description?.toLowerCase().includes(query) ||
          cmd.content.toLowerCase().includes(query) ||
          cmd.namespace?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [commands, searchQuery, locationFilter]);

  if (loading) {
    return (
      <div className="commands-manager" data-testid="commands-manager">
        <div className="commands-header">
          <h1>Slash Commands</h1>
        </div>
        <div className="commands-loading">
          <p>Loading commands...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="commands-manager" data-testid="commands-manager">
        <div className="commands-header">
          <h1>Slash Commands</h1>
        </div>
        <div className="commands-error">
          <p className="error-message">Error: {error}</p>
          <button onClick={refetch} className="btn-retry">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="commands-manager" data-testid="commands-manager">
      <div className="commands-header">
        <div>
          <h1>Slash Commands</h1>
          <p className="header-description">
            Custom slash commands that extend Claude Code functionality
          </p>
        </div>
        <button
          onClick={handleCreateCommand}
          className="btn-create"
          data-testid="create-command-btn"
        >
          + Create Command
        </button>
      </div>

      {commands.length > 0 && (
        <div className="commands-filters">
          <div className="commands-search">
            <input
              type="text"
              placeholder="Search commands by name, description, or namespace..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="search-clear"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <div className="location-filter">
            <label htmlFor="location-filter">Location:</label>
            <select
              id="location-filter"
              value={locationFilter}
              onChange={e =>
                setLocationFilter(e.target.value as 'all' | 'user' | 'project' | 'plugin')
              }
              className="filter-select"
            >
              <option value="all">All ({commands.length})</option>
              <option value="user">
                User ({commands.filter(c => c.location === 'user').length})
              </option>
              <option value="project">
                Project ({commands.filter(c => c.location === 'project').length})
              </option>
              <option value="plugin">
                Plugin ({commands.filter(c => c.location === 'plugin').length})
              </option>
            </select>
          </div>
        </div>
      )}

      <div className="commands-content">
        {commands.length === 0 ? (
          <div className="commands-empty">
            <div className="empty-icon">⌘</div>
            <h3>No Commands Yet</h3>
            <p>
              Create custom slash commands to streamline your Claude Code workflow with reusable
              prompts and automations.
            </p>
            <button onClick={handleCreateCommand} className="btn-create-empty">
              Create Your First Command
            </button>
          </div>
        ) : filteredCommands.length === 0 ? (
          <div className="commands-empty">
            <div className="empty-icon">🔍</div>
            <h3>No Commands Found</h3>
            <p>
              No commands match your search criteria
              {searchQuery && ` "${searchQuery}"`}
              {locationFilter !== 'all' && ` in ${locationFilter} location`}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setLocationFilter('all');
              }}
              className="btn-create-empty"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="commands-grid">
            {filteredCommands.map(command => (
              <CommandCard
                key={`${command.location}-${command.filePath}`}
                command={command}
                onView={handleViewCommand}
                onEdit={handleEditCommand}
                onDelete={handleDeleteCommand}
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CommandEditModal
          command={editingCommand}
          onClose={handleCloseModal}
          onCreate={createCommand}
          onUpdate={updateCommand}
        />
      )}

      {selectedCommand && (
        <CommandDetailModal
          command={selectedCommand}
          onClose={handleCloseDetail}
          onEdit={handleEditCommand}
          onDelete={handleDeleteCommand}
        />
      )}
    </div>
  );
};

interface CommandCardProps {
  command: CommandWithMetadata;
  onView: (command: CommandWithMetadata) => void;
  onEdit: (command: CommandWithMetadata) => void;
  onDelete: (command: CommandWithMetadata) => void;
}

const CommandCard: React.FC<CommandCardProps> = ({ command, onView, onEdit, onDelete }) => {
  const locationBadge =
    command.location === 'user'
      ? 'User'
      : command.location === 'project'
        ? 'Project'
        : command.location === 'mcp'
          ? 'MCP'
          : 'Plugin';
  const locationClass = `location-badge location-${command.location}`;
  const canEdit = command.location !== 'plugin' && command.location !== 'mcp';

  const handleCardClick = () => {
    onView(command);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(command);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(command);
  };

  return (
    <div className="command-card" data-testid="command-card" onClick={handleCardClick}>
      <div className="command-card-header">
        <h3 className="command-name">
          /{command.namespace ? `${command.namespace}:` : ''}
          {command.name}
        </h3>
        <span className={locationClass}>{locationBadge}</span>
      </div>

      {command.frontmatter.description && (
        <p className="command-description">{command.frontmatter.description}</p>
      )}

      {command.frontmatter['argument-hint'] && (
        <div className="command-hint">
          <span className="hint-label">Usage:</span>
          <code className="hint-value">
            /{command.name} {command.frontmatter['argument-hint']}
          </code>
        </div>
      )}

      <div className="command-meta">
        {command.frontmatter.model && (
          <div className="command-model">
            <span className="meta-label">Model:</span>
            <span className="meta-value">{command.frontmatter.model}</span>
          </div>
        )}
        {command.frontmatter['allowed-tools'] &&
          command.frontmatter['allowed-tools'].length > 0 && (
            <div className="command-tools">
              <span className="meta-label">Tools:</span>
              <span className="meta-value">
                {command.frontmatter['allowed-tools'].length} configured
              </span>
            </div>
          )}
      </div>

      {canEdit && (
        <div className="command-card-actions">
          <button onClick={handleEdit} className="btn-edit" title="Edit command">
            ✏️ Edit
          </button>
          <button onClick={handleDelete} className="btn-delete" title="Delete command">
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

interface CommandEditModalProps {
  command: CommandWithMetadata | null;
  onClose: () => void;
  onCreate: (options: {
    name: string;
    location: 'user' | 'project';
    namespace?: string;
    frontmatter: CommandFrontmatter;
    content: string;
  }) => Promise<{ success: boolean; filePath?: string; error?: string }>;
  onUpdate: (options: {
    filePath: string;
    frontmatter?: CommandFrontmatter;
    content?: string;
    namespace?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const CommandEditModal: React.FC<CommandEditModalProps> = ({
  command,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEditing = command !== null;
  const [name, setName] = useState(command?.name || '');
  const [description, setDescription] = useState(command?.frontmatter.description || '');
  const [argumentHint, setArgumentHint] = useState(command?.frontmatter['argument-hint'] || '');
  const [content, setContent] = useState(command?.content || '');
  const [location, setLocation] = useState<'user' | 'project'>(
    (command?.location as 'user' | 'project') || 'user'
  );
  const [namespace, setNamespace] = useState(command?.namespace || '');
  const [model, setModel] = useState<'sonnet' | 'opus' | 'haiku' | ''>(
    command?.frontmatter.model || ''
  );
  const [allowedTools, setAllowedTools] = useState(
    command?.frontmatter['allowed-tools']?.join(', ') || ''
  );
  const [disableModelInvocation, setDisableModelInvocation] = useState(
    command?.frontmatter['disable-model-invocation'] || false
  );
  const [saving, setSaving] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle Escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, saving]);

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      setValidationError('Command name is required');
      return;
    }

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
      setValidationError('Command name must be lowercase with hyphens only (e.g., my-command)');
      return;
    }

    if (!content.trim()) {
      setValidationError('Command content is required');
      return;
    }

    setSaving(true);
    setValidationError('');

    const frontmatter: CommandFrontmatter = {};

    if (description.trim()) {
      frontmatter.description = description.trim();
    }

    if (argumentHint.trim()) {
      frontmatter['argument-hint'] = argumentHint.trim();
    }

    if (model) {
      frontmatter.model = model as 'sonnet' | 'opus' | 'haiku';
    }

    if (allowedTools.trim()) {
      frontmatter['allowed-tools'] = allowedTools
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
    }

    if (disableModelInvocation) {
      frontmatter['disable-model-invocation'] = true;
    }

    let result;

    if (isEditing) {
      const updateOptions: {
        filePath: string;
        frontmatter?: CommandFrontmatter;
        content?: string;
        namespace?: string;
      } = {
        filePath: command.filePath,
        frontmatter,
        content: content.trim(),
      };
      const trimmedNamespace = namespace.trim();
      if (trimmedNamespace) updateOptions.namespace = trimmedNamespace;
      result = await onUpdate(updateOptions);
    } else {
      const createOptions: {
        name: string;
        location: 'user' | 'project';
        namespace?: string;
        frontmatter: CommandFrontmatter;
        content: string;
      } = {
        name: name.trim(),
        location,
        frontmatter,
        content: content.trim(),
      };
      const trimmedNamespace = namespace.trim();
      if (trimmedNamespace) createOptions.namespace = trimmedNamespace;
      result = await onCreate(createOptions);
    }

    setSaving(false);

    if (result.success) {
      onClose();
    } else {
      setValidationError(result.error || 'Failed to save command. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content command-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Command' : 'Create New Command'}</h2>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {validationError && <div className="validation-error">{validationError}</div>}

          <div className="form-group">
            <label htmlFor="command-name">
              Command Name <span className="required">*</span>
            </label>
            <div className="input-with-prefix">
              <span className="input-prefix">/</span>
              <input
                id="command-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="my-command"
                disabled={isEditing} // Can't change name when editing
                className="input-field"
              />
            </div>
            <p className="field-help">Lowercase with hyphens only</p>
          </div>

          <div className="form-group">
            <label htmlFor="command-description">Description</label>
            <textarea
              id="command-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What does this command do?"
              rows={2}
              className="input-field"
            />
            <p className="field-help">
              Required for Claude to discover and use this command via SlashCommand tool
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="command-argument-hint">Argument Hint</label>
            <input
              id="command-argument-hint"
              type="text"
              value={argumentHint}
              onChange={e => setArgumentHint(e.target.value)}
              placeholder="[branch-name] [commit-message]"
              className="input-field"
            />
            <p className="field-help">Shown during auto-completion (e.g., [file] [action])</p>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="command-location">
                Location <span className="required">*</span>
              </label>
              <select
                id="command-location"
                value={location}
                onChange={e => setLocation(e.target.value as 'user' | 'project')}
                disabled={isEditing} // Can't change location when editing
                className="input-field"
              >
                <option value="user">User (~/.claude/commands/)</option>
                <option value="project">Project (.claude/commands/)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="command-namespace">Namespace (optional)</label>
              <input
                id="command-namespace"
                type="text"
                value={namespace}
                onChange={e => setNamespace(e.target.value)}
                placeholder="workflows"
                className="input-field"
              />
              <p className="field-help">Subdirectory for organization (e.g., workflows, git)</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="command-model">Model</label>
              <select
                id="command-model"
                value={model}
                onChange={e => setModel(e.target.value as 'sonnet' | 'opus' | 'haiku' | '')}
                className="input-field"
              >
                <option value="">Default</option>
                <option value="sonnet">Sonnet</option>
                <option value="opus">Opus</option>
                <option value="haiku">Haiku</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="command-disable-invocation">
                <input
                  id="command-disable-invocation"
                  type="checkbox"
                  checked={disableModelInvocation}
                  onChange={e => setDisableModelInvocation(e.target.checked)}
                  className="checkbox-input"
                />
                Disable model invocation
              </label>
              <p className="field-help">
                Prevent Claude from invoking this command via SlashCommand tool
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="command-tools">Allowed Tools (optional)</label>
            <input
              id="command-tools"
              type="text"
              value={allowedTools}
              onChange={e => setAllowedTools(e.target.value)}
              placeholder="Read, Write, Bash(git add:*)"
              className="input-field"
            />
            <p className="field-help">
              Comma-separated tool names. Leave empty to inherit from conversation. Required for
              bash execution (!`).
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="command-content">
              Command Content <span className="required">*</span>
            </label>
            <textarea
              id="command-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={
                'Enter the command prompt...\n\nYou can use:\n- $ARGUMENTS for all arguments\n- $1, $2, $3 for individual arguments\n- !`command` for bash execution\n- @path/to/file for file references'
              }
              rows={12}
              className="input-field code-input"
            />
            <p className="field-help">
              Use <code>$ARGUMENTS</code> or <code>$1, $2, $3</code> for arguments,{' '}
              <code>!`cmd`</code> for bash, <code>@file</code> for file references
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary" disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Command'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface CommandDetailModalProps {
  command: CommandWithMetadata;
  onClose: () => void;
  onEdit: (command: CommandWithMetadata) => void;
  onDelete: (command: CommandWithMetadata) => void;
}

const CommandDetailModal: React.FC<CommandDetailModalProps> = ({
  command,
  onClose,
  onEdit,
  onDelete,
}) => {
  const canEdit = command.location !== 'plugin' && command.location !== 'mcp';

  // Handle Escape key to close modal
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleEdit = () => {
    onEdit(command);
  };

  const handleDelete = () => {
    onDelete(command);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content command-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>
              /{command.namespace ? `${command.namespace}:` : ''}
              {command.name}
            </h2>
            <span className={`location-badge location-${command.location}`}>
              {command.location.charAt(0).toUpperCase() + command.location.slice(1)}
            </span>
          </div>
          <button onClick={onClose} className="modal-close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {command.frontmatter.description && (
            <div className="detail-section">
              <h3>Description</h3>
              <p>{command.frontmatter.description}</p>
            </div>
          )}

          {command.frontmatter['argument-hint'] && (
            <div className="detail-section">
              <h3>Usage</h3>
              <code className="code-text">
                /{command.name} {command.frontmatter['argument-hint']}
              </code>
            </div>
          )}

          {command.frontmatter.model && (
            <div className="detail-section">
              <h3>Model</h3>
              <p className="code-text">{command.frontmatter.model}</p>
            </div>
          )}

          {command.frontmatter['allowed-tools'] &&
            command.frontmatter['allowed-tools'].length > 0 && (
              <div className="detail-section">
                <h3>Allowed Tools</h3>
                <div className="tools-list">
                  {command.frontmatter['allowed-tools'].map((tool, idx) => (
                    <span key={idx} className="tool-badge">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {command.frontmatter['disable-model-invocation'] && (
            <div className="detail-section">
              <p className="info-message">
                ⓘ Model invocation disabled - Claude cannot invoke this command programmatically
              </p>
            </div>
          )}

          <div className="detail-section">
            <h3>Command Content</h3>
            <pre className="code-block">{command.content}</pre>
          </div>

          <div className="detail-section detail-meta">
            <div className="meta-item">
              <span className="meta-label">File Path:</span>
              <code className="meta-value">{command.filePath}</code>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last Modified:</span>
              <span className="meta-value">{new Date(command.lastModified).toLocaleString()}</span>
            </div>
            {command.metadata && (
              <div className="meta-item">
                <span className="meta-label">Imported From:</span>
                <span className="meta-value">
                  {command.metadata.source.url || command.metadata.source.type}
                </span>
              </div>
            )}
          </div>
        </div>

        {canEdit && (
          <div className="modal-footer">
            <button onClick={handleDelete} className="btn-danger">
              Delete Command
            </button>
            <button onClick={handleEdit} className="btn-primary">
              Edit Command
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
