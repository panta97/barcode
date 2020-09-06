import React, { useState } from 'react';
import './App.css';
import './btngroup.css';
import './modal.css';
import imgType1 from './img/type1.jpg';
import imgType2 from './img/type2.jpg';
import imgType3 from './img/type3.jpg';
import CSVReader from 'react-csv-reader';
import Barcode from './barcode';
import Barcode2 from './barcode2';
import Productqq from "./productqq";


function App() {

  const [inputKey, setInputKey] = useState('22');

  const [labelsUniq, setLabelsUniq] = useState([]);
  const [labels, setLabels] = useState([]);
  const [quantity, setQuantity] = useState(0);

  const [filename, setFilename] = useState('');

  const [bcType, setBcType] = useState(1);
  const [bt1Active, setBt1Active] = useState(true);
  const [bt2Active, setBt2Active] = useState(false);
  const [bt3Active, setBt3Active] = useState(false);

  const [modalActive, setModalActive] = useState(false);

  const [validCode, setValidCode] = useState(true);

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

        // Helper property quantity in memory for modal
        this.qttInMem = Number(quantity);

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

  const updateQuantities = (labelsUniq) => {
    let labelsQ = [];
    for(let i = 0; i< labelsUniq.length; i++) {
      let label = Object.assign({}, labelsUniq[i]);
      while(label.quantity > 0) {
        labelsQ.push(label);
        label.quantity -= 1;
      }
    }
    return labelsQ;
  }

  const getData = (data, fileInfo) => {

    let lblType = ''
    if (data[0].length === 9)
      lblType = 'INGRESAR'
    else if (data[0].length === 7)
      lblType = 'REPO-CON-ATTR'
    else if (data[0].length === 6)
      lblType = 'REPO-SIN-ATTR'

    // update labels unique
    let labels = getLabel(data, lblType);

    // check excel code format
    let validCode = correctCodeFormat(labels, fileInfo.name);
    if (!validCode) labels = [];

    setValidCode(prev => validCode);

    // must be immutable
    setLabelsUniq(labels);

    // set quantities
    let labelsQ = updateQuantities(labels);

    setQuantity(prevQuantity => labelsQ.length);
    // must be immutable
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

  const showModal = () => {
    setModalActive(prev => true);
  };
  const hideModal = () => {
    setModalActive(prev => false);
  };

  const updateQqsInMem = (code, qqs) => {
    let newLabelsqq = labelsUniq.map(label => {
      // min value 0
      // max value 999
      if(!qqs) qqs = 0;
      if(qqs >= 999) qqs = 999;
      if(label.code === code) label.qttInMem = qqs;
      return label;
    });
    setLabelsUniq(prev => newLabelsqq);
  };

  const cancelQqs = () => {
    hideModal();
    let newLabelsqq = labelsUniq.map(label => {
      label.qttInMem = label.quantity;
      return label;
    });
    setLabelsUniq(prev => newLabelsqq);
  };

  const confirmQqs = () => {
    hideModal();
    let newLabelsqq = labelsUniq.map(label => {
      label.quantity = label.qttInMem;
      return label;
    });
    setLabelsUniq(prev => newLabelsqq);

    // set quantities
    let labelsQ = updateQuantities(newLabelsqq);
    setQuantity(prevQuantity => labelsQ.length);
    // must be immutable
    setLabels(prevLabels => labelsQ);
  };

  const correctCodeFormat = (lblsUniq, filename) => {
    if (filename === '') return true;
    for(let i=0; i < lblsUniq.length; i++) {
      if(/\d\.\d{5}E\+12/.test(lblsUniq[i].code)) {
        return false;
      }
    }
    return true;
  }

  const closeErrorModal = () => {
    setValidCode(prev => true);
  }

  return (
    <div>
      <div className="top-header">
        <div className="header">
          <div className="col-1">
            {/* btn CHOOSE FILE */}
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

            {/* btn QUANTITIES */}
            <button
              className="btn-modal"
              onClick={showModal}
              disabled={filename === "" ? true : false}
            >
              Cantidades
            </button>
          </div>
          <div className="col-2">
            <div className="btn-group">
              <button
                className={bt1Active ? "btn-bctype active" : "btn-bctype"}
                onClick={setActiveB1}
              >
                <img src={imgType1} alt="" />
              </button>
              <button
                className={bt2Active ? "btn-bctype active" : "btn-bctype"}
                onClick={setActiveB2}
              >
                <img src={imgType2} alt="" />
              </button>
              <button
                className={bt3Active ? "btn-bctype active" : "btn-bctype"}
                onClick={setActiveB3}
              >
                <img src={imgType3} alt="" />
              </button>
            </div>
          </div>
        </div>
        <h1 className="lbl-total">Etiquetas: {quantity}</h1>
      </div>
      {htmlType}

      {/* modal html */}
      <div
        className={modalActive ? "modal display-block" : "modal display-none"}
      >
        <section className="modal-qq">
          <div className="t-top">
            <button className="close-modal" tabIndex="-1" onClick={cancelQqs}>
              &times;
            </button>
          </div>
          <table className="t-lbls">
            <thead>
              <tr>
                <th className="t-code">Código</th>
                <th className="t-desc">Descripción</th>
                <th className="t-attr">Attr</th>
                <th className="t-fa-code">C. Fab</th>
                <th className="t-quantity">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {labelsUniq.map((label, i) => (
                <Productqq
                  code={label.code}
                  desc={label.desc}
                  attr={label.attr}
                  mCode={label.mCode}
                  qttInMem={label.qttInMem}
                  onChange={updateQqsInMem}
                  key={i}
                />
              ))}
            </tbody>
          </table>
          <div className="bottom-btns">
            <button className="btn btn-success" onClick={confirmQqs}>
              Aceptar
            </button>
          </div>
        </section>
      </div>

      {/* modal error */}
      <div className={validCode ? "modal display-none" : "modal display-block"}>
        <div className="modal-error">
          <p className="text-error">ERROR de formato: 4.55395E+12</p>
          <p className="text-error">Volver a cargar</p>
          <div className="bottom-btns">
            <button className="btn btn-danger" onClick={closeErrorModal}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
