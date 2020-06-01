import React, { useState } from 'react';
import './App.css';
import CSVReader from 'react-csv-reader';
import Barcode from './barcode';


function App() {
  let barcodes = [];

  // Debugging code
  const debug = false;

  const getDataDebug = (data) => {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i]['total']; j++) {
        var elementDetails = {
          price : data[i]['price'],
          desc : data[i]['desc'],
          size : data[i]['size'],
          mCode : data[i]['mCode'],
          code : data[i]['code'],
          type : data[i]['type']
        }
        barcodes.push(elementDetails);
      }
    }
  };

  if (debug) {
    let data = require('./tickets.json');
    getDataDebug(data);
  }
  // end


  const [labels, setLabels] = useState(barcodes);
  const [quantity, setQuantity] = useState(barcodes.length);

  const getData = (data) => {
    var barcodes = []

    for (let i = 1; i < data.length; i++) {
      for (let j = 0; j < Number(data[i][5]); j++) {

        const element = data[i];

        var elementDetails = {
          price : element[0],
          desc : element[1],
          size : element[2],
          mCode : element[3],
          code : element[4],
          type : element[6]
        }
        barcodes.push(elementDetails);

      }
    }

    setQuantity(prevQuantity => barcodes.length);
    setLabels(prevLabels => barcodes);

  };

  return (
    <div>
      <CSVReader onFileLoaded={(data, _) => getData(data)} />

      <div id="no-print">
      <button onClick={() => window.print()}>PRINT</button>
      </div>

      <h1>Etiquetas: {quantity}</h1>

      <div id="section-to-print">
        {
        labels.map((label, index) => (
          <Barcode key={index} label={label} id={index}></Barcode>
        ))}
      </div>
    </div>

  );
}

export default App;
