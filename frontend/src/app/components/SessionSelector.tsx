"use client"; // Mark this as a Client Component

import React from 'react';

interface SessionSelectorProps {
    sessions: Array<{ id: string; provider: string }>;
    onSelectSession: (sessionId: string) => void;
    onCreateSession: () => void;
}

const SessionSelector: React.FC<SessionSelectorProps> = ({ sessions, onSelectSession, onCreateSession }) => {
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSessionId = e.target.value;
        if (selectedSessionId) {
            onSelectSession(selectedSessionId);
        }
    };

    return (
        <div className="session-selector">
            <button onClick={onCreateSession}>New Session</button>
            <select onChange={handleSelectChange} disabled={sessions.length === 0}>
                <option value="">{sessions.length === 0 ? "No sessions available" : "Select a session"}</option>
                {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                        {session.id} ({session.provider})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SessionSelector;
