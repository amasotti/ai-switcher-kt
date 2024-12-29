'use client';

import { useEffect, useState } from 'react';
import { AISettings } from '@/types';

interface AISettingsPanelProps {
  onSettingsChange: (settings: AISettings) => void;
}

export default function AISettingsPanel({
  onSettingsChange,
}: AISettingsPanelProps) {
  const [settings, setSettings] = useState<AISettings>({
    provider: 'DeepSeek',
    temperature: 0.0,
    maxTokens: 3000,
    topP: 1.0,
  });

  useEffect(() => {
    onSettingsChange(settings);
  }, [settings, onSettingsChange]);

  return (
    <div className='sidebar-section'>
      <h3 className='mb-6 text-xl font-bold'>AI Settings</h3>

      <div>
        <label className='ai-label'>Provider</label>
        <select
          value={settings.provider}
          onChange={(e) =>
            setSettings((s) => ({ ...s, provider: e.target.value }))
          }
          className='ai-input'
        >
          <option value='DeepSeek'>DeepSeek</option>
          <option value='OpenAI'>OpenAI</option>
          <option value='Claude'>Claude</option>
        </select>
      </div>

      <div>
        <label className='ai-label'>Temperature ({settings.temperature})</label>
        <input
          type='range'
          min='0'
          max='1'
          step='0.1'
          value={settings.temperature}
          onChange={(e) =>
            setSettings((s) => ({
              ...s,
              temperature: parseFloat(e.target.value),
            }))
          }
          className='ai-slider'
        />
      </div>

      <div>
        <label className='ai-label'>Max Tokens</label>
        <input
          type='number'
          value={settings.maxTokens}
          onChange={(e) =>
            setSettings((s) => ({ ...s, maxTokens: parseInt(e.target.value) }))
          }
          className='ai-input'
        />
      </div>

      <div>
        <label className='ai-label'>Top P ({settings.topP})</label>
        <input
          type='range'
          min='0.1'
          max='1'
          step='0.1'
          value={settings.topP}
          onChange={(e) =>
            setSettings((s) => ({ ...s, topP: parseFloat(e.target.value) }))
          }
          className='ai-slider'
        />
      </div>
    </div>
  );
}
