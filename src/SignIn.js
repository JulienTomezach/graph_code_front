import React, { useState, useEffect, useCallback, useRef } from 'react';
import  stylesLogin from './Login.module.css';
import  styles from './SignIn.module.css';
import  stylesLanding from './Landing.module.css';
import './App.css';
import axios from './axios_utils';
  import {
  Link,
  useParams
} from "react-router-dom";
import Logo from "./components/Logo"

function SignIn(props) {

	 let [subscribed, setSubscribed] = useState(false)
	 let [displayErrorDesc, setDisplayErrorDesc] = useState(false)

			// put that in back
	const errorMessageComponent =  (password, username) => {
		let badPassword = password.length < 8 || password.match(/[0-9]+/) === null || password.match(/[^A-Za-z0-9]/) === null
		let badUsername = username.match(/[\s]+/) !== null
		let msg = ''
		if(badPassword) msg += 'The password must be at least 8 characters, with one or more numbers and special characters'
		if(badUsername) msg += 'The username must be space free'
			// check no space in username
		return (<div className={styles.ErrorMessage}>{msg}</div>)
	}

	const sendSignIn = async () => {
		// email, description
		let email = document.getElementById("email_input").value
		let description = document.getElementById("text_beta_user").value
		if(description.length === 0){
			setDisplayErrorDesc(true)
		}else{
			setDisplayErrorDesc(false)
		}
		if(email.length > 0 && description.length > 0){
			    let response = await axios.put(`sign_in`, {email, description});
			    if(response.status === 200){
			    		setSubscribed(true)
			    }else{
			    	// let {message} = response.data
			    	// do something
			    }
		}
	}
	let subscribedComp = () => {
		return subscribed ? (<div>
			You are all set. We sent you an email.
		</div>) : null
	}

	let erroDescComp = () => {
		return displayErrorDesc ? (<div style={{color: 'red'}}>
			But do tell us a bit about yourself ;)
		</div>) : null
	}

	let matter = " subscription"
	let question0 = "Some (optional) questions:"
	let question1 = "For what kind of business logic you would like to use Explicit ? (roughly)"
	let question2 = "What is the size of your company/ dev team ?"
	let question3 = "Did you ever find hard to get/modify the business logic of a feature, on your own or as a team ?"
	let question4 = "Did you try the live demo ?"

					// <input placeholder="Password" id="password_input" type="password" className={`Input`} />
					// <div className={`${styles.TextParent}`}>
	return (
		<div className={stylesLanding.LandingParent}>
			<div className={stylesLanding.Landing }>
		<div className={stylesLanding.Header} style={{marginTop: '5px'}}>
					<Logo/>
					<div className={styles.Matter}><span style={{fontSize: '25px'}}>&#127881;</span><span style={{marginLeft: '10px',marginRight: '10px'}}>
					<span style={{color: 'purple'}}>Alpha</span>{matter}</span><span style={{fontSize: '25px'}}>&#127881;</span></div>
			<div className={styles.Demo}>Try Demo</div>
		</div>
				<div className={styles.Card}>
					<input className={`Input`} style={{width: '250px'}} placeholder="Professional email (ideally)" id="email_input" type="text"  />
						<div > <span style={{fontSize: '25px', marginLeft: '3px',marginRight: '3px'}}>&#129488;</span> {question0}</div>
						<div className={styles.Question} >{question1}</div>
						<div className={styles.Question} >{question2}</div>
						<div className={styles.Question} >{question3}</div>
						<div className={styles.Question} >{question4}</div>
						<textarea placeholder="Type here" className={styles.TextArea} id="text_beta_user" rows="20" cols="60"></textarea>
					<div style={{marginTop: '10px' }}> Thank you ! </div>
					<div onClick={sendSignIn} className={`${stylesLogin.GoButton}`} style={{marginTop: '10px' }}>Sign in</div>
					{subscribedComp()}
					{erroDescComp()}
				</div>
			</div>
		</div>
		)
}



export default SignIn;