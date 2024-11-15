import React, { useState } from 'react';
import './Home.css'

type HomePageProps = {
  onCalculate: (cargaHoraria: number, diasFaltados: number) => void;
};

const HomePage: React.FC<HomePageProps> = ({ onCalculate }) => {
  const [cargaHoraria, setCargaHoraria] = useState(60);
  const [diasFaltados, setDiasFaltados] = useState(1);

  const handleCalculateClick = () => {
    onCalculate(cargaHoraria, diasFaltados);
  };

  return (
    <div className='container' id='home-container'>
      <h1>CALCULAFALTAS</h1>
      <div id='opcoes'>
        <div id='carga-container'>
          <label id='carga-label'>CARGA HORÁRIA:</label>
          <select
            id='carga-select'
            value={cargaHoraria}
            onChange={(e) => setCargaHoraria(Number(e.target.value))}
          >
            <option value={30}>30</option>
            <option value={60}>60</option>
            <option value={90}>90</option>
          </select>
        </div>
        <div id='faltas-container'>
          <label id='faltas-label'>DIAS FALTADOS:</label>
          <input
            type="number"
            value={diasFaltados}
            onChange={(e) => setDiasFaltados(Number(e.target.value))}
            min="1"
            max="200"
            id="faltas-input"
          />
        </div>
      </div>
      <button id='calculate-button' onClick={handleCalculateClick}>CALCULAR</button>
    </div>
  );
};

export default HomePage;
