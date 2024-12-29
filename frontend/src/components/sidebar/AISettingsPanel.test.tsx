import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import AISettingsPanel from './AISettingsPanel';
import { AISettings } from '@/types';

describe('AISettingsPanel', () => {
  const mockOnSettingsChange = vi.fn();
  const defaultSettings: AISettings = {
    provider: 'DeepSeek',
    temperature: 0.0,
    maxTokens: 3000,
    topP: 1.0,
  };

  beforeEach(() => {
    mockOnSettingsChange.mockClear();
  });

  it('renders all controls with default values', () => {
    render(<AISettingsPanel onSettingsChange={mockOnSettingsChange} />);

    // Check heading
    expect(screen.getByText('AI Settings')).toBeDefined();

    // Check provider dropdown
    const providerSelect = screen.getByLabelText('Provider');
    expect(providerSelect).toEqual('DeepSeek');

    // Check temperature slider
    const temperatureSlider = screen.getByLabelText(/Temperature/);
    expect(temperatureSlider).toStrictEqual('0.1');

    // Check max tokens input
    const maxTokensInput = screen.getByLabelText('Max Tokens');
    expect(maxTokensInput).toStrictEqual(3000);

    // Check top p slider
    const topPSlider = screen.getByLabelText(/Top P/);
    expect(topPSlider).toStrictEqual('1');
  });
});
