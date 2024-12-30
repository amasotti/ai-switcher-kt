'use client';

import Sidebar from '@/components/Sidebar';
import ChatHistory from '@/components/ChatHistory';
import ChatInput from '@/components/ChatInput';
import { SessionProvider } from '@/contexts/SessionContext';
import {SettingsProvider} from "@/contexts/SettingsContext";
import Header from '@/components/Header';


export default function Home() {
  return (
      <SettingsProvider>
        <SessionProvider>
          <main className='flex h-screen bg-gray-50'>
            <Sidebar />
            <div className='flex flex-1 flex-col'>
              <Header />
              <ChatHistory />
              <ChatInput/>
            </div>
          </main>
        </SessionProvider>
</SettingsProvider>
  );
}
