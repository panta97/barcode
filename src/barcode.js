import React from "react";
import QRCode from "qrcode.react";
import MicroQR from "./microQR";
import "./barcode.css";

function Barcode(props) {
  const getPrice = (price) => {
    if (typeof price !== "undefined") {
      return Number(price).toFixed(2);
    } else {
      return "";
    }
  };

  const getCode = (code) => {
    if (typeof code !== "undefined") {
      return code;
    } else {
      return "no code";
    }
  };

  const formatedCode = getCode(props.label.code);

  if (props.label.type === '-1') {
    return (
      <div className="type-one">
        <div className="top">
          <div className="price">S/. {getPrice(props.label.price)}</div>
          <div className="points">
            o {Math.round(props.label.price / 0.04)} Puntos
          </div>
        </div>
        <div className="left-bottom">
          <div className="desc">{props.label.desc}</div>
          <div className="size">T/. {props.label.size}</div>
        </div>
        <div className="right-bottom">
          <div className="m-code">{props.label.mCode}</div>
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
  } else if (props.label.type === '-2') {
    return (
      <div className="type-two">
        <div>
          <div className="price">S/. {getPrice(props.label.price)}</div>
          <div className="micro-qr">
            <div className="qr">
              <MicroQR
                codeType={"microqrcode"}
                value={props.label.code}
                scale={5}
                size={45.5}
                id={`${props.id}-l`}
              ></MicroQR>
            </div>
          </div>
        </div>
        <div>
          <div className="price">S/. {getPrice(props.label.price)}</div>
          <div className="micro-qr">
            <div className="qr">
              <MicroQR
                codeType={"microqrcode"}
                value={props.label.code}
                scale={5}
                size={45.5}
                id={`${props.id}-m`}
              ></MicroQR>
            </div>
          </div>
        </div>
        <div>
          <div className="price">S/. {getPrice(props.label.price)}</div>
          <div className="micro-qr">
            <div className="qr">
              <MicroQR
                codeType={"microqrcode"}
                value={props.label.code}
                scale={5}
                size={45.5}
                id={`${props.id}-r`}
              ></MicroQR>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (props.label.type === '1') {
    return (
      <div className="type-1">
        <div className="container">
        <h2 className="price">S/. {getPrice(props.label.price)}</h2>
        <p className="cat">HOMBRE / POLO / PIONIER</p>
        <p className="fa-code">{props.label.mCode}</p>
        <p className="desc">{props.label.desc}</p>
        <p className="attr">CELESTE - {props.label.size}</p>
        <div className="barcode">
        <MicroQR
                  codeType={"code128"}
                  value={formatedCode}
                  scale={5}
                  size={100}
                  id={`${props.id}-r`}
                ></MicroQR>
        </div>
        <p className="code">{formatedCode}</p>
        </div>
      </div>

    );
  } else if (props.label.type === '2') {
    return (
      <div className="type-2">
      <div className="container">
        <div className="left-side">
          <h2 className="price">S/. {getPrice(props.label.price)}</h2>
          <p className="cat">HOMBRE / POLO / PIONIER</p>
          <p className="fa-code">{props.label.mCode}</p>
          <p className="desc">{props.label.desc}</p>
          <p className="attr">CELESTE - {props.label.size}</p>
        </div>
        <div className="right-side">
          <div className="barcode">
        <QRCode
                value={formatedCode}
                size={50}
                level={"H"}
                renderAs={"svg"}
              ></QRCode>
          </div>
          <p className="code">{formatedCode}</p>
        </div>
      </div>
    </div>
    );
  } else if (props.label.type === '3') {
    return (
      <div className="type-3">
      <div className="container">
            <div>
        <h2 className="price">S/. {getPrice(props.label.price)}</h2>
        <div className="barcode">
        <MicroQR
                codeType={"microqrcode"}
                value={props.label.code}
                scale={24}
                size={100}
                id={`${props.id}-l`}
              ></MicroQR>
        </div>
        <p className="code">{formatedCode}</p>
      </div>
      <div>
        <h2 className="price">S/. {getPrice(props.label.price)}</h2>
        <div className="barcode">
        <MicroQR
                codeType={"microqrcode"}
                value={props.label.code}
                scale={24}
                size={100}
                id={`${props.id}-m`}
              ></MicroQR>
        </div>
        <p className="code">{formatedCode}</p>
      </div>
      <div>
        <h2 className="price">S/. {getPrice(props.label.price)}</h2>
        <div className="barcode">
        <MicroQR
                codeType={"microqrcode"}
                value={props.label.code}
                scale={24}
                size={100}
                id={`${props.id}-r`}
              ></MicroQR>

        </div>
        <p className="code">{formatedCode}</p>
      </div>
      </div>
    </div>
    );
  } else if (props.label.type === '4') {
    return (

  <div class="type-4">
    <div class="container">
    <div class="block">
      <h2 class="price">S/. {getPrice(props.label.price)}</h2>
          <div class="barcode">
          <MicroQR
                  codeType={"code128"}
                  value={formatedCode}
                  scale={5}
                  size={100}
                  id={`${props.id}-l`}
                ></MicroQR>
          </div>
          <p class="code">{formatedCode}</p>
    </div>
    <div class="block">
      <h2 class="price">S/. {getPrice(props.label.price)}</h2>
      <div class="barcode">
      <MicroQR
                  codeType={"code128"}
                  value={formatedCode}
                  scale={5}
                  size={100}
                  id={`${props.id}-m`}
                ></MicroQR>
      </div>
          <p class="code">{formatedCode}</p>
    </div>
    <div class="block">
      <h2 class="price">S/. {getPrice(props.label.price)}</h2>
      <div class="barcode">
      <MicroQR
                  codeType={"code128"}
                  value={formatedCode}
                  scale={5}
                  size={100}
                  id={`${props.id}-r`}
                ></MicroQR>
      </div>
          <p class="code">{formatedCode}</p>
    </div>
  </div>
  </div>



    );
  }
}

export default Barcode;
