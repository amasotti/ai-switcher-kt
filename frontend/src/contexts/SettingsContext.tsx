import {AISettings} from "@/types";
import {createContext, ReactNode, useContext, useState} from "react";

export const SettingsContext = createContext<{
    settings: AISettings;
    updateSettings: (settings: AISettings) => void;
} | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<AISettings>({
        provider: 'DeepSeek',
        temperature: 0.0,
        maxTokens: 3000,
        topP: 0.1,
    });

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateSettings: setSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
}
