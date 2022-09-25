import React from "react";
import * as XLSX from "xlsx";
import { usePostContext } from "../context/postContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
const AdminTable = ({ setShowAdminBoard }) => {
  let items = [];
  let listInput = [];
  const { addItems, postState, deleteItems, getItem, updateItems } =
    usePostContext();

  const readExcel = (file) => {
    const name = file.name.substring(0, file.name.length - 5) + "admin";
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      let isFile = true;
      for (let i = 0; i < d.length; i++) {
        if (
          !d[i].ARcode ||
          !d[i].Analysis_start ||
          !d[i].EHC_code ||
          !d[i].EUVNHC_code ||
          !d[i].Max_validationDate ||
          !d[i].PARAMETER_EN_NAME ||
          !d[i]["PASS/FAIL"] ||
          !d[i].TATstartdate ||
          !d[i].parametercode ||
          !d[i].samplePartnerCode ||
          !d[i].samplename ||
          !d[i].testcode ||
          !d[i].testname ||
          !d[i].trialnumber ||
          !d[i].unit ||
          (!d[i].numericalValue && d[i].numericalValue !== 0)
        ) {
          isFile = false;
          i = d.length;
        }
      }
      if (!isFile) {
        toast.error("Tệp không đúng định dạng");
      } else {
        addItems(d, name);
      }
    });
  };

  const readFileInput = (file, id) => {
    getItem(id);
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      listInput = d;
      items =
        postState.postItems[
          postState.postItems.findIndex((item) => item.postId === id)
        ].items;

      for (let j = 0; j < items.length; j++) {
        console.log("j", j);
        let cont_seal = "";

        for (let i = 0; i < listInput.length; i++) {
          if (listInput[i]["No."] === 1) {
            cont_seal = listInput[i - 1]["__EMPTY"];
          }
          if (typeof listInput[i]["No."] === "number") {
            listInput[i] = { ...listInput[i], cont_seal };
          }
        }

        for (let i = 0; i < listInput.length; i++) {
          let info = [];
          if (typeof listInput[i]["No."] === "number") {
            items[j] = {
              ...items[j],
              cont: listInput
                .filter(
                  // eslint-disable-next-line no-loop-func
                  (i) =>
                    i["Product name"] &&
                    i["Product name"].trim().replace(/  +/g, " ") ===
                      items[j].samplename
                        .split(",")[1]
                        .trim()
                        .replace(/  +/g, " ")
                )
                .map((item) => item.cont_seal.split("/")[0].trim()),
              seal: listInput
                .filter(
                  // eslint-disable-next-line no-loop-func
                  (i) =>
                    i["Product name"] &&
                    i["Product name"].trim().replace(/  +/g, " ") ===
                      items[j].samplename
                        .split(",")[1]
                        .trim()
                        .replace(/  +/g, " ")
                )
                .map((item) => item.cont_seal.split("/")[1].trim()),
              info: info,
            };
          }

          listInput
            .filter(
              // eslint-disable-next-line no-loop-func
              (i) =>
                i["Product name"] &&
                i["Product name"].trim().replace(/  +/g, " ") ===
                  items[j].samplename.split(",")[1].trim().replace(/  +/g, " ")
            )
            .map((item) =>
              info.push({
                contNumber: item.cont_seal.split("/")[0].trim(),
                sealNumber: item.cont_seal.split("/")[1].trim(),
                boxNumber: item["Number of"],
                packageNumber: item.Quantity,
                netWeight: item["Net Weight"],
                grossWeight: item["Gross Weight"],
              })
            );
        }

        if (j === items.length - 1) {
          updateItems(items, id);
        }
      }
    });
  };

  const handleDelete = async (id) => {
    const dataDelete = await deleteItems(id);
    if (dataDelete.success) {
      toast.success("Xóa thành công");
    } else {
      toast.success("Lỗi");
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setShowAdminBoard(false);
        }}
        className="btn-close"
      >
        <i className="fa-solid fa-x icon-close"></i>
      </button>
      <input
        className="file-input"
        type="file"
        id="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
      <label className="input-file" htmlFor="file">
        Chọn tệp
      </label>
      {postState.postItems.filter(
        (item) =>
          item.postName.substring(
            item.postName.length - 5,
            item.postName.length
          ) === "admin"
      ).length > 0 && (
        <div className="pd-2">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên file</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {postState.postItems
                .filter(
                  (item) =>
                    item.postName.substring(
                      item.postName.length - 5,
                      item.postName.length
                    ) === "admin"
                )
                .map((item, index) => (
                  <tr
                    key={index}
                    className={` ${!item.items.every((item) => item.cont) && ""}
                    ${
                      item.items.find(
                        (item) => item.cont && item.cont.length === 0
                      ) && "error"
                    }
                    ${
                      item.items.every(
                        (item) => item.cont && item.cont.length > 0
                      ) && "success"
                    }
                    }`}
                  >
                    <td>{index + 1}</td>
                    <td className="pointer">
                      {item.postName.substring(0, item.postName.length - 5)}
                    </td>
                    <td>
                      <input
                        className="file-input"
                        type="file"
                        id={`fileInput${index}`}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          readFileInput(file, item.postId);
                        }}
                      />
                      {
                        <label
                          className="input-file-data"
                          htmlFor={`fileInput${index}`}
                        >
                          Chọn tệp
                        </label>
                      }
                    </td>
                    <td>
                      {!item.items.every((item) => item.cont) && (
                        <Link to={`/${item.postId}`}>Xem thông tin</Link>
                      )}
                      {item.items.find(
                        (item) => item.cont && item.cont.length === 0
                      ) && <h2>Lỗi</h2>}
                      {item.items.every(
                        (item) => item.cont && item.cont.length > 0
                      ) && <Link to={`/${item.postId}`}>Xem thông tin</Link>}
                    </td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item.postId)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminTable;
