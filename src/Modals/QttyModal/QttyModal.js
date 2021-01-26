import React, { useState } from 'react';
import Productqq from "./Productqq";

function QttyModal({labels, setLabelsUniq, setModalActive, modalActive, setIsLoading}) {
  const llbs = labels.map(lbl => {
    return {
      code: lbl.code,
      desc: lbl.desc,
      attr: lbl.attr,
      mCode: lbl.mCode,
      qtt: lbl.qtt
    }
  });
  const [labelsModal, setLabelsModal] = useState(llbs);


  const handleChangeInput = (code, qqs) => {
    const newLabelsqq = labelsModal.map(label => {
      // min value 0
      // max value 999
      if(!qqs) qqs = 0;
      if(qqs >= 999) qqs = 999;
      if(label.code === code) label.qtt = qqs;
      return label;
    });
    setLabelsModal(newLabelsqq);
  };

  const cancelQqs = () => {
    setModalActive(false);
    const labelsModal = labels.map(lbl => {
      return {
        code: lbl.code,
        desc: lbl.desc,
        attr: lbl.attr,
        mCode: lbl.mCode,
        qtt: lbl.qtt
      }
    });
    setLabelsModal(labelsModal);
  };

  const confirmQqs = () => {
    setModalActive(false);
    const newLabels = labelsModal.map((lbl, i) => {
      labels[i].qtt = lbl.qtt;
      return labels[i];
    });

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLabelsUniq(newLabels);
    }, 1);
  };



  return (
    <div role="dialog"
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
              {labelsModal.map((label, i) => (
                <Productqq
                  code={label.code}
                  desc={label.desc}
                  attr={label.attr}
                  mCode={label.mCode}
                  qttInMem={label.qtt}
                  onChange={handleChangeInput}
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
  )
}

export default QttyModal;
