import React from 'react';
import { useTranslation } from 'react-i18next';
import Chat from './Chat';
function StartPage() {
    const {t} = useTranslation();
    
  return (
    <div className="flex h-full">
      {/* Notice Board */}
      <div className="w-2/3 bg-gray-800 p-4">
        <h2 className="text-2xl font-bold text-white mb-4">{t('noticeBoard')}</h2>
        {/* Insert Notice Board Component or Content Here */}
      </div>

      {/* Chat Section */}
      <div className="w-1/3 flex flex-col justify-between bg-gray-900 p-4 border-l border-gray-700">
        <h2 className="text-2xl font-bold text-white ">{t('chat')}</h2>
        <Chat/>
      </div>
    </div>
  );
  }
  
  export default StartPage;