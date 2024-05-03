import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Todo.css";
import * as icons from 'react-bootstrap-icons' 

const Todo = () => {
  const [lists, setLists] = useState([]);
  const [inputChange, setInputChange] = useState("");
  const [updatePopup, setUpdatePopup] = useState(false);
  const [editData, setEditData] = useState("");

  const getApiData = async () => {
    const apiData = await axios.get(
      `https://660a981cccda4cbc75db4a8f.mockapi.io/api/v1/Todoitems`
    );
    setLists(apiData.data);
  };

  useEffect(() => {
    getApiData();
  }, []);

  const inputSubmit = async (e) => {
    e.preventDefault();
    const addData = {
      todo: inputChange,
    };
    try {
      await axios.post(`https://660a981cccda4cbc75db4a8f.mockapi.io/api/v1/Todoitems`,addData)
        .then((res) => alert("TodoItem Added"));
      setInputChange("");
      getApiData();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (id) => {
    await axios.delete(`https://660a981cccda4cbc75db4a8f.mockapi.io/api/v1/Todoitems/` + id);
    alert("deleted successfully");
    getApiData();
  };

  const handleEdit = (id) => {
    const selectedItem = lists.find((item) => item.id === id);
    setEditData(selectedItem);
    setUpdatePopup(true);
  };
  const closebtn = () => {
    setUpdatePopup(false);
  };
  const handleEditedData = async (id) => {
    // console.log(editData.id)
    const updatedItem = {
      todo: editData.todo,
    };
    try {
      await axios.put(`https://660a981cccda4cbc75db4a8f.mockapi.io/api/v1/Todoitems/${id}`,updatedItem);
      setUpdatePopup(false);
      alert("updated successfully");
      getApiData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="outer-container">
        <div className="container">
          <div className="myh1">
            <h1>TODO APP</h1>
          </div>
          <form onSubmit={inputSubmit} className="form-container">
            <input
              type="text"
              placeholder="Enter here"
              value={inputChange}
              onChange={(e) => setInputChange(e.target.value)}
            />
            <button className="addbtn">ADD</button>
          </form>
        </div>
        <div className="table-container">
          <table className="table" >
            <thead>
              <tr>
                <th>To-do-Items</th>
                <th>Buttons</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((list) => {
                return (
                  <tr key={list.id}>
                    <td>{list.todo}</td>
                    <td className="buttons">
                      <button
                        className="editbtn"
                        onClick={() => handleEdit(list.id)}
                      >
                         <icons.PencilSquare/>
                      </button>
                      <button
                        className="deletebtn"
                        onClick={() => handleDelete(list.id)}
                      >
                       <icons.TrashFill/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {updatePopup && (
            <div className="popup-overlay">
              <div className="popupcontent">
                <span className="close" onClick={() => closebtn()}>
                  &times;
                </span>
                <h2 className="myh2">Update Item</h2>
                <input
                  className="popupinput"
                  type="text"
                  value={editData.todo}
                  onChange={(e) =>
                    setEditData({ ...editData, todo: e.target.value })
                  }
                />
                <button
                  onClick={() => handleEditedData(editData.id)}
                  className="updatebtn"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Todo;
