// A sua chave de API é colocada aqui.
const apiKey = "AIzaSyDSEfpHWXVpGMAvcsCeAMKXe3NKEiLIl0k"; 
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

// --- LÓGICA DA CONVERSA PRINCIPAL ---
export const callConversationAPI = async (currentChatHistory) => {
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
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erro API: ${response.statusText}. ${JSON.stringify(errorData.error?.message || errorData)}`);
        }
        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
            return result.candidates[0].content.parts[0].text; 
        }
        return "Desculpe, não consegui processar sua solicitação."; 
    } catch (error) {
        console.error("Falha ao chamar API Gemini (Conversa):", error);
        return `Erro de conexão com o assistente: ${error.message}`; 
    }
};

// --- LÓGICA PARA BUSCA DE INFORMAÇÕES DE MODELOS ---
export const fetchModelInformationAPI = async (modelNamesString) => {
    const modelList = modelNamesString.split(',').map(name => name.trim()).filter(name => name);
    if (modelList.length === 0) {
      throw new Error("Nenhum nome de modelo válido foi fornecido para a busca.");
    }
    const modelInfoPrompt = `Para cada um dos seguintes modelos de produtos: ${modelList.join(', ')}, forneça:
- Nome do Modelo (confirme o nome).
- Um breve resumo de suas características principais (2-3 pontos).
- Uma faixa de preço típica simulada no mercado brasileiro (ex: R$ 2.800 - R$ 3.200).
- Um link de busca no Google Shopping. Para criar o link, pegue o nome do modelo, substitua espaços por '+' e anexe a 'https://www.google.com/search?tbm=shop&q='. Exemplo para "Samsung Galaxy S24": https://www.google.com/search?tbm=shop&q=Samsung+Galaxy+S24
Formate a resposta em português do Brasil como uma lista numerada para cada modelo: 'Aqui estão algumas informações sobre os modelos que encontrei:\\n\\n1. **[Nome do Modelo]**\\n   *Características Principais:* [Breve lista ou descrição]\\n   *Faixa de Preço Típica (Simulada):* [Preço em R$]\\n   *Pesquisar Preços:* https://en.wikipedia.org/wiki/Google_Shopping\\n\\n2. ...'`;
      
    const payload = { contents: [{ role: "user", parts: [{ text: modelInfoPrompt }] }], generationConfig: {} };
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao buscar informações dos modelos: ${JSON.stringify(errorData.error?.message || errorData)}`);
        }
        const result = await response.json();
        if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
          return result.candidates[0].content.parts[0].text;
        }
        return "Não encontrei informações para os modelos especificados desta vez.";
    } catch (error) {
        console.error("Falha ao chamar API Gemini (Busca):", error);
        return `Houve um problema ao buscar informações dos modelos: ${error.message}`;
    }
};

// --- LÓGICA PARA AÇÕES (RESUMIR, COMPARAR) ---
export const callActionAPI = async (promptText) => {
    const payload = {
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig: {} 
    };
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API Gemini: ${response.statusText}. Detalhes: ${JSON.stringify(errorData.error?.message || errorData)}`);
      }
      const result = await response.json();
      if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text; 
      }
      return "Desculpe, não consegui processar esta ação no momento."; 
    } catch (error) {
      console.error("Falha ao chamar API Gemini (Ação):", error);
      return `Erro ao processar ação: ${error.message}`; 
    }
};