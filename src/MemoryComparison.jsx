import React, { useState } from 'react';
import './MemoryComparison.css';

function MemoryComparison() {
  const [swapping, setSwapping] = useState(0); // Estado para el simulador de rendimiento

  return (
    <div className="memory-comparison" style={{ fontFamily: 'Arial, sans-serif', color: '#003366' }}>
      {/* Gráfico de Jerarquía */}
      <div className="hierarchy">
        <h2>Jerarquía de Memoria</h2>
        <div className="pyramid">
          <div className="level">Registros</div>
          <div className="level">Caché</div>
          <div className="level">RAM</div>
          <div className="level">SSD/HDD</div>
        </div>
      </div>

      {/* Cuadro Comparativo Interactivo */}
      <div className="comparison-table">
        <h2>Cuadro Comparativo</h2>
        <table>
          <thead>
            <tr>
              <th>Característica</th>
              <th>Memoria Principal (RAM)</th>
              <th>Memoria Secundaria (SSD/HDD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Velocidad</td>
              <td>Alta</td>
              <td>Media/Baja</td>
            </tr>
            <tr>
              <td>Volatilidad</td>
              <td>Volátil</td>
              <td>No Volátil</td>
            </tr>
            <tr>
              <td>Capacidad</td>
              <td>Limitada</td>
              <td>Alta</td>
            </tr>
            <tr>
              <td>Costo por GB</td>
              <td>Alto</td>
              <td>Bajo</td>
            </tr>
            <tr>
              <td>Tipo de Acceso</td>
              <td>Aleatorio</td>
              <td>Secuencial/Aleatorio</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Simulador de Rendimiento */}
      <div className="performance-simulator">
        <h2>Simulador de Rendimiento</h2>
        <label htmlFor="swapping-slider">Nivel de Swapping:</label>
        <input
          id="swapping-slider"
          type="range"
          min="0"
          max="100"
          value={swapping}
          onChange={(e) => setSwapping(e.target.value)}
        />
        <p>Latencia del Sistema: {swapping} ms</p>
      </div>
    </div>
  );
}

export default MemoryComparison;