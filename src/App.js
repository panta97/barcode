import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import CSVReader from 'react-csv-reader'
import Barcode from './barcode'




function App() {


  const [labels, setLabels] = useState([])

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

    setLabels(prevLabels => barcodes)

  };

  return (
    <div>
      <CSVReader onFileLoaded={(data, _) => getData(data)} />
      {labels.map(label => (
        <Barcode>{label}</Barcode>
      ))}
    </div>

  );
}

export default App;
