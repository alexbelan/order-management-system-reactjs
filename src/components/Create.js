import React, {useState, useRef, useEffect} from "react";
import localStorage, { LocalStorage } from "../API/LocalStorage"
import moment from 'moment'
// import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export default function CreateOrder() {
    const [newOrder, setNewOrder] = useState({
        id: "",
        time: "",
        comment: "",
        ATI: ""
    })

    const [newFirms, setNewFirms] = useState({
        name_company: "",
        director: {
            name: "",
            surname: "",
            patronymic: "",
        },
        phone_number: "",
    }) 

    const [order, setOrder] = useState(LocalStorage.getOrder());
    const [firms, setFirms] = useState(LocalStorage.getFirms);

    const id = useRef(LocalStorage.getId())
    const isFirms = useRef(false)

    useEffect(() => {
        id.current++
    }, [order]);

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

    function getATI(e) {
        if (typeof firms[e] !== "undefined") {
            isFirms.current = true
        } else {
            isFirms.current = false
        }
        setNewOrder(prev => {
            return {
              ...prev,
              ATI: e
            }
        })
    }

    function getTime(e) {
        setNewOrder(prev => {
            console.log(e)
            return {
              ...prev,
              time: e
            }
        })
    }

    function getComment(e) {
        setNewOrder(prev => {
            return {
              ...prev,
              comment: e
            }
        })
    }

    function checkData() {
        if (newOrder.ATI === "") {
            return alert("Нет ATI")
        }
        if (isFirms.current === false) {
            if (newFirms.name_company === "") {
                return alert("Нет названия фирмы")
            }
            if (newFirms.director.name === "") {
                return alert("Нет имени у перевозчика")
            }
            if (newFirms.director.surname === "") {
                return alert("Нет фамилии у перевозчика")
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

    function createOrder() {
        let ATI = newOrder.ATI;
        if (checkData() === true) {
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
                    LocalStorage.saveFirms(firms)
                    return firms
                })
            }
            setOrder( (prev) => {
                let order = [
                    {
                        id: id.current,
                        time: newOrder.time,
                        comment: newOrder.comment,
                        ATI: ATI,
                    },
                    ...prev,
                ]
                setNewOrder(() => {
                    return {
                        id: "",
                        time: "",
                        comment: "",
                        ATI: ""
                    }
                })
                LocalStorage.saveOrder(order);
                LocalStorage.saveId(id.current)
                return order
            })
        }
    }

    return (
        <>
            <div className="form container">
                <label for="ati">ATI:</label> <br/>
                <input className="form-control" type="text" id="ati" onChange={e => getATI(e.target.value)} value={newOrder.ATI} required /><br/>
                {isFirms.current === false &&
                    <>
                        <hr/>
                        <h3>Новая фирма:</h3>
                        <h4>ФИО перевозчика:</h4>
                        <label for="surnameDirector">Фамилия:</label><br/>
                        <input className="form-control" type="text" id="surnameDirector"onChange={e => getSurname(e.target.value)} value={newFirms.director.surname} required /><br/>
                        <label for="nameDirector">Имя:</label> <br/>
                        <input className="form-control" type="text" id="nameDirector" onChange={e => getName(e.target.value)} value={newFirms.director.name} required /><br/>
                        <label for="patronymicDirector">Отчество:</label> <br/>
                        <input className="form-control" type="text" id="patronymicDirector" onChange={e => getPatronymic(e.target.value)} value={newFirms.director.patronymic} required /><br/>
                        <label for="nameCompany">Название фирмы:</label> <br/>
                        <input className="form-control" type="text" id="nameCompany" onChange={e => getNameCompany(e.target.value)} value={newFirms.name_company} required /><br/>
                        <label for="phoneNumber">Кониактный телефон:</label> <br/>
                        <input className="form-control" type="text" id="phoneNumber" onChange={e => getPhoneNumber(e.target.value)} value={newFirms.phone_number} required /><br/>
                        <hr/>
                    </>
                }
                
                <label for="date">Дата и время получения заявки от клиента:</label> <br/>
                <input className="form-control" type="datetime-local" id="date" onChange={e => getTime(e.target.value)} value={newOrder.time} required/><br/>
                <label for="comment">Коментарий:</label><br/>
                <textarea className="form-control" rows="5" style={{resize: "none"}} id="comment" onChange={e => getComment(e.target.value)} value={newOrder.comment} readonly></textarea>
                <hr/>
                <button className="btn btn-primary" onClick={createOrder}>Добавить заявку</button>
            </div>
        </>) 
}