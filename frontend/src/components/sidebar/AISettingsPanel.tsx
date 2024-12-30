'use client';

import { useSettings } from '@/contexts/SettingsContext';

export default function AISettingsPanel() {
  const { settings, updateSettings } = useSettings();
  return (
    <div className='sidebar-section'>
      <h3 className='mb-6 text-xl font-bold'>AI Settings</h3>

      <div>
        <label htmlFor='provider' className='ai-label'>
          Provider
        </label>
        <select
          id='provider'
          aria-labelledby='provider'
          value={settings.provider}
          onChange={(e) =>
            updateSettings({ ...settings, provider: e.target.value })
          }
          className='ai-input'
        >
          <option value='DeepSeek'>DeepSeek</option>
          <option value='OpenAI'>OpenAI</option>
          <option value='Anthropic'>Claude</option>
        </select>
      </div>

      <div>
        <label htmlFor='temperature' className='ai-label'>
          Temperature ({settings.temperature})
        </label>
        <input
          id='temperature'
          type='range'
          min='0'
          max='1'
          step='0.1'
          value={settings.temperature}
          onChange={(e) =>
            updateSettings({
              ...settings,
              temperature: parseFloat(e.target.value),
            })
          }
          className='ai-slider'
        />
      </div>

      <div>
        <label htmlFor='maxTokens' className='ai-label'>
          Max Tokens
        </label>
        <input
          id='maxTokens'
          type='number'
          value={settings.maxTokens}
          onChange={(e) =>
            updateSettings({ ...settings, maxTokens: parseInt(e.target.value) })
          }
          className='ai-input'
        />
      </div>

      <div>
        <label htmlFor='topP' className='ai-label'>
          Top P ({settings.topP})
        </label>
        <input
          id='topP'
          type='range'
          min='0.1'
          max='1'
          step='0.1'
          value={settings.topP}
          onChange={(e) =>
            updateSettings({ ...settings, topP: parseFloat(e.target.value) })
          }
          className='ai-slider'
        />
      </div>
    </div>
  );
}
