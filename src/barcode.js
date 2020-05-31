import React from "react";
import QRCode from "qrcode.react";
import "./barcode.css";

function Barcode(props) {


  const getPrice = (price) => {
    if (typeof price !== 'undefined') {
      return Number(price).toFixed(2);
    }
    else {
      return '';
    }
  };

  const getCode = (code) => {
    if (typeof code !== 'undefined') {
      return code;
    }
    else {
      return 'no code';
    }
  };

  const formatedCode = getCode(props.children.code);

  return (
      <div className="label">
        <div className="top">
          <div className="price">S/. {getPrice(props.children.price)}</div>
          <div className="points">o {Math.round(props.children.price / 0.04)} Puntos</div>
        </div>
        <div className="left-bottom">
          <div className="desc">{props.children.desc}</div>
          <div className="size">T/. {props.children.size}</div>
        </div>
        <div className="right-bottom">
          <div className="m-code">{props.children.mCode}</div>
          <div className="code">{formatedCode}</div>
          <div className="qr-code">
            <div className="qr">
              <QRCode
                value={formatedCode}
                size={120}
                level={"H"}
                renderAs={"svg"}
              ></QRCode>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Barcode;
