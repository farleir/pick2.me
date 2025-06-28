import React from 'react';
import { SendIcon } from './Icons';

const MessageInput = ({ inputValue, onInputChange, onSendMessage, isProcessing }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isProcessing) {
      onSendMessage();
    }
  };

  return (
    <footer className="bg-slate-800 border-t border-slate-700 p-3 sm:p-4 rounded-b-none sm:rounded-b-xl">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <input
          type="text"
          id="user-message-input" 
          name="user_message"     
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Digite aqui..."
          className="flex-grow p-3 sm:p-3.5 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-700 text-slate-100 placeholder-slate-400 text-sm sm:text-base"
          disabled={isProcessing}
        />
        <button
          onClick={onSendMessage}
          disabled={isProcessing}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 sm:p-3.5 rounded-xl disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg hover:shadow-indigo-500/50"
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <SendIcon />
          )}
        </button>
      </div>
    </footer>
  );
};

export default MessageInput;