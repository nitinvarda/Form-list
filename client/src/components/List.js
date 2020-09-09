import React, { useState, useEffect } from 'react';
import './List.css';
import axios from 'axios';


const List = () => {
    const [data, setData] = useState([])
    const [dele, setDele] = useState('')
    const [filter, setFilter] = useState('date')
    useEffect(() => {
        axios.get("/users/cat/" + filter)
            .then(res => {

                setData(res.data)
            })
            .catch(err => {
                console.log(err)
            })

    }, [filter, dele])
    const change = (e) => {
        setFilter(e.target.value)
    }
    const del = (e) => {
        axios.post("/delete/" + e.target.id)
            .then(res => {
                setDele(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className="list-start">
            <div className="filter">

                <label>Sort By: </label>
                <select value={filter} onChange={change} name="filter" className="select-filter">
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                </select>



            </div>

            <table className="table table-bordered table-hover table-responsive-sm" style={{ textAlign: "center" }}>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>D.O.B</td>
                        <td>Country</td>
                        <td>Resume</td>
                        <td>Delete</td>
                    </tr>
                </thead>
                <tbody>


                    {data.map(user => {
                        return (

                            <tr>

                                <td>{user.name}</td>
                                <td>{user.dob}</td>
                                <td>{user.country}</td>
                                <td><a href={"http://localhost:5000/pdf/" + user.resume} >{user.name}</a></td>

                                <td><button className="btn btn-danger" onClick={del} id={user._id}>delete</button></td>

                            </tr>


                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default List;
