import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./home.scss";

import { usePostContext } from "../context/postContext";
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../components/Loading/Loading";
import AdminTable from "../components/AdminTable";
const Home = () => {
  const [codeFile, setCodeFile] = useState("");

  //const [showManagerModal, setShowManagerModal] = useState(false);
  //const [showAdminBoard, setShowAdminBoard] = useState(false);
  const {
    addItems,
    postState,
    getItems,
    deleteItems,
    showAdminBoard,
    setShowAdminBoard,
    showManagerModal,
    setShowManagerModal,
  } = usePostContext();
  const { authState, logoutUser, getAllUser, deleteUser } = useAuthContext();

  const readExcel = (file) => {
    const name = file.name.substring(0, file.name.length - 5);
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

  useEffect(() => {
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    const dataDelete = await deleteItems(id);
    if (dataDelete.success) {
      toast.success("Xóa thành công");
    } else {
      toast.success("Lỗi");
    }
  };

  if (postState.postsLoading) return <Loading />;
  else if (showManagerModal) {
    return (
      <>
        <button
          onClick={() => {
            setShowManagerModal(false);
          }}
          className="btn-close"
        >
          <i className="fa-solid fa-x icon-close"></i>
        </button>

        {authState.users && authState.users.length > 0 && (
          <div className="pd-2 padding-t6">
            <table>
              <thead>
                <tr>
                  <th>Tên người dùng</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {authState.users.map((item, index) => (
                  <tr key={index}>
                    <td>{item.username}</td>
                    <td>
                      <button onClick={() => deleteUser(item._id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="div-center">
          <Link to="/register">
            <button className="btn-register">Thêm người dùng</button>
          </Link>
        </div>
      </>
    );
  } else if (showAdminBoard) {
    return <AdminTable setShowAdminBoard={setShowAdminBoard} />;
  } else if (authState.user && authState.user.role === "admin") {
    return (
      <>
        <button
          onClick={() => {
            setShowManagerModal(true);
            getAllUser();
          }}
          className="btn-manager"
        >
          <i className="fa-solid fa-gear"></i>
        </button>
        <button
          onClick={() => {
            setShowAdminBoard(true);
          }}
          className="btn-admin"
        >
          <i className="fa-solid fa-user"></i>
        </button>
        <button title="Logout" onClick={logoutUser} className="btn-logout">
          <i className="fa-solid fa-right-from-bracket"></i>
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
            ) !== "admin"
        ).length > 0 && (
          <div className="pd-2">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã file</th>
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
                      ) !== "admin"
                  )
                  .map((item, index) => (
                    <tr
                      key={index}
                      className={` ${
                        item.items.every((item) => item.cont) && "success"
                      }`}
                    >
                      <td>{index + 1}</td>
                      <td
                        className="pointer"
                        // onClick={() => {
                        //   navigator.clipboard.writeText(item.postId);
                        //   toast.success(`Copy text: ${item.postId}`);
                        // }}
                      >
                        {item.postName}
                      </td>
                      <td>
                        <Link to={`/${item.postName.split(".").pop()}`}>
                          Xem thông tin
                        </Link>
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
  } else
    return (
      <div className="helmet">
        <button title="Logout" onClick={logoutUser} className="btn-logout">
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
        <form className="login-form">
          <h2>Vui lòng nhập mã file </h2>
          <div className="input-group_login">
            <input
              type="text"
              className="info"
              //placeholder="Tên đăng nhập"
              value={codeFile}
              onChange={(event) => setCodeFile(event.target.value.trim())}
              required
            />
            <label className={`label-text ${codeFile && "valid"}`}>
              Mã file
            </label>
          </div>
          <Link to={`/${codeFile}`}>
            <button className="btn-submit">Xác nhận</button>
          </Link>
        </form>
      </div>
    );
};

export default Home;
