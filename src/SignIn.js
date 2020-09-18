import React, { useState, useEffect, useCallback, useRef } from 'react';
import  stylesLogin from './Login.module.css';
import  styles from './SignIn.module.css';
import  stylesLanding from './Landing.module.css';
import axios from './axios_utils'

function SignIn(props) {

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
		let username = document.getElementById("email_input").innerText
		// let password = document.getElementById("password_input").innerText
		// if(username.length > 0 && password.length > 0){
		// 	    let response = await axios.post(`sign_in`, {username, password});
		// 	    if(response.status === 200){
		// 	    	// push history to /
		// 	    }else{
		// 	    	let {message} = response.data
		// 	    	// do something
		// 	    }
		// }
	}
	let matter = "Alpha Subscription"
	let question0 = "Some optional questions:"
	let question1 = "For what kind of business logic you would like to use Explicit ? (roughly)"
	let question2 = "What is the size of your company/ dev team ?"
	let question3 = "Did you ever find hard to get/modify the business logic of a feature, from the code or elsewhere ?"

					// <input placeholder="Password" id="password_input" type="password" className={`Input`} />
	return (
		<div className={stylesLanding.LandingParent}>
			<div className={stylesLanding.Landing }>
				<div className={styles.Card}>
					<div className={`${stylesLogin.Logo}`}>&#931;xplicit</div>
					<div className={styles.Matter}>{matter}</div>
					<input className={`Input`} style={{width: '250px'}} placeholder="Professional email (ideally)" id="email_input" type="text"  />
					<div className={`${styles.TextParent}`}>
						<div className={styles.Question}> </div>
						<textarea id="text_beta_user" rows="20" cols="60"></textarea>
					</div>
					<div> Thank you ! </div>
					<div onClick={sendSignIn} className={`${stylesLogin.GoButton}`}>Sign in</div>
				</div>
			</div>
		</div>
		)
}




export default SignIn;