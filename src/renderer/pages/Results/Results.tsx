import React from 'react';
import './Results.css'

type ResultsPageProps = {
  onNavigate: () => void;
  calculationResult: [boolean, string];
};

const ResultsPage: React.FC<ResultsPageProps> = ({ onNavigate, calculationResult }) => {
  const imagePath = calculationResult[0]
    ? require('./assets/diabo.jpg')
    : require('./assets/jesus.jpg'); 

  return (
    <div className='container' id='results-container'>
      <div id='img-result'>
        <img src={imagePath} alt={calculationResult[0] ? "Reprovado" : "Aprovado"} style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
      <div id='msg-result'>
        <p>{calculationResult[1]}</p>
      </div>
      <button id='voltar-button' onClick={onNavigate}>VOLTAR</button>
    </div>
  );
};

export default ResultsPage;
