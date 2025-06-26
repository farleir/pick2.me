import React, { useState, useEffect, useRef } from 'react';

// --- Ícones (SVG inline para melhor controlo e consistência) ---

const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" opacity=".3"/>
    <path d="M12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    <circle cx="9.5" cy="13.5" r="1.5" fill="white"/>
    <circle cx="14.5" cy="13.5" r="1.5" fill="white"/>
  </svg>
);

const UserIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".3"/>
    <path d="M12 12c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c2.33 0 7 1.17 7 3.5V19H5v-1.5c0-2.33 4.67-3.5 7-3.5z"/>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 inline-block">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block mr-1">
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.235.94 5.241 4.145 2.415 4.753-.39 3.423-3.235-.94-5.241-4.145-2.415L10.868 2.884zM10 15a5 5 0 100-10 5 5 0 000 10z" clipRule="evenodd" />
  </svg>
);


// --- Componente principal da aplicação ---
function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isFetchingModelInfo, setIsFetchingModelInfo] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const chatHistoryRef = useRef([]);
  const messagesEndRef = useRef(null);

  // Função para fazer scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Mensagem inicial do bot
  useEffect(() => {
    const initialBotMessage = {
      id: 'initial_bot_msg_' + Date.now(),
      text: "Olá! Escolher um produto novo pode ser complicado com tantas opções, funções e preços diferentes, não é? Eu sou o Pick2Me e estou aqui para simplificar isso para você. 😊 Para começar, me diga qual produto ou categoria você tem em mente.",
      sender: 'bot',
      type: 'text',
    };
    setMessages([initialBotMessage]);
    chatHistoryRef.current.push({ role: "model", parts: [{ text: initialBotMessage.text }] });
  }, []);

  // Handler para mudança no input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Função para chamar a API Gemini para ações (resumir, comparar)
  const callGeminiForActionAPI = async (promptText) => {
    setIsProcessingAction(true); 
    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: {} 
      };
      const apiKey = "AIzaSyDSEfpHWXVpGMAvcsCeAMKXe3NKEiLIl0k"; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro na API Gemini para ação:", errorData);
        throw new Error(`Erro na API Gemini: ${response.statusText}. Detalhes: ${JSON.stringify(errorData.error?.message || errorData)}`);
      }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text; 
      }
      console.warn("Resposta da API Gemini para ação inesperada:", result);
      return "Desculpe, não consegui processar esta ação no momento."; 
    } catch (error) {
      console.error("Falha ao chamar API Gemini para ação:", error);
      return `Erro ao processar ação: ${error.message}`; 
    } finally {
      setIsProcessingAction(false); 
    }
  };
  
  // Handler unificado para cliques nos botões de ação
  const handleActionClick = async (actionType, suggestionsText) => {
    if (!suggestionsText) {
        console.warn(`Tentativa de ${actionType} sem texto de sugestões fornecido.`);
        setMessages(prev => [...prev, {
            id: `no_suggestions_param_err_${Date.now()}`,
            text: "Ocorreu um problema ao tentar realizar a ação. As informações dos modelos não foram encontradas para esta ação.",
            sender: 'bot',
            type: 'text',
            isError: true,
        }]);
        return;
    }

    let prompt = ""; 
    if (actionType === 'summarize') {
        prompt = `Considere as seguintes informações sobre modelos de produtos:\n\n${suggestionsText}\n\nEscolha o primeiro modelo da lista. Imagine que leu várias avaliações online para ele. Com base no que é típico para este tipo de modelo, gere um breve resumo dos prós e contras que os utilizadores provavelmente mencionariam. Indique o nome do modelo que está a resumir. Formate como: '**Resumo de Avaliações para [Nome do Modelo Escolhido]:**\n\n**Prós Típicos:**\n- [Pró 1]\n- [Pró 2]\n\n**Contras Típicos:**\n- [Contra 1]\n- [Contra 2]' Em Português do Brasil.`;
    } else if (actionType === 'compare') {
        prompt = `Analise as seguintes informações sobre modelos de produtos e crie uma breve comparação entre eles, destacando os pontos fortes de cada um e para que tipo de utilizador seriam mais adequados. As informações são:\n\n${suggestionsText}\n\nApresente a comparação de forma clara e concisa, em Português do Brasil. Use Markdown para formatar (negrito para nomes de modelos, listas para características).`;
    } else {
        console.error("Tipo de ação desconhecido:", actionType);
        return; 
    }
    
    const actionText = await callGeminiForActionAPI(prompt); 
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

  // Função para chamar a API Gemini para a conversa principal
  const callGeminiAPI = async (currentChatHistory) => {
    // **PROMPT MELHORADO AQUI**
    const systemInstruction = {
      role: "user",
      parts: [{text: `Você é 'Pick2Me', um chatbot consultor de compras amigável, empático e especialista. Seu contexto é o Brasil.
1.  **Tom de Voz e Personalidade:** Seu papel é ser um guia tranquilizador num mundo de compras confuso. Reconheça a dificuldade do usuário ("Sei que escolher um celular novo é complicado com tantas opções..."). Use sempre português do Brasil e exemplos do mercado brasileiro (preços em R$, lojas, etc.).
2.  **Objetivo Principal:** Ajudar usuários a refinar suas necessidades para identificar MODELOS ESPECÍFICOS de produtos.
3.  **Coleta de Detalhes:** Seja um bom ouvinte. Faça perguntas abertas e guiadas para entender o que realmente importa (orçamento, uso, funcionalidades, marcas). Não tenha pressa.
4.  **NÃO PULE ETAPAS (Regra Crucial):** Antes de buscar informações, você **DEVE** primeiro resumir o que entendeu e **PERGUNTAR** ao usuário se ele quer que você procure.
    * **Exemplo de Diálogo:**
        * User: "Quero um celular bom pra fotos."
        * Bot: "Legal! Para te ajudar a achar o modelo certo, qual sua faixa de preço?"
        * User: "Até 3000 reais."
        * Bot: "Ótimo. E tem alguma marca que você prefere, como Samsung, Motorola ou outra?"
        * User: "Gosto da Samsung."
        * Bot: "Perfeito! Então estamos buscando um Samsung de até R$3000 com foco em câmera. **Posso procurar alguns modelos com essas características para você?**" // <-- PERGUNTA DE CONFIRMAÇÃO OBRIGATÓRIA
5.  **Uso da TAG de Busca:** APENAS DEPOIS que o usuário confirmar (com "sim", "pode procurar", etc.), na sua próxima resposta, use a tag: '[BUSCAR_MODELOS_PARA: Nome do Modelo 1, Nome do Modelo 2, ...]'.
6.  **Formatação de Resultados:** Ao apresentar as informações, use um formato claro e direto.`}]
    };
    const contents = [...currentChatHistory];
    contents.unshift(systemInstruction);

    const payload = { contents: contents, generationConfig: {} };
    const apiKey = "AIzaSyDSEfpHWXVpGMAvcsCeAMKXe3NKEiLIl0k"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    try {
        setIsBotTyping(true); 
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro na API Gemini:", errorData);
            throw new Error(`Erro API: ${response.statusText}. ${JSON.stringify(errorData.error?.message || errorData)}`);
        }
        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            return result.candidates[0].content.parts[0].text; 
        }
        console.warn("Resposta da API Gemini inesperada:", result);
        return "Desculpe, não consegui processar sua solicitação."; 
    } catch (error) {
        console.error("Falha ao chamar API Gemini:", error);
        return `Erro de conexão com o assistente: ${error.message}`; 
    } finally {
        setIsBotTyping(false); 
    }
  };

  // Função para buscar e formatar informações de modelos
  const fetchAndFormatModelInformation = async (modelNamesString) => {
    setIsFetchingModelInfo(true); 
    let modelInfoText = "Não encontrei informações para os modelos especificados desta vez.";
    try {
      const modelList = modelNamesString.split(',').map(name => name.trim()).filter(name => name);
      if (modelList.length === 0) {
          throw new Error("Nenhum nome de modelo válido foi fornecido para a busca.");
      }
      // **PROMPT MELHORADO AQUI**
      const modelInfoPrompt = `Para cada um dos seguintes modelos de produtos: ${modelList.join(', ')}, forneça:
- Nome do Modelo (confirme o nome).
- Um breve resumo de suas características principais (2-3 pontos).
- Uma faixa de preço típica simulada no mercado brasileiro (ex: R$ 2.800 - R$ 3.200).
- Um link de exemplo para uma página de produto ou review de um site brasileiro (ex: .com.br, ou de uma loja conhecida no Brasil). Forneça o URL completo e direto, como em 'https://www.magazineluiza.com.br/produto'.
Formate a resposta em português do Brasil como uma lista numerada para cada modelo: 'Aqui estão algumas informações sobre os modelos que encontrei:\\n\\n1. **[Nome do Modelo]**\\n   *Características Principais:* [Breve lista ou descrição]\\n   *Faixa de Preço Típica (Simulada):* [Preço em R$]\\n   *Link Exemplo:* https://www.exemplo.com.br/produto\\n\\n2. ...'`;
      
      const payload = { contents: [{ role: "user", parts: [{ text: modelInfoPrompt }] }], generationConfig: {} };
      const apiKey = "AIzaSyDSEfpHWXVpGMAvcsCeAMKXe3NKEiLIl0k"; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao buscar informações dos modelos: ${JSON.stringify(errorData.error?.message || errorData)}`);
      }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        modelInfoText = result.candidates[0].content.parts[0].text;
      }
      
      const actions = [];
      if (modelInfoText && !modelInfoText.toLowerCase().startsWith("não encontrei")) {
          const currentModelInfo = modelInfoText; 
          actions.push(
              { id: 'summarize', label: <><SparkleIcon /> Resumir Avaliações</>, handler: () => handleActionClick('summarize', currentModelInfo) },
              { id: 'compare', label: <><SparkleIcon /> Comparar Modelos</>, handler: () => handleActionClick('compare', currentModelInfo) }
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
      chatHistoryRef.current.push({ role: "model", parts: [{ text: `[Informações sobre os modelos: ${modelList.join(', ')} apresentadas]` }] });
    } catch (error) {
      console.error('Erro ao buscar/formatar informações dos modelos:', error);
      setMessages(prev => [...prev, { id: 'model_info_error_' + Date.now(), text: `Houve um problema ao buscar informações dos modelos: ${error.message}`, sender: 'bot', type: 'text', isError: true }]);
    } finally {
      setIsFetchingModelInfo(false); 
    }
  };

  // Função para enviar mensagem do utilizador
  const sendMessage = async () => {
    if (inputValue.trim() === '') return; 

    const userMessage = { id: 'user_msg_' + Date.now(), text: inputValue, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, userMessage]); 
    chatHistoryRef.current.push({ role: "user", parts: [{ text: userMessage.text }] }); 
    setInputValue(''); 

    try {
      const botResponseText = await callGeminiAPI([...chatHistoryRef.current]); 
      const modelSearchMatch = botResponseText.match(/\[BUSCAR_MODELOS_PARA:(.*?)\]/);
      
      let cleanedBotText = botResponseText;
      if (modelSearchMatch && modelSearchMatch[1]) {
          cleanedBotText = botResponseText.replace(/\[BUSCAR_MODELOS_PARA:.*?\]/g, '').trim();
      }
      
      const botMessage = { id: 'bot_msg_' + Date.now(), text: cleanedBotText, sender: 'bot', type: 'text' };
      if (cleanedBotText) { 
          setMessages(prev => [...prev, botMessage]);
      }
      chatHistoryRef.current.push({ role: "model", parts: [{ text: botResponseText }] }); 

      if (modelSearchMatch && modelSearchMatch[1]) {
        const modelNamesString = modelSearchMatch[1].trim();
        if (modelNamesString) {
          setMessages(prev => [...prev, { id: 'fetching_models_msg_' + Date.now(), text: `Entendido! Vou procurar informações sobre: ${modelNamesString.split(',').map(s => s.trim()).join(', ')}...`, sender: 'bot', type: 'text_italic' }]);
          await fetchAndFormatModelInformation(modelNamesString); 
        }
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [...prev, { id: 'error_msg_' + Date.now(), text: `Erro: ${error.message}`, sender: 'bot', type: 'text', isError: true }]);
    } 
  };

  // Função para renderizar texto formatado (Markdown simples)
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

  // --- Estrutura JSX da aplicação ---
  return (
    <div className="font-sans bg-slate-900 flex flex-col items-center justify-center min-h-screen p-0 sm:p-4 text-slate-100">
      <div className="bg-slate-800 shadow-2xl rounded-none sm:rounded-xl w-full max-w-2xl flex flex-col h-screen sm:h-[calc(100vh-3rem)] sm:max-h-[800px]">
        {/* Cabeçalho */}
        <header className="bg-indigo-600 text-white p-4 sm:p-5 rounded-t-none sm:rounded-t-xl flex items-center space-x-4 shadow-lg">
          <div className="p-2 bg-indigo-700 rounded-full"> <BotIcon /> </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">Pick2.me Assistente</h1>
            <p className="text-xs sm:text-sm text-indigo-200">Seu guia de compras inteligente</p>
          </div>
        </header>

        {/* Área de Mensagens */}
        <div className="flex-grow p-4 sm:p-6 space-y-5 overflow-y-auto">
          {messages.map(msg => (
            <div key={msg.id}> 
              <div className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && (
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center mr-2 sm:mr-3 shadow-md"> <BotIcon /> </div>
                )}
                <div className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-md transition-all duration-300 ${
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
                }`}>
                  {msg.type === 'product_list' ? (
                    <div>
                      <div className="flex items-center font-semibold text-indigo-300 mb-2"> <ShoppingBagIcon /> <span>Informações dos Modelos:</span> </div>
                      {renderFormattedText(msg.text)}
                    </div>
                  ) : (
                    <p className="text-sm sm:text-base leading-relaxed">{renderFormattedText(msg.text)}</p>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sky-500 flex items-center justify-center ml-2 sm:ml-3 shadow-md"> <UserIcon /> </div>
                )}
              </div>
              {msg.sender === 'bot' && msg.actions && msg.actions.length > 0 && !isBotTyping && !isFetchingModelInfo && (
                <div className="mt-2 flex flex-wrap gap-2 justify-start pl-10 sm:pl-14"> 
                  {msg.actions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action.id, msg.text)} 
                      className="text-xs bg-teal-500 hover:bg-teal-600 text-white py-1.5 px-3 rounded-lg shadow-md disabled:bg-gray-400 flex items-center"
                      disabled={isProcessingAction} 
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Indicador de atividade do bot */}
          {(isBotTyping || isFetchingModelInfo || isProcessingAction) && (
            <div className="flex justify-start items-end">
               <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center mr-2 sm:mr-3 shadow-md"> <BotIcon /> </div>
              <div className="max-w-xs px-4 py-3 rounded-2xl shadow-md bg-slate-600 text-slate-300 rounded-bl-lg">
                <p className="text-sm sm:text-base italic">
                  {isProcessingAction ? 'Processando sua ação...' : isFetchingModelInfo ? 'Buscando informações...' : 'Digitando...'}
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> 
        </div>

        {/* Rodapé com input de mensagem */}
        <footer className="bg-slate-800 border-t border-slate-700 p-3 sm:p-4 rounded-b-none sm:rounded-b-xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && !isBotTyping && !isFetchingModelInfo && !isProcessingAction && sendMessage()}
              placeholder="Digite sua mensagem..."
              className="flex-grow p-3 sm:p-3.5 border border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-slate-700 text-slate-100 placeholder-slate-400 text-sm sm:text-base"
              disabled={isBotTyping || isFetchingModelInfo || isProcessingAction} 
            />
            <button
              onClick={sendMessage}
              disabled={isBotTyping || isFetchingModelInfo || isProcessingAction} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 sm:p-3.5 rounded-xl disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg hover:shadow-indigo-500/50"
            >
              {(isBotTyping || isFetchingModelInfo || isProcessingAction) ? ( 
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <SendIcon /> 
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
