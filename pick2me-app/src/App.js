import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Message from './components/Message';
import MessageInput from './components/MessageInput';
import QuickSuggestions from './components/QuickSuggestions'; // <-- Importa o novo componente
import { BotIcon, SparkleIcon } from './components/Icons';
import { callConversationAPI, fetchModelInformationAPI, callActionAPI } from './services/geminiAPI';
import { trackEvent } from './services/analytics';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isFetchingModelInfo, setIsFetchingModelInfo] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [showQuickSuggestions, setShowQuickSuggestions] = useState(true); // <-- Novo estado para controlar os botões

  const chatHistoryRef = useRef([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const initialBotMessage = {
      id: 'initial_bot_msg_' + Date.now(),
      text: "Olá! Escolher um produto novo pode ser complicado com tantas opções, funções e preços diferentes, não é? Eu sou o Pick2Me e estou aqui para simplificar isso para você. 😊 Para começar, me diga qual produto ou categoria você tem em mente, ou clique em uma das sugestões abaixo.",
      sender: 'bot',
      type: 'text',
    };
    setMessages([initialBotMessage]);
    chatHistoryRef.current.push({ role: "model", parts: [{ text: initialBotMessage.text }] });
  }, []);

  const handleActionClick = async (actionType, suggestionsText) => {
    trackEvent('click_ai_action', { action_type: actionType });

    if (!suggestionsText) {
      setMessages(prev => [...prev, { id: `err_action_${Date.now()}`, text: "Ocorreu um problema ao tentar realizar a ação.", sender: 'bot', isError: true }]);
      return;
    }

    setIsProcessingAction(true);
    let prompt = "";
    // **PROMPTS MELHORADOS AQUI**
    if (actionType === 'summarize') {
        prompt = `Analise **cada modelo** na lista de produtos a seguir. Para **cada um**, imagine que leu várias avaliações online e gere um breve resumo dos prós e contras que os utilizadores provavelmente mencionariam. Apresente os resumos separadamente para cada modelo.\n\nLISTA:\n${suggestionsText}`;
    } else if (actionType === 'compare') {
        prompt = `Analise **todos os modelos** na lista de produtos a seguir e crie uma comparação detalhada entre eles, destacando os pontos fortes de cada um, para que tipo de utilizador seriam mais adequados, e uma conclusão sobre qual oferece o melhor custo-benefício geral. As informações são:\n\n${suggestionsText}`;
    }
    
    const actionText = await callActionAPI(prompt);
    setIsProcessingAction(false);
    
    const isError = actionText.toLowerCase().startsWith('erro');
    const actionMessage = {
      id: `${actionType}_msg_` + Date.now(),
      text: actionText,
      sender: 'bot',
      type: isError ? 'text' : 'text_ai_action',
      isError: isError,
    };
    setMessages(prev => [...prev, actionMessage]);
  };
  
  // Função unificada para lidar com o envio de mensagens (do input ou dos botões)
  const processMessage = async (messageText) => {
    setShowQuickSuggestions(false); // Esconde os botões após a primeira interação

    trackEvent('send_message', { message_length: messageText.length });
    
    const userMessage = { id: 'user_msg_' + Date.now(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    chatHistoryRef.current.push({ role: "user", parts: [{ text: messageText }] });
    
    setIsBotTyping(true);
    const botResponseText = await callConversationAPI([...chatHistoryRef.current]);
    setIsBotTyping(false);

    chatHistoryRef.current.push({ role: "model", parts: [{ text: botResponseText }] });

    const modelSearchMatch = botResponseText.match(/\[BUSCAR_MODELOS_PARA:(.*?)\]/);
    const cleanedBotText = botResponseText.replace(/\[BUSCAR_MODELOS_PARA:.*?\]/g, '').trim();

    if (cleanedBotText) {
      setMessages(prev => [...prev, { id: `bot_msg_${Date.now()}`, text: cleanedBotText, sender: 'bot' }]);
    }

    if (modelSearchMatch?.[1]) {
      const modelNamesString = modelSearchMatch[1].trim();
      setMessages(prev => [...prev, { id: `fetching_models_msg_${Date.now()}`, text: `Entendido! Vou procurar informações sobre: ${modelNamesString}...`, sender: 'bot', type: 'text_italic' }]);
      
      setIsFetchingModelInfo(true);
      const modelInfoText = await fetchModelInformationAPI(modelNamesString);
      setIsFetchingModelInfo(false);

      const actions = [];
      if (!modelInfoText.toLowerCase().startsWith("não encontrei") && !modelInfoText.toLowerCase().startsWith("houve um problema")) {
          actions.push(
              { id: 'summarize', label: <><SparkleIcon /> Resumir Avaliações</> },
              { id: 'compare', label: <><SparkleIcon /> Comparar Modelos</> }
          );
      }
      
      const modelInfoMessage = {
        id: 'model_info_' + Date.now(),
        text: modelInfoText,
        sender: 'bot',
        type: 'product_list',
        actions: actions
      };
      setMessages(prev => [...prev, modelInfoMessage]);
    }
  };

  const sendMessage = () => {
    if (inputValue.trim() === '') return;
    processMessage(inputValue);
    setInputValue('');
  };
  
  const handleSuggestionClick = (suggestion) => {
      processMessage(suggestion);
  };


  const isProcessing = isBotTyping || isFetchingModelInfo || isProcessingAction;

  return (
    <div className="font-sans bg-slate-900 flex flex-col items-center justify-center min-h-screen p-0 sm:p-4 text-slate-100">
      <div className="bg-slate-800 shadow-2xl rounded-none sm:rounded-xl w-full max-w-2xl flex flex-col h-screen sm:h-[calc(100vh-3rem)] sm:max-h-[800px]">
        <Header />
        
        <div className="flex-grow p-4 sm:p-6 space-y-5 overflow-y-auto">
          {messages.map(msg => (
            <Message
              key={msg.id}
              msg={msg}
              onActionClick={handleActionClick}
              isProcessingAction={isProcessingAction}
            />
          ))}

          {isProcessing && (
            <div className="flex justify-start items-end">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                <BotIcon />
              </div>
              <div className="max-w-xs px-4 py-3 rounded-2xl shadow-md bg-slate-600 text-slate-300 rounded-bl-lg">
                <p className="text-sm sm:text-base italic">
                  {isProcessingAction ? 'Processando sua ação...' : isFetchingModelInfo ? 'Buscando informações...' : 'Digitando...'}
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Renderiza os botões de sugestão apenas no início */}
        {showQuickSuggestions && <QuickSuggestions onSuggestionClick={handleSuggestionClick} />}

        <MessageInput
          inputValue={inputValue}
          onInputChange={(e) => setInputValue(e.target.value)}
          onSendMessage={sendMessage}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}

export default App;