import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './Login.module.css';
import  stylesLanding from './Landing.module.css';
import axios from './axios_utils';
import Logo from './components/Logo';
import { withRouter } from "react-router";

function Login(props) {
	const {history} = props;
	
	const sendLogin = async () => {
		let username = document.getElementById("username_input").value
		let password = document.getElementById("password_input").value
		if(username.length > 0 && password.length > 0){
			    let response = await axios.put(`log_in`, {username, password});
			    if(response.status === 200){
			    	history.push('/')
			    }else{
			    	// the message already displays
			    	// let {message} = response.data
			    }
		}
	}

	return (
		<div className={stylesLanding.LandingParent}>
			<div className={stylesLanding.Landing }>
				<div className={styles.Card}>
					<Logo/>
					<input placeholder="Username" id="username_input" type="text" className={`Input ${styles.Element}`} />
					<input placeholder="Password" id="password_input" type="password" className={`Input ${styles.Element}`} />

					<div onClick={sendLogin} className={`${styles.GoButton}`}>Go</div>
				</div>
			</div>
		</div>
		)
}




export default withRouter(Login);