import React, { useContext, useState } from "react";

import { UserContext } from "../context/UserContext";
import ErrorMessage from "../components/ErrorMessage";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email, hashed_password: password})
        };

        const response = await fetch("/api/users", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail)
        } else {
            setToken(data.access_token)
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length > 8) {
            submitRegistration();
        } else {
            setErrorMessage("Ensure that the passwords match and greater than 8 characters.")
        }
    };

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Register</h1>
                <div className="field">
                    <label className="label">Email address</label>
                    <div className="control">
                        <input type="email"
                        placeholder="Enter email"
                        value={email} onChange={ (e) => setEmail(e.target.value)}
                        className="input"
                        required/>
                    </div>
                    <label className="label">Password</label>
                    <div className="control">
                        <input type="password"
                        placeholder="Enter password"
                        value={password} onChange={ (e) => setPassword(e.target.value)}
                        className="input"
                        required/>
                    </div>
                    <label className="label">Confirm password</label>
                    <div className="control">
                        <input type="password"
                        placeholder="Enter password"
                        value={confirmationPassword} onChange={ (e) => setConfirmationPassword(e.target.value)}
                        className="input"
                        required/>
                    </div>
                </div>
                <ErrorMessage message={errorMessage} />
                <br />
                <button className="button is-primary" type="submit">Register</button>
            </form>
        </div>
    )
};

export default Register;
