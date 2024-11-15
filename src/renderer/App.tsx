import React, { useState, useEffect } from 'react';
import HomePage from './pages/Home/Home.tsx';
import ResultsPage from './pages/Results/Results.tsx';
import WebSocketClient from './websocket/websocket_client.ts';

type Page = 'home' | 'results';

const wsClient = new WebSocketClient('ws://localhost:8000');

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [calculationResult, setCalculationResult] = useState<any>(null);

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleCalculation = (cargaHoraria: number, diasFaltados: number) => {
    wsClient.sendCalcular(cargaHoraria, diasFaltados);    
  };

  useEffect(() => {
    wsClient.setOnMessageCallback((message) => {
      if (message.status) {
        setCalculationResult(message.message);
        navigate('results');  
      } else {
        alert("Erro ao realizar o cálculo, insira os valores novamente :)");
      }
    });
  }, []);

  return (
    <div>
      {currentPage === 'home' && (
        <HomePage
          onCalculate={handleCalculation}
        />
      )}
      {currentPage === 'results' && (
        <ResultsPage
          onNavigate={() => navigate('home')}
          calculationResult={calculationResult}
        />
      )}
    </div>
  );
};

export default App;
