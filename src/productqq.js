import React from "react";

function Productqq({ code, desc, attr, mCode, qttInMem, onChange }) {

  return (
    <tr>
      <td className="t-code">{code}</td>
      <td className="t-desc">{desc}</td>
      <td className="t-attr">{attr === '' ? '-' : attr}</td>
      <td className="t-fa-code">{mCode === '' ? '-' : mCode}</td>
      <td className="t-quantity">
        <input
          className="inp-quantity"
          type="number"
          min="0"
          max="999"
          value={qttInMem}
          onChange={(event) => onChange(code, event.target.valueAsNumber)}
        />
      </td>
    </tr>
  );
}

export default Productqq;
