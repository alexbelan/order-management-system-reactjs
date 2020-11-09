import React, {useState, useEffect, useReducer, useRef} from "react";
import localStorage, { LocalStorage } from "../API/LocalStorage"
import moment from 'moment'
import {Link} from "react-router-dom";

export default function ViewTable() {
    const [order, setOrder] = useState(LocalStorage.getOrder());
    const [firms, setFirms] = useState(LocalStorage.getFirms());
    

    const [editOrder, setEditOrder] = useState({
        index: "",
        id: "",
        time: "",
        comment: "",
        oldATI: "",
        newATI: "",
    })

    const [newFirms, setNewFirms] = useState({
        name_company: "",
        director: {
            name: "",
            surname: "",
            patronymic: "",
        },
        phone_number: "",
    });

    const [indexEditOrder, setIndexEditOrder] = useState(null);
    const isFirms = useRef(true)
    const idSort = useRef(true)
    const timeSort = useRef(true)
    const ATISort = useRef(true)

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    function handleClick() {
        forceUpdate();
    }

    function indexEditOrderСhange(index) {
        setIndexEditOrder(index)
        setEditOrder(() => {
            return{
                index: index,
                id: order[index].id,
                time: order[index].time,
                comment: order[index].comment,
                oldATI: order[index].ATI,
                newATI: order[index].ATI,
            }
        })
    }

    function getATI(e, index) {
        if (typeof firms[e] !== "undefined") {
            isFirms.current = true
        } else {
            isFirms.current = false
        }
        order[index] = {
            id: order[index].id,
            time: order[index].time,
            comment: order[index].comment,
            ATI: e
        }
        setEditOrder(prev => {
            return {
                ...prev,
                newATI: e
            }
        })
    }

    function getTime(e) {
        setEditOrder(prev => {
            return {
              ...prev,
              time: e
            }
        })
    }

    function getComment(e) {
        setEditOrder(prev => {
            return {
              ...prev,
              comment: e
            }
        })
    }

    function getName(e) {
        setNewFirms(prev => {
            return {
              ...prev,
              director: {
                  name: e, 
                  surname: newFirms.director.surname,
                  patronymic: newFirms.director.patronymic,
              }
            }
        })
    }

    function getSurname(e) {
        setNewFirms(prev => {
            return {
              ...prev,
              director: {
                  name: newFirms.director.name, 
                  surname: e,
                  patronymic: newFirms.director.patronymic,
              }
            }
        })
    }

    function getPatronymic(e) {
        setNewFirms(prev => {
            return {
              ...prev,
              director: {
                  name: newFirms.director.name, 
                  surname: newFirms.director.surname,
                  patronymic: e,
              }
            }
        })
    }

    function getNameCompany(e) {
        setNewFirms(prev => {
            return {
              ...prev,
              name_company: e
            }
        })
    }

    function getPhoneNumber(e) {
        setNewFirms(prev => {
            return {
              ...prev,
              phone_number: e
            }
        })
    }

    function checkData() {
        if (editOrder.newATI === "") {
            return alert("Нет ATI")
        }
        if (isFirms.current === false) {
            if (newFirms.name_company === "") {
                return alert("Нет названия компании")
            }
            if (newFirms.director.name === "") {
                return alert("Нет имени у перевозчика")
            }
            if (newFirms.director.surname === "") {
                return alert("Нет фвмилии у перевозчика")
            }
            if (newFirms.director.patronymic === "") {
                return alert("Нет отчества у перевозчика")
            }
            if (newFirms.phone_number === "") {
                return alert("Нет номера телефона у перевозчика")
            }
        }
        return true;
    }

    function saveEditOrder() {
        if(checkData() === true) {
            let index = editOrder.index
            let ATI = editOrder.newATI
            order[index] = {
                id: editOrder.id,
                time: editOrder.time,
                comment: editOrder.comment,
                ATI: ATI,
            }
            setEditOrder(() => {
                return {
                    index: "",
                    id: "",
                    time: "",
                    comment: "",
                    oldATI: "",
                    newATI: "",
                }
            })
            LocalStorage.saveOrder(order);
            if (isFirms.current === false) {

                setFirms(prev => {
                    let firms = {
                        ...prev,
                        [ATI]: {
                            name_company: newFirms.name_company,
                            director: `${newFirms.director.surname} ${newFirms.director.name} ${newFirms.director.patronymic}`,
                            phone_number: newFirms.phone_number,
                        }
                    }
                    setNewFirms(() => {
                        return {
                            name_company: "",
                            director: {
                                name: "",
                                surname: "",
                                patronymic: "",
                            },
                            phone_number: "",
                        }
                    })
                    isFirms.current = true
                    LocalStorage.saveFirms(firms)
                    return firms
                })
            }
            setIndexEditOrder(null)
        }
    }

    function cancelEditOrder() {
        order[editOrder.index] = {
            id: order[editOrder.index].id,
            time: order[editOrder.index].time,
            comment: order[editOrder.index].comment,
            ATI: editOrder.oldATI
        }
        setEditOrder(() => {
            return {
                index: "",
                id: "",
                time: "",
                comment: "",
                oldATI: "",
                newATI: "",
            }
        })
        setIndexEditOrder(null)
    }

    function deleteOrder(index) {
        setOrder(() => {
            let newOrders = order.filter((item, key) => key !== index)
            LocalStorage.saveOrder(newOrders)
            return newOrders
        })
    } 

    function sortIdOrder() {
        if (idSort.current === true) {
            setOrder(order.sort((a, b) => +a.id < +b.id ? 1 : -1))
            idSort.current = false 
        } else {
            setOrder(order.sort((a, b) => +a.id > +b.id ? 1 : -1))
            idSort.current = true
        }
        handleClick()
    }

    function sortTimeOrder() {
         if (timeSort.current === true) {
            setOrder(order.sort((a, b) => new Date(a.time) < new Date(b.time) ? 1 : -1))
            timeSort.current = false 
        } else {
            setOrder(order.sort((a, b) => new Date(a.time) > new Date(b.time) ? 1 : -1))
            timeSort.current = true
        }
        handleClick()
    }

    function sortATIOrder() {
        if (ATISort.current === true) {
            setOrder(order.sort((a, b) => +a.ATI < +b.ATI ? 1 : -1))
            ATISort.current = false 
        } else {
            setOrder(order.sort((a, b) => +a.ATI > +b.ATI ? 1 : -1))
            ATISort.current = true
        }
        handleClick()
    }

    function renderTable() {
        let table = []
        order.map((val, index) => {
            table.push(
                <tr>
                    {indexEditOrder === index ?
                        <>
                            <td>{val.id}</td>
                            <td><input className="form-control" type="datetime-local" id="date" onChange={e => getTime(e.target.value)} value={editOrder.time} /></td>
                            {isFirms.current === false ?
                                <>
                                    <td><input className="form-control" type="text" id="nameCompany" onChange={e => getNameCompany(e.target.value)} value={newFirms.name_company} /></td>
                                    <td>
                                        <input className="form-control" type="text" placeholder="Фамилия" id="surnameDirector"onChange={e => getSurname(e.target.value)} value={newFirms.director.surname} /><br/>
                                        <input className="form-control" type="text" placeholder="Имя" id="nameDirector" onChange={e => getName(e.target.value)} value={newFirms.director.name} /><br/>
                                        <input className="form-control" type="text" placeholder="Отчество" id="patronymicDirector" onChange={e => getPatronymic(e.target.value)} value={newFirms.director.patronymic} /><br/>
                                    </td>
                                    <td><input className="form-control" type="text" id="phoneNumber" onChange={e => getPhoneNumber(e.target.value)} value={newFirms.phone_number} /></td>
                                </>
                                :
                                <>
                                    <td>{firms[val.ATI].name_company}</td>
                                    <td>{firms[val.ATI].director}</td>
                                    <td>{firms[val.ATI].phone_number}</td>
                                </>
                            }
                            <td><textarea className="form-control" id="comment" onChange={e =>  getComment(e.target.value)} value={editOrder.comment} readonly></textarea></td>
                            <td><input className="form-control" type="text" id="ati" onChange={e => getATI(e.target.value, index)} value={editOrder.newATI} /></td>
                            <td>
                                <button className="btn btn-success" onClick={saveEditOrder}>Сохранить</button>
                                <button className="btn btn-danger" onClick={cancelEditOrder}>Отменить</button>
                            </td>
                        </>
                        :
                        <>
                            <td>{val.id}</td>
                            <td>{moment(val.time).format('YYYY.MM.DD HH:mm')}</td>
                            <td>{firms[val.ATI].name_company}</td>
                            <td>{firms[val.ATI].director}</td>
                            <td>{firms[val.ATI].phone_number}</td>
                            <td>{val.comment}</td>
                            <td><Link to={'/firms/' + val.ATI + '/info'}>{val.ATI}</Link></td>
                            <td>
                                <button className="btn btn-success" onClick={() => indexEditOrderСhange(index)}>Редактировать</button>
                                <button className="btn btn-danger" onClick={() => deleteOrder(index)}>Удалить</button>
                            </td>
                        </>
                    }
                </tr>
                
                )
        })
        return table
    }
    return (
        <div className="container">
            <div className="row">
                <p>Сортировка по: </p>
            </div>

            <div className="row">
                <button className="btn btn-primary col-2" style={{"margin-right": "10px"}} onClick={() => sortIdOrder()}>Номер</button>
                <button className="btn btn-primary col-2" style={{"margin-right": "10px"}} onClick={() => sortTimeOrder()}>Дата</button>
                <button className="btn btn-primary col-2" style={{"margin-right": "10px"}} onClick={() => sortATIOrder()}>ATI</button>
            </div>
            <hr/>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th>Номер</th>
                        <th>Дата получения</th>
                        <th>Фирма</th>
                        <th>ФИО перевозчика</th>
                        <th>Телефон</th>
                        <th>Комментарий</th>
                        <th>ATI</th>
                        <th>Управление</th>
                    </tr>
                </thead>
                {renderTable()}
            </table>
        </div>
    )
}