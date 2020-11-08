import React, {useState} from "react";
import { render } from "react-dom";
import {useParams} from "react-router-dom";
import localStorage, { LocalStorage } from "../API/LocalStorage"
import moment from 'moment'

export default function ViewFirm() {
    const { slug } = useParams();
    const [order, setOrder] = useState(LocalStorage.getOrder())
    const [firms, setFirms] = useState(LocalStorage.getFirms())

    function renderTable() {
        let table = []
        order.filter((item) => {
            if (item.ATI === slug) {
                table.push(
                    <tr>
                        <td>{item.id}</td>
                        <td>{moment(item.time).format('YYYY.MM.DD HH:mm')}</td>
                        <td>{item.comment}</td>
                        <td>{item.ATI}</td>
                    </tr>
                )
            }
        })
        return table
    }

    return (
        <div className="container">
            <h1>{firms[slug].name_company}</h1>
            <ul>
                <li>Фирма: {firms[slug].name_company}</li>
                <li>Имя деректора: {firms[slug].director}</li>
                <li>Телефонный номер: {firms[slug].phone_number}</li>
                <li>Код в ATI: {slug}</li>
            </ul>
            <hr/>
            <table className="table">
                <thead className="thead-dark">
                    <tr>
                        <th>Номер</th>
                        <th>Дата получения</th>
                        <th>Комментарий</th>
                        <th>ATI</th>
                    </tr>
                </thead>
                {renderTable()}
            </table>
        </div>
    )
}