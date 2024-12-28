"use client"; // Mark this as a Client Component

import React from 'react';

interface AISettingsProps {
    api: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    onApiChange: (value: string) => void;
    onTemperatureChange: (value: string) => void;
    onMaxTokensChange: (value: string) => void;
    onTopPChange: (value: string) => void;
}

const AISettings: React.FC<AISettingsProps> = ({
                                                   api,
                                                   temperature,
                                                   maxTokens,
                                                   topP,
                                                   onApiChange,
                                                   onTemperatureChange,
                                                   onMaxTokensChange,
                                                   onTopPChange,
                                               }) => {
    return (
        <div className="ai-settings">
            <label>
                API:
                <select value={api} onChange={(e) => onApiChange(e.target.value)}>
                    <option value="DeepSeek">DeepSeek</option>
                    <option value="ChatGPT">ChatGPT</option>
                    <option value="Claude">Claude</option>
                </select>
            </label>
            <label>
                Temperature:
                <input
                    type="number"
                    value={temperature}
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={(e) => onTemperatureChange(e.target.value)}
                />
            </label>
            <label>
                Max Tokens:
                <input
                    type="number"
                    value={maxTokens}
                    min="1"
                    onChange={(e) => onMaxTokensChange(e.target.value)}
                />
            </label>
            <label>
                Top P:
                <input
                    type="number"
                    value={topP}
                    min="0"
                    max="1"
                    step="0.1"
                    onChange={(e) => onTopPChange(e.target.value)}
                />
            </label>
        </div>
    );
};

export default AISettings;
