import React, { useState } from 'react';
import './App.css';
import MemoryComparison from './MemoryComparison'; // Importar el componente MemoryComparison

function App() {
  // Estado para almacenar el código ensamblador ingresado por el usuario
  const [assemblyCode, setAssemblyCode] = useState('');

  // Estado para almacenar el código máquina traducido
  const [machineCode, setMachineCode] = useState('');

  // Estado para almacenar los valores de los registros
  const [registers, setRegisters] = useState({
    t0: 0,
    t1: 0,
    t2: 0,
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 0,
    s5: 0,
  });

  // Estado para almacenar los valores de la memoria
  const [memory, setMemory] = useState({});

  // Estado para gestionar el contador de programa (Program Counter - PC)
  const [programCounter, setProgramCounter] = useState(0);

  // Estado para gestionar el paso actual del tutorial
  const [tutorialStep, setTutorialStep] = useState(0);

  // Ejemplos de código ensamblador MIPS para el menú desplegable
  const examples = {
    'Ejemplo 1': 'li $t0, 5\nadd $t1, $t0, $t0\nsw $t1, 0($t2)',
    'Ejemplo 2': 'add $s1, $s2, $s3\nli $s4, 10\nsw $s4, 4($s5)',
    'Ejemplo 3': 'sub $t3, $t1, $t0\nlw $t4, 8($t2)\nbeq $t3, $t4, etiqueta',
    'Ejemplo 4': 'li $a0, 20\nadd $a1, $a0, $a0\nsw $a1, 12($sp)',
    'Ejemplo 5': 'lw $t5, 16($t6)\nsub $t7, $t5, $t6\nbeq $t7, $zero, fin',
  };

  // Pasos del tutorial para guiar al usuario a través de la aplicación
  const tutorialSteps = [
    'Bienvenido al Traductor MIPS. Aquí puedes escribir código ensamblador.',
    'Selecciona un ejemplo del menú desplegable para comenzar.',
    'Haz clic en el botón "Traducir" para convertir el código ensamblador en código máquina.',
    'Observa cómo los registros, la memoria y el contador de programa (PC) cambian después de la traducción.',
    '¡Eso es todo! Ahora puedes experimentar con tu propio código ensamblador.',
  ];

  // Función para traducir el código ensamblador MIPS a código máquina
  const translateMIPS = (code) => {
    const lines = code.split('\n'); // Dividir el código en líneas
    const newRegisters = { ...registers }; // Copiar el estado actual de los registros
    const newMemory = { ...memory }; // Copiar el estado actual de la memoria
    let pc = 0; // Inicializar el contador de programa

    // Mapear cada línea de código ensamblador a su equivalente en código máquina
    const translations = lines.map((line) => {
      const parts = line.trim().split(/\s+/); // Dividir la línea en partes
      const opcodeMap = {
        add: '000000',
        li: '001000',
        sw: '101011',
        sub: '000000',
        lw: '100011',
        beq: '000100',
      };

      // Manejar la instrucción 'add'
      if (parts[0] === 'add') {
        const rd = parts[1].replace('$', '').replace(',', '');
        const rs = parts[2].replace('$', '').replace(',', '');
        const rt = parts[3].replace('$', '').replace(',', '');
        newRegisters[rd] = newRegisters[rs] + newRegisters[rt]; // Actualizar el valor del registro
        pc += 4; // Incrementar el PC en 4 (tamaño de instrucción)
        return `${opcodeMap.add}...`;
      } else if (parts[0] === 'li') {
        // Manejar la instrucción 'li'
        const rt = parts[1].replace('$', '').replace(',', '');
        const immediate = parseInt(parts[2], 10);
        newRegisters[rt] = immediate; // Cargar un valor inmediato en el registro
        pc += 4; // Incrementar el PC en 4
        return `${opcodeMap.li}...`;
      } else if (parts[0] === 'sw') {
        // Manejar la instrucción 'sw'
        const rt = parts[1].replace('$', '').replace(',', '');
        const offsetAndBase = parts[2].split('(');
        const offset = parseInt(offsetAndBase[0], 10);
        const base = offsetAndBase[1].replace('$', '').replace(')', '');
        newMemory[newRegisters[base] + offset] = newRegisters[rt]; // Almacenar el valor en memoria
        pc += 4; // Incrementar el PC en 4
        return `${opcodeMap.sw}...`;
      } else if (parts[0] === 'sub') {
        // Manejar la instrucción 'sub'
        const rd = parts[1].replace('$', '').replace(',', '');
        const rs = parts[2].replace('$', '').replace(',', '');
        const rt = parts[3].replace('$', '').replace(',', '');
        newRegisters[rd] = newRegisters[rs] - newRegisters[rt]; // Restar y almacenar el resultado
        pc += 4; // Incrementar el PC en 4
        return `${opcodeMap.sub}...`;
      } else if (parts[0] === 'lw') {
        // Manejar la instrucción 'lw'
        const rt = parts[1].replace('$', '').replace(',', '');
        const offsetAndBase = parts[2].split('(');
        const offset = parseInt(offsetAndBase[0], 10);
        const base = offsetAndBase[1].replace('$', '').replace(')', '');
        newRegisters[rt] = newMemory[newRegisters[base] + offset] || 0; // Cargar valor desde memoria
        pc += 4; // Incrementar el PC en 4
        return `${opcodeMap.lw}...`;
      } else if (parts[0] === 'beq') {
        // Manejar la instrucción 'beq'
        const rs = parts[1].replace('$', '').replace(',', '');
        const rt = parts[2].replace('$', '').replace(',', '');
        const label = parts[3];
        if (newRegisters[rs] === newRegisters[rt]) {
          // Simular el salto (no implementado completamente aquí)
        }
        pc += 4; // Incrementar el PC en 4
        return `${opcodeMap.beq}...`;
      } else {
        return 'Instrucción no soportada'; // Retornar error para instrucciones no soportadas
      }
    });

    setRegisters(newRegisters); // Actualizar el estado de los registros
    setMemory(newMemory); // Actualizar el estado de la memoria
    setProgramCounter(pc); // Actualizar el contador de programa
    return translations.join('\n'); // Retornar el código máquina traducido
  };

  // Función para manejar el proceso de traducción
  const handleTranslate = () => {
    const result = translateMIPS(assemblyCode);
    setMachineCode(result);
  };

  // Función para manejar la selección de un ejemplo
  const handleExampleChange = (event) => {
    setAssemblyCode(examples[event.target.value]);
  };

  // Función para avanzar al siguiente paso del tutorial
  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Título de la aplicación */}
      <h1 style={{ textAlign: 'center', color: '#003366' }}>arquitectura-computadores-usaca<br />actividad 5 - cristian bedoya</h1>

      {/* Renderizar el componente MemoryComparison */}
      <MemoryComparison />

      {/* Sección del tutorial */}
      {tutorialStep < tutorialSteps.length && (
        <div style={{ backgroundColor: '#e0f7fa', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
          <p>{tutorialSteps[tutorialStep]}</p>
          <button
            onClick={nextTutorialStep}
            style={{ padding: '5px 10px', backgroundColor: '#00796b', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Siguiente
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        {/* Panel de entrada para el código ensamblador */}
        <div style={{ flex: 1 }}>
          <h2>Código Ensamblador</h2>
          <select onChange={handleExampleChange} style={{ marginBottom: '10px', padding: '5px' }}>
            <option value="">Selecciona un ejemplo</option>
            {Object.keys(examples).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <textarea
            value={assemblyCode}
            onChange={(e) => setAssemblyCode(e.target.value)}
            placeholder="Escribe tu código ensamblador aquí..."
            style={{ width: '100%', height: '200px', padding: '10px', fontSize: '16px' }}
          ></textarea>
          <button
            onClick={handleTranslate}
            style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#003366', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Traducir
          </button>
        </div>

        {/* Panel de salida para el código máquina */}
        <div style={{ flex: 1 }}>
          <h2>Código Máquina</h2>
          <textarea
            value={machineCode}
            readOnly
            style={{ width: '100%', height: '200px', padding: '10px', fontSize: '16px', backgroundColor: '#f0f0f0' }}
          ></textarea>
        </div>
      </div>

      {/* Panel de simulación visual */}
      <div style={{ marginTop: '20px' }}>
        <h2>Simulación Visual</h2>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <h3>Registros</h3>
            <ul>
              {Object.entries(registers).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <h3>Memoria</h3>
            <ul>
              {Object.entries(memory).map(([key, value]) => (
                <li key={key}>Dirección {key}: {value}</li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>Contador de Programa (PC)</h3>
          <p>PC: {programCounter}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
