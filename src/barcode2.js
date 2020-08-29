import React from "react";
import MicroQR from "./microQR";
import "./barcode.css";

function Barcode2({ lblLeft, lblMid, lblRight, type, id }) {
  let [htmlLeft, htmlMid, htmlRight] = [(<div></div>), (<div></div>), (<div></div>)];

  htmlLeft = (
    <div>
      <h2 className="price">{lblLeft.price}</h2>
      <div className="barcode">
        <MicroQR
          codeType={"microqrcode"}
          value={lblLeft.code}
          scale={24}
          size={100}
          id={`${id}-l`}
        ></MicroQR>
      </div>
      <p className="code">{lblLeft.code}</p>
    </div>
  );

  if (lblMid) {
    htmlMid = (
      <div>
        <h2 className="price">{lblMid.price}</h2>
        <div className="barcode">
          <MicroQR
            codeType={"microqrcode"}
            value={lblMid.code}
            scale={24}
            size={100}
            id={`${id}-m`}
          ></MicroQR>
        </div>
        <p className="code">{lblMid.code}</p>
      </div>
    );
  }

  if (lblRight) {
    htmlRight = (
      <div>
        <h2 className="price">{lblRight.price}</h2>
        <div className="barcode">
          <MicroQR
            codeType={"microqrcode"}
            value={lblRight.code}
            scale={24}
            size={100}
            id={`${id}-r`}
          ></MicroQR>
        </div>
        <p className="code">{lblRight.code}</p>
      </div>
    );
  }

  if (type === 3) {
    return (
      <div className="type-3">
        <div className="container">
          {htmlLeft}
          {htmlMid}
          {htmlRight}
        </div>
      </div>
    );
  }
}

export default Barcode2;
