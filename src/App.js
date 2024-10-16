import React, { useState } from 'react';
import './App.css'; // Import der CSS-Datei für das responsive Design

// AufgabeKomponente für jede Aufgabe
const AufgabeKomponente = ({ num1, num2, onAnswerSubmit }) => {
  const [eingabe, setEingabe] = useState({ tausender: 0, hunderter: 0, zehner: 0, einer: 0 });

  const handleChange = (event, stelle) => {
    setEingabe({ ...eingabe, [stelle]: Number(event.target.value) });
  };

  const handleSubmit = () => {
    const result = 
      eingabe.tausender * 1000 + eingabe.hunderter * 100 + eingabe.zehner * 10 + eingabe.einer;
    onAnswerSubmit(result);
  };

  const options = Array.from({ length: 10 }, (_, i) => <option key={i} value={i}>{i}</option>);

  return (
    <div className="aufgabe">
      <h2>{num1} + {num2}</h2>
      <table className="eingabe-tabelle">
        <thead>
          <tr>
            <th>T</th>
            <th>H</th>
            <th>Z</th>
            <th>E</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select value={eingabe.tausender} onChange={(e) => handleChange(e, 'tausender')} className="zahl-feld">
                {options}
              </select>
            </td>
            <td>
              <select value={eingabe.hunderter} onChange={(e) => handleChange(e, 'hunderter')} className="zahl-feld">
                {options}
              </select>
            </td>
            <td>
              <select value={eingabe.zehner} onChange={(e) => handleChange(e, 'zehner')} className="zahl-feld">
                {options}
              </select>
            </td>
            <td>
              <select value={eingabe.einer} onChange={(e) => handleChange(e, 'einer')} className="zahl-feld">
                {options}
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleSubmit} className="submit-button">Überprüfen</button>
    </div>
  );
};

// StatistikKomponente zur Anzeige der Ergebnisse
const StatistikKomponente = ({ statistik }) => {
  return (
    <div className="statistik">
      <h2>Statistik</h2>
      <ul>
        {statistik.slice(0).reverse().map((item, index) => (
          <li key={index}>
            Aufgabe {statistik.length - index}: {item.num1} + {item.num2} = {item.correctResult} (Eingabe: {item.userResult}) 
            {item.correctResult === item.userResult ? (
              <span style={{ color: 'green' }}> Richtig</span>
            ) : (
              <span style={{ color: 'red' }}> Falsch</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Haupt-App-Komponente
const App = () => {
  const [aufgaben, setAufgaben] = useState([]);
  const [aktuelleAufgabe, setAktuelleAufgabe] = useState(0);
  const [statistik, setStatistik] = useState([]);
  const [letzteAufgabe, setLetzteAufgabe] = useState(null);

  // Funktion zur Generierung einer neuen Aufgabe
  const generiereNeueAufgabe = () => {
    const num1 = Math.floor(Math.random() * 900) + 100; // Zahl zwischen 100 und 999
    const num2 = Math.floor(Math.random() * 900) + 100; // Zahl zwischen 100 und 999
    return { num1, num2 };
  };

  // Funktion zum Starten einer neuen Runde mit 10 Aufgaben
  const starteNeueRunde = () => {
    const neueAufgaben = Array.from({ length: 10 }, () => generiereNeueAufgabe());
    setAufgaben(neueAufgaben);
    setAktuelleAufgabe(0);
    setStatistik([]);
    setLetzteAufgabe(null);
  };

  // Funktion zur Überprüfung der Antwort
  const handleAnswerSubmit = (userResult) => {
    const currentTask = aufgaben[aktuelleAufgabe];
    const correctResult = currentTask.num1 + currentTask.num2;
    
    const resultEntry = {
      num1: currentTask.num1,
      num2: currentTask.num2,
      correctResult,
      userResult,
    };

    setStatistik([...statistik, resultEntry]);
    setLetzteAufgabe(resultEntry);

    // Nächste Aufgabe oder Runde beenden
    if (aktuelleAufgabe < 9) {
      setAktuelleAufgabe(aktuelleAufgabe + 1);
    } else {
      alert("Runde beendet!");
    }
  };

  return (
    <div className="app-container">
      <h1>3c-App: Addition</h1>
      {aufgaben.length === 0 ? (
        <button onClick={starteNeueRunde} className="start-button">Neue Runde starten</button>
      ) : (
        <>
          <AufgabeKomponente
            num1={aufgaben[aktuelleAufgabe].num1}
            num2={aufgaben[aktuelleAufgabe].num2}
            onAnswerSubmit={handleAnswerSubmit}
          />
          {letzteAufgabe && (
            <>
              {letzteAufgabe.correctResult !== letzteAufgabe.userResult ? (
                <div className="fehler-meldung">
                  <p>Falsches Ergebnis! {letzteAufgabe.num1} + {letzteAufgabe.num2} = {letzteAufgabe.correctResult}, Deine Eingabe: {letzteAufgabe.userResult}</p>
                </div>
              ) : (
                <div className="richtig-meldung">
                  <p>Richtige Antwort: {letzteAufgabe.num1} + {letzteAufgabe.num2} = {letzteAufgabe.correctResult}</p>
                </div>
              )}
            </>
          )}
          <StatistikKomponente statistik={statistik} />
        </>
      )}
    </div>
  );
};

export default App;
