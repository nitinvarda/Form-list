import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';

const Form = () => {
    const [data, setData] = useState({
        name: '',
        dob: '',
        country: '',
        resume: ''
    })
    const [status, setStatus] = useState('')
    const [countries, setCountries] = useState([])
    const { name, dob, country, resume } = data

    const change = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    const fileHandler = (e) => {
        setData({
            ...data,
            resume: e.target.files[0]
        })
    }
    const submit = (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        const form = new FormData();
        form.append("resume", resume);
        form.append("name", name);
        form.append("country", country);
        form.append("dob", dob);

        axios.post("/form", form, config)
            .then(res => {

                setStatus(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    if (country.length > 0) {
        var action = (e) => {
            axios.get("/users/" + country)
                .then(res => {

                    setCountries(res.data)
                })
                .catch(err => {
                    console.log(err);
                })
        }

    }




    var suggestion = countries.map((filter, index) => <option key={index} value={filter.name} />)



    return (
        <div className="form">
            <h2 className="d-flex justify-content-center">Form</h2>
            <form onSubmit={submit} className="form-start">
                <div className="form-elem">
                    <label>Name</label>
                    <input type="text" name="name" value={name} onChange={change} />

                </div>
                <div className="form-elem">
                    <label>Date of Birth</label>
                    <input type="date" name="dob" value={dob} onChange={change} />

                </div>
                <div className="form-elem">
                    <label>Country</label>
                    <div>
                        <input type="text" autoComplete="off" value={country} list="datalist" onChange={change} onKeyPress={action} name="country" id="search" />
                        <datalist id="datalist"  >
                            {suggestion}

                        </datalist>
                    </div>

                </div>

                <input type="file" name="resume" onChange={fileHandler} />
                <br />
                <br />
                <button type="submit" className="btn btn-primary form-btn">Submit</button>
            </form>
            {status ? (<h4>{status}</h4>) : (<div></div>)}


        </div>
    );
}

export default Form;
