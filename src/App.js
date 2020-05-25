import React, { useState } from 'react';
import './App.css';
import CSVReader from 'react-csv-reader'
import Barcode from './barcode'




function App() {


  const [labels, setLabels] = useState([]);
  const [quantity, setQuantity] = useState(0);

  const getData = (data) => {
    var barcodes = []

    for (let i = 1; i < data.length; i++) {
      const element = data[i];

      var elementDetails = {
        price : element[0],
        desc : element[1],
        size : element[2],
        mCode : element[3],
        code : element[4]
      }
      barcodes.push(elementDetails);

    }

    setQuantity(prevQuantity => data.length - 1);
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
        labels.map(label => (
          <Barcode>{label}</Barcode>
        ))}
      </div>
    </div>

  );
}

export default App;
