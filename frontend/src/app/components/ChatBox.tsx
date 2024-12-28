"use client"; // Mark this as a Client Component

import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types/session';
import styles from './chatbox.module.css';

interface ChatBoxProps {
    messages: ChatMessage[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={styles.chatBox} ref={chatBoxRef}>
            {messages.map((msg, index) => (
                <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
                    <div className={styles.content}>{msg.content}</div>
                    <div className={styles.timestamp}>{msg.timestamp}</div>
                </div>
            ))}
        </div>
    );
};

export default ChatBox;
