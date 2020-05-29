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
  const qrSize = 140;

  return (
      <div class="label">
        <div class="top">
          <div class="price">S/. {getPrice(props.children.price)}</div>
          <div class="points">o {Math.round(props.children.price / 0.04)} Puntos</div>
        </div>
        <div class="left-bottom">
          <div class="desc">{props.children.desc}</div>
          <div class="size">T/. {props.children.size}</div>
        </div>
        <div class="right-bottom">
          <div class="m-code">{props.children.mCode}</div>
          <div class="code">{formatedCode}</div>
          <div class="qr-code">
            <div class="qr">
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
