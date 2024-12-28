'use client'

import {useState} from "react";

interface HeaderProps {
    currentSessionId: string | null
}

export default function Header({ currentSessionId }: HeaderProps) {
    return (
        <header className="bg-gray-800 text-white border-b px-6 py-4">
            <h1 className="text-2xl font-semibold">
                Toni's AI Switcher
                <span className="ml-2 text-sm text-white">
                    {currentSessionId ? `Session: ${currentSessionId}` : 'Select or create a session'}
                </span>
            </h1>
        </header>
    )
}
