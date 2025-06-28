import React from 'react';
import { BotIcon, UserIcon, ShoppingBagIcon } from './Icons';

// Função auxiliar para renderizar texto formatado
const renderFormattedText = (text) => {
    let correctedText = text.replace(/\[(https?:\/\/[^\]]+)\]\(\1\)/g, '$1');
    let html = correctedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
    html = html.replace(/(https?:\/\/[^\s)]+)/g, (matchedURL) => {
        let href = matchedURL;
        let displayedText = matchedURL;
        let trailingChars = '';
        const punctuationEnd = /[.,!?;:]$/;
        if (punctuationEnd.test(href)) {
            trailingChars = href.slice(-1);
            href = href.slice(0, -1);
        }
        if (href.endsWith(")") && (href.match(/\(/g) || []).length < (href.match(/\)/g) || []).length) {
            href = href.slice(0, -1); 
            trailingChars = ")" + trailingChars; 
        }
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-indigo-300 hover:text-indigo-200 underline break-all">${displayedText}</a>${trailingChars}`;
    });
    html = html.replace(/\n/g, '<br />'); 
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const Message = ({ msg, onActionClick, isProcessingAction }) => {
  const messageContainerClass = `max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-md transition-all duration-300 ${
    msg.sender === 'user'
      ? 'bg-sky-500 text-white rounded-br-lg'
      : msg.isError
      ? 'bg-red-600 text-white rounded-bl-lg'
      : msg.type === 'product_list'
      ? 'bg-slate-700 text-slate-100 rounded-bl-lg w-full'
      : msg.type === 'text_italic'
      ? 'bg-slate-600 text-slate-300 rounded-bl-lg italic'
      : msg.type === 'text_ai_action'
      ? 'bg-teal-600 text-white rounded-bl-lg'
      : 'bg-indigo-500 text-white rounded-bl-lg'
  }`;

  return (
    <div key={msg.id}>
      <div className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        {msg.sender === 'bot' && (
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center mr-2 sm:mr-3 shadow-md">
            <BotIcon />
          </div>
        )}
        <div className={messageContainerClass}>
          {msg.type === 'product_list' ? (
            <div>
              <div className="flex items-center font-semibold text-indigo-300 mb-2">
                <ShoppingBagIcon /> <span>Informações dos Modelos:</span>
              </div>
              {renderFormattedText(msg.text)}
            </div>
          ) : (
            <p className="text-sm sm:text-base leading-relaxed">{renderFormattedText(msg.text)}</p>
          )}
        </div>
        {msg.sender === 'user' && (
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sky-500 flex items-center justify-center ml-2 sm:ml-3 shadow-md">
            <UserIcon />
          </div>
        )}
      </div>
      {msg.sender === 'bot' && msg.actions && msg.actions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 justify-start pl-10 sm:pl-14">
          {msg.actions.map(action => (
            <button
              key={action.id}
              onClick={() => onActionClick(action.id, msg.text)}
              className="text-xs bg-teal-500 hover:bg-teal-600 text-white py-1.5 px-3 rounded-lg shadow-md disabled:bg-gray-400 flex items-center"
              disabled={isProcessingAction}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;