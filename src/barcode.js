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

  const getmCode = (mCode) => {
    if (typeof mCode !== 'undefined') {
      return mCode.substring(0, 13);
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
    <div class="label">
      <div class="top">
        <p class="align-center price">S/. {getPrice(props.children.price)}</p>
        <p class="align-center points">
          o {Math.round(props.children.price / 0.04)} Puntos
        </p>
      </div>
      <div class="bottom">
        <div class="left-bottom">
          <div class="left-bottom-desc">
            <p class="align-center desc">{props.children.desc}</p>
          </div>
          <div class="left-bottom-size">
            <p class="align-center">T/. {props.children.size}</p>
          </div>
        </div>
        <div class="right-bottom">
          <p class="align-center mcode">
            {getmCode(props.children.mCode)}
          </p>
          <p class="align-center code">{formatedCode}</p>
          <div class="qr-code">
            <QRCode
              value={formatedCode}
              size={110}
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
