import React, { useState, useEffect } from "react";
import "./productcard.scss";
import excelDateToJSDate from "../../utils/excelDate";
import { usePostContext } from "../../context/postContext";
const ProductCard = ({ value, onClose, items, id }) => {
  const { updateItems } = usePostContext();
  const [info, setInfo] = useState([
    {
      contNumber: "",
      sealNumber: "",
      boxNumber: "",
      packageNumber: "",
      netWeight: "",
      grossWeight: "",
    },
  ]);

  const [qtyInfo, setQtyInfo] = useState(0);

  const handleChangeContNumber = (e, index) => {
    let item = { ...info[index] };

    item.contNumber = e.target.value.trim().replace(/  +/g, " ");
    info[index] = item;
    setInfo([...info]);
  };
  const handleChangeSealNumber = (e, index) => {
    let item = { ...info[index] };

    item.sealNumber = e.target.value.trim().replace(/  +/g, " ");
    info[index] = item;
    setInfo([...info]);
  };
  const handleChangeBoxNumber = (e, index) => {
    let item = { ...info[index] };

    item.boxNumber = e.target.value;
    info[index] = item;
    setInfo([...info]);
  };
  const handleChangePackagesNumber = (e, index) => {
    let item = { ...info[index] };

    item.packageNumber = e.target.value;
    info[index] = item;
    setInfo([...info]);
  };
  const handleChangeNetWeight = (e, index) => {
    let item = { ...info[index] };

    item.netWeight = e.target.value;
    info[index] = item;
    setInfo([...info]);
  };
  const handleChangeGrossWeight = (e, index) => {
    let item = { ...info[index] };

    item.grossWeight = e.target.value;
    info[index] = item;
    setInfo([...info]);
  };
  const handleSubmit = async () => {
    items[value] = {
      ...items[value],
      info,
      cont: info.map((item) => item.contNumber),
      seal: info.map((item) => item.sealNumber),
    };

    updateItems(items, id);
    onClose();
  };
  useEffect(() => {
    items[value].info && setInfo(items[value].info);
    items[value].info && setQtyInfo(items[value].info.length - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="card">
      <div className="card__container">
        <button onClick={onClose}>
          <i className="fa-solid fa-x icon-close"></i>
        </button>
        <h2>{items[value].samplename}</h2>
        <p>
          <strong>PARAMETER_EN_NAME: </strong>
          {items[value].PARAMETER_EN_NAME}
        </p>
        <div className="card__grid">
          <p>
            <strong>EHC_code: </strong>
            {items[value].EHC_code}
          </p>
          <p>
            <strong>EUVNHC_code: </strong>
            {items[value].EUVNHC_code}
          </p>
          <p>
            <strong>samplePartnerCode: </strong>
            {items[value].samplePartnerCode}
          </p>
          <p>
            <strong>ARcode: </strong>
            {items[value].ARcode}
          </p>
          <p>
            <strong>testcode: </strong>
            {items[value].testcode}
          </p>
          <p>
            <strong>testname: </strong>
            {items[value].testname}
          </p>
          <p>
            <strong>TATstartdate: </strong>
            {excelDateToJSDate(items[value].TATstartdate)}
          </p>
          <p>
            <strong>Analysis_start: </strong>
            {excelDateToJSDate(items[value].Analysis_start)}
          </p>
          <p>
            <strong>Max_validationDate: </strong>
            {excelDateToJSDate(items[value].Max_validationDate)}
          </p>
          <p>
            <strong>parametercode: </strong>
            {items[value].parametercode}
          </p>
          <p>
            <strong>numericalValue: </strong>
            {items[value].numericalValue}
          </p>
          <p>
            <strong>unit: </strong>
            {items[value].unit}
          </p>
          {items[value].contNumbers && (
            <p className="text-add">
              <strong>Mã số Công: </strong>
              {items[value].contNumbers}
            </p>
          )}
          {items[value].sealNumbers && (
            <p className="text-add">
              <strong>Mã số Seal: </strong>
              {items[value].sealNumbers}
            </p>
          )}
          {items[value].cardboardNumbers && (
            <p className="text-add">
              <strong>Số thùng: </strong>
              {items[value].cardboardNumbers}
            </p>
          )}
          {items[value].packagesNumbers && (
            <p className="text-add">
              <strong>Số packages: </strong>
              {items[value].packagesNumbers}
            </p>
          )}
          {items[value].netWeights && (
            <p className="text-add">
              <strong>Net Weight: </strong>
              {items[value].netWeights}
            </p>
          )}
          {items[value].grossWeights && (
            <p className="text-add">
              <strong>Gross Weight: </strong>
              {items[value].grossWeights}
            </p>
          )}
        </div>

        {info.map((item, index) => (
          <div key={index} className="input__container">
            <h2>Cont {index + 1}</h2>
            <div className="input__grid">
              <div className="input-group">
                <input
                  type="text"
                  className="info"
                  value={item.contNumber}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  onChange={(e) => handleChangeContNumber(e, index)}
                />
                <label className="label-text">Mã số cont {index + 1}</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="info"
                  value={item.sealNumber}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  onChange={(e) => handleChangeSealNumber(e, index)}
                />
                <label className="label-text">Mã số seal {index + 1}</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="info"
                  value={item.boxNumber}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  onChange={(e) => handleChangeBoxNumber(e, index)}
                />
                <label className="label-text">Số thùng {index + 1}</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="info"
                  value={item.packageNumber}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  onChange={(e) => handleChangePackagesNumber(e, index)}
                />
                <label className="label-text">Số package {index + 1}</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="info"
                  value={item.netWeight}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  onChange={(e) => handleChangeNetWeight(e, index)}
                />
                <label className="label-text">Net weight {index + 1}</label>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  className="info"
                  value={item.grossWeight}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  onChange={(e) => handleChangeGrossWeight(e, index)}
                />
                <label className="label-text">Gross weight {index + 1}</label>
              </div>
            </div>
          </div>
        ))}
        <div className="btns">
          {qtyInfo > 0 && (
            <button
              className="btn-dec-input"
              onClick={() => {
                setQtyInfo(qtyInfo - 1);
                info.pop();
              }}
            >
              <i className="fa-solid fa-minus"></i>
            </button>
          )}
          {Object.values(info[qtyInfo]).every((item) => item !== "") && (
            <button
              className="btn-add-input"
              onClick={() => {
                setQtyInfo(qtyInfo + 1);
                setInfo([
                  ...info,
                  {
                    contNumber: "",
                    sealNumber: "",
                    boxNumber: "",
                    packageNumber: "",
                    netWeight: "",
                    grossWeight: "",
                  },
                ]);
              }}
            >
              <i className="fa-solid fa-plus"></i>
            </button>
          )}
        </div>
        {Object.values(info[qtyInfo]).every((item) => item !== "") && (
          <button className="btn-save" onClick={handleSubmit}>
            Lưu
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
