import React, { useState } from 'react';
import './App.css';
import './btngroup.css';
import imgType1 from './img/type1.jpg';
import imgType2 from './img/type2.jpg';
import imgType3 from './img/type3.jpg';
import CSVReader from 'react-csv-reader';
import Barcode from './barcode';
import Barcode2 from './barcode2';


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

  const [inputKey, setInputKey] = useState('22');

  const [labels, setLabels] = useState(barcodes);
  const [quantity, setQuantity] = useState(barcodes.length);

  const [filename, setFilename] = useState('');


  const [bcType, setBcType] = useState(1);
  const [bt1Active, setBt1Active] = useState(true);
  const [bt2Active, setBt2Active] = useState(false);
  const [bt3Active, setBt3Active] = useState(false);

  const getLabel = (data, csvType) => {
    let labels = [];

    class Label {

      attrPristine(attr) {
        // Some attr are undefined, specially the ones from the migration
        if (!attr) return '';
        // Color: Negro => Negro
        return attr.split(':')[1].trim().toUpperCase();
      }

      currencyFormat(price) {
        return `S/ ${Number(price).toFixed(2)}`;
      }

      constructor(quantity, code, desc, mCode, cats, price, attr){
        this.code = code;
        this.desc = desc;
        this.mCode = mCode;
        this.cats = cats;
        this.price = this.currencyFormat(price);
        this.attr = this.attrPristine(attr);

        // Helper property after setting quantities
        // this property will be 0
        this.quantity = Number(quantity);
      }

      addAttr(attr) {
        this.attr += ` - ${this.attrPristine(attr)}`;
      }
    }


    if (csvType === 'INGRESAR') {
      // i starts at 1 to skip the headers
      // TEMP data.length - 1 because last row length is 1
      for(let i=1; i<data.length-1; i++) {
        const row = data[i];
        /*
        row[2] => QUANTITY
        row[3] => CODE
        row[4] => DESCRIPCION
        row[5] => MANUFACTURE CODE
        row[6] => CATEGORIES
        row[7] => PRICE
        row[8] => ATTRIBUTE
        */
      if(row.slice(0,8).join('') === '') {
        // Get last pushed item
        labels[labels.length-1].addAttr(row[8]);
        } else {
          labels.push(new Label(row[2], row[3], row[4], row[5], row[6], row[7], row[8]));
        }
      }
    } else if (csvType === 'REPO-CON-ATTR') {
      // i starts at 1 to skip the headers
      // TEMP data.length - 1 because last row length is 1
      for(let i=1; i<data.length-1; i++) {
        const row = data[i];
        /*
        1 => QUANTITY
        row[1] => CODE
        row[2] => DESCRIPCION
        row[3] => MANUFACTURE CODE
        row[4] => CATEGORIES
        row[5] => PRICE
        row[6] => ATTRIBUTE
        */
      if(row.slice(0,6).join('') === '') {
        // Get last pushed item
        labels[labels.length-1].addAttr(row[6]);
        } else {
          labels.push(new Label(1, row[1], row[2], row[3], row[4], row[5], row[6]));
        }
      }
    } else if (csvType === 'REPO-SIN-ATTR') {
      // i starts at 1 to skip the headers
      // TEMP data.length - 1 because last row length is 1
      for(let i=1; i<data.length-1; i++) {
        const row = data[i];
        /*
        1 => QUANTITY
        row[1] => CODE
        row[2] => DESCRIPCION
        row[3] => MANUFACTURE CODE
        row[4] => CATEGORIES
        row[5] => PRICE
        */
      labels.push(new Label(1, row[1], row[2], row[3], row[4], row[5], ''));
      }
    }

    return labels;
  }

  const getData = (data, fileInfo) => {

    let lblType = ''
    if (data[0].length === 9)
      lblType = 'INGRESAR'
    else if (data[0].length === 7)
      lblType = 'REPO-CON-ATTR'
    else if (data[0].length === 6)
      lblType = 'REPO-SIN-ATTR'

    let labels = getLabel(data, lblType)

    // set quantities
    let labelsQ = [];
    for(let i = 0; i< labels.length; i++) {
      let label = labels[i];
      while(label.quantity > 0) {
        labelsQ.push(label);
        label.quantity -= 1;
      }
    }

    setQuantity(prevQuantity => labelsQ.length);
    setLabels(prevLabels => labelsQ);

    const randomString = Math.random().toString(36);
    setInputKey(prevInputKey => randomString);

    setFilename(prevFilename => fileInfo.name);

  };

  const setActiveB1 = () => {
    setBt2Active(prev => false);
    setBt3Active(prev => false);
    setBt1Active(prev => true);
    setBcType(prev => 1);
  }

  const setActiveB2 = () => {
    setBt1Active(prev => false);
    setBt3Active(prev => false);
    setBt2Active(prev => true);
    setBcType(prev => 2);
  }

  const setActiveB3 = () => {
    setBt1Active(prev => false);
    setBt2Active(prev => false);
    setBt3Active(prev => true);
    setBcType(prev => 3);
  }


  let htmlType;
  if (bcType === 1) {
    htmlType = (
      <div id="section-to-print-type1">
        {labels.map((label, index) => (
          <Barcode key={index} label={label} type={bcType} id={index}></Barcode>
        ))}
      </div>
    );
  } else if (bcType === 2) {
    htmlType = (
      <div id="section-to-print-type2">
        {labels.map((label, index) => (
          <Barcode key={index} label={label} type={bcType} id={index}></Barcode>
        ))}
      </div>
    );
  } else if (bcType === 3) {
    // TO COMPLETE A LABEL
    // [qr] | null | null -> [qr] | [] | []
    let [lblsLeft, lblsMid, lblsRight] = [[], [], []];
    const lblsLen = labels.length; // OPTIMIZING ?
    for (let i = 0; i < lblsLen; i += 3) {
      lblsLeft.push(labels[i]);
      lblsMid.push(i+1 < lblsLen ? labels[i+1] : null);
      lblsRight.push(i+2 < lblsLen ? labels[i+2] : null);
    }

    htmlType = (
      <div id="section-to-print-type2">
        {lblsLeft.map((_, i) => (
          <Barcode2
            key={i}
            lblLeft={lblsLeft[i]}
            lblMid={lblsMid[i]}
            lblRight={lblsRight[i]}
            type={bcType}
            id={i}
          ></Barcode2>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="top-header">
      <div className="header">
        <div className="col-1">
          {/* btn Chose File */}
          <div key={inputKey} className="file-container">
            <CSVReader
              inputId="file-upload"
              onFileLoaded={(data, fileInfo) => getData(data, fileInfo)}
            />
            <div className="mask">{filename}</div>
          </div>

          {/* btn PRINT */}
          <div id="no-print">
            <button onClick={() => window.print()}>PRINT</button>
          </div>
        </div>
        <div className="col-2">
          <div className="btn-group">
            <button
              className={bt1Active ? "btn-bctype active" : "btn-bctype"}
              onClick={setActiveB1}
            >
              <img
                src={imgType1}
                alt=""
              />
            </button>
            <button
              className={bt2Active ? "btn-bctype active" : "btn-bctype"}
              onClick={setActiveB2}
            >
              <img
                src={imgType2}
                alt=""
              />
            </button>
            <button
              className={bt3Active ? "btn-bctype active" : "btn-bctype"}
              onClick={setActiveB3}
            >
              <img
                src={imgType3}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
      <h1 className="lbl-total">Etiquetas: {quantity}</h1>
      </div>

      {htmlType}
    </div>
  );
}

export default App;
