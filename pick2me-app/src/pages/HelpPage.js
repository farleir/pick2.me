import React from 'react';

const HelpPage = ({ onNavigate }) => {
  return (
    <div className="flex-grow p-6 sm:p-8 overflow-y-auto bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => onNavigate('chat')} 
          className="mb-6 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          &larr; Voltar para o Chat
        </button>
        
        <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Sobre o Pick2.me</h1>
        <p className="mb-6 leading-relaxed">
          Escolher um produto novo pode ser uma tarefa cansativa e confusa. Com tantas opções, especificações técnicas e preços que mudam a todo momento, é fácil sentir-se perdido. O Pick2.me nasceu para resolver exatamente este problema. Somos o seu assistente de compras pessoal, um chatbot inteligente projetado para entender as suas necessidades e traduzi-las nas melhores recomendações de produtos, simplificando a sua jornada de compra.
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">Direitos Autorais e Uso da Informação</h2>
        <p className="mb-6 leading-relaxed">
          O Pick2.me utiliza a tecnologia da API Google Gemini para gerar as respostas e sugestões. As informações sobre produtos, como características e faixas de preço, são geradas pela inteligência artificial com base em um vasto conjunto de dados públicos e têm um caráter informativo e simulado. Os links para o Google Shopping são fornecidos para sua conveniência, para que possa pesquisar ofertas reais. Todos os nomes de produtos, marcas e logótipos são propriedade dos seus respetivos detentores.
        </p>
        
        <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">Privacidade e LGPD (Lei Geral de Proteção de Dados)</h2>
        <p className="mb-6 leading-relaxed">
          A sua privacidade é a nossa prioridade. O Pick2.me foi projetado para funcionar sem que você precise de se identificar ou fornecer dados pessoais. A conversa que tem com o nosso assistente é temporária e usada apenas para gerar as recomendações dentro da sua sessão.
          <br/><br/>
          <strong>Importante:</strong> Para sua segurança, **NÃO insira dados sensíveis** na conversa, como números de documentos, informações de cartão de crédito, palavras-passe ou qualquer outro dado pessoal que não seja estritamente necessário para a busca do produto (como "procuro uma TV para a minha sala em São Paulo").
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">Melhorias Futuras</h2>
        <p className="leading-relaxed">
          Estamos constantemente a trabalhar para tornar o Pick2.me ainda melhor! Alguns dos nossos próximos passos incluem:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2">
          <li><strong>Histórico de Conversas:</strong> Opção de criar uma conta para guardar as suas pesquisas e conversas.</li>
          <li><strong>Integração com Lojas Afiliadas:</strong> Fornecer links diretos para compra em lojas parceiras de confiança.</li>
          <li><strong>Comparação Avançada:</strong> Apresentar as comparações entre produtos em tabelas visuais e fáceis de entender.</li>
          <li><strong>Expansão para o WhatsApp:</strong> Levar a experiência do Pick2.me para a sua plataforma de mensagens preferida.</li>
        </ul>

      </div>
    </div>
  );
};

export default HelpPage;
