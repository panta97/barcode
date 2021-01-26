import React from 'react';

function ErrorModal({errorMsgs, closeErrorModal}) {
  return (
    <div role="dialog" className='modal display-block'>
        <div className="modal-error">
          <p className="text-error">ERROR</p>
          <table className="t-error">
            <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Error</th>
                </tr>
            </thead>
            <tbody>
                {
                  errorMsgs.map((msg, i) => (
                    <tr key={i}>
                      <td>{msg.code}</td>
                      <td>{msg.desc}</td>
                      <td>{msg.price}</td>
                      <td>{msg.error}</td>
                    </tr>
                  ))
                }
            </tbody>
          </table>
          <div className="bottom-btns">
            <button className="btn btn-danger" onClick={closeErrorModal}>
              Aceptar
            </button>
          </div>
        </div>
      </div>
  );
}

export default ErrorModal;
