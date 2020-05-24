import React from "react";
import QRCode from 'qrcode.react';
import './barcode.css';



function Barcode(props) {
  return (
    <div>

      <div id="label">
        <div id="top">
            <p class="align-center price">S/. {props.children.price}.00</p>
            <p class="align-center points">o {props.children.price / 0.04} Puntos</p>
        </div>
        <div id="bottom">
            <div id="left-bottom">
                <div>
                    <p class="align-center desc">{props.children.desc}</p>
                </div>
                <div id="left-bottom-size">
                    <p class="align-center">T/. {props.children.size}</p>
                </div>
            </div>
            <div id="right-bottom">
                <p class="align-center mcode">{props.children.mCode}</p>
                <p class="align-center code">{props.children.code}</p>
                <div id="qr-code">
                  <QRCode value={props.children.code} size={100}></QRCode>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}

export default Barcode;
