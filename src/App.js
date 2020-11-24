import React, { useState } from 'react';
import './App.css';
import './btngroup.css';
import './modal.css';
import './animation.css';
import imgType1 from './img/type1.jpg';
import imgType2 from './img/type2.jpg';
import imgType3 from './img/type3.jpg';
import CSVReader from 'react-csv-reader';
import QttyModal from './Modals/QttyModal/QttyModal';
import Labels from './Label/Labels';
import Loader from './Loader/Loader';
import correctCodeFormat from './Modals/ErrorModal/errorHandler';
import getLabel from './utils/label';
import ErrorModal from './Modals/ErrorModal/ErrorModal';


function App() {

  const [inputKey, setInputKey] = useState('22');

  const [labelsUniq, setLabelsUniq] = useState([]);

  const [filename, setFilename] = useState('');

  const [bcType, setBcType] = useState(1);
  const [bt1Active, setBt1Active] = useState(true);
  const [bt2Active, setBt2Active] = useState(false);
  const [bt3Active, setBt3Active] = useState(false);

  const [modalActive, setModalActive] = useState(false);

  const [validCode, setValidCode] = useState(true);
  const [errorMsgs, setErrorMsgs] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loaderType, setLoaderType] = useState(1);


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
    const error = correctCodeFormat(labels, fileInfo.name);
    if (!error.validCode) labels = [];

    setValidCode(error.validCode);
    setErrorMsgs(error.msgs);

    const randomString = Math.random().toString(36);
    setInputKey(randomString);

    setFilename(fileInfo.name);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLabelsUniq(labels);
    }, 1);
  };

  const setActiveB1 = () => {
    setBt2Active(false);
    setBt3Active(false);
    setBt1Active(true);
    setIsLoading(true);
    setLoaderType(1);
    setTimeout(() => {
      setIsLoading(false);
      setBcType(1);
    }, 1);
  }

  const setActiveB2 = () => {
    setBt1Active(false);
    setBt3Active(false);
    setBt2Active(true);
    setIsLoading(true);
    setLoaderType(2);
    setTimeout(() => {
      setIsLoading(false);
      setBcType(2);
    }, 1);
  }

  const setActiveB3 = () => {
    setBt1Active(false);
    setBt2Active(false);
    setBt3Active(true);
    setIsLoading(true);
    setLoaderType(3);
    setTimeout(() => {
      setIsLoading(false);
      setBcType(3);
    }, 1);
  }

  const showModal = () => {
    setModalActive(true);
  };

  const closeErrorModal = () => {
    setValidCode(true);
    setErrorMsgs([]);
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
        <h1 className="lbl-total">
          Etiquetas: { isLoading ? 'cargando' : labelsUniq.reduce((acc, curr) => acc += curr.qtt, 0)}
          {isLoading ? (<div className='lds-dual-ring'></div>) : null}
        </h1>
      </div>

      {isLoading ?
        <Loader loaderType={loaderType}/> :
        <Labels bcType={bcType} labelsUniq={labelsUniq}/> }

      {/* modal html */}
      {modalActive ?
      <QttyModal
        labels={labelsUniq}
        setLabelsUniq={setLabelsUniq}
        setModalActive={setModalActive}
        modalActive={modalActive}
        setIsLoading={setIsLoading}/>
      : null}

      {/* modal error */}
      {validCode ?
      null :
      <ErrorModal
        errorMsgs={errorMsgs}
        closeErrorModal={closeErrorModal} /> }
    </div>
  );
}

export default App;
