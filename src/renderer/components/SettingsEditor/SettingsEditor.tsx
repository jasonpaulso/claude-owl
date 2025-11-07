import React, { useState } from 'react';
import type { ConfigLevel } from '@/shared/types';
import { SettingsHierarchyTab } from './SettingsHierarchyTab';
import './SettingsEditor.css';

type TabType = 'user' | 'managed';

export const SettingsEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('user');

  const renderTabContent = () => {
    return <SettingsHierarchyTab level={activeTab as ConfigLevel} />;
  };

  return (
    <div className="settings-editor" data-testid="settings-editor">
      <div className="settings-header">
        <div className="header-content">
          <div>
            <h1>Settings</h1>
            <p className="settings-subtitle">
              Configure your global Claude Code preferences, environment variables, and permissions
            </p>
          </div>
          <button
            onClick={() => {
              if (window.electronAPI?.openExternal) {
                window.electronAPI.openExternal('https://code.claude.com/docs/en/settings');
              } else {
                window.open('https://code.claude.com/docs/en/settings', '_blank');
              }
            }}
            className="btn-docs"
          >
            📖 Documentation
          </button>
        </div>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          <span className="tab-icon">👤</span>
          <span className="tab-label">User Settings</span>
          <span className="tab-description">Your global preferences</span>
        </button>
        <button
          className={`tab ${activeTab === 'managed' ? 'active' : ''}`}
          onClick={() => setActiveTab('managed')}
        >
          <span className="tab-icon">🔒</span>
          <span className="tab-label">Managed Settings</span>
          <span className="tab-description">Organization policies (read-only)</span>
        </button>
      </div>

      <div className="settings-content">{renderTabContent()}</div>
    </div>
  );
};
