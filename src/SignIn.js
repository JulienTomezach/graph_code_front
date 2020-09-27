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
import TryDemo from "./components/TryDemo";

function SignIn(props) {

	 let [subscribed, setSubscribed] = useState(false)
	 let [displayErrorDesc, setDisplayErrorDesc] = useState(false)
	 let [badForm, setBadForm] = useState(false)
	 let [badEmail, setBadEmail] = useState(false)
	 const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
		let username = document.getElementById("name_input").value
		if(description.length === 0 ){
			setDisplayErrorDesc(true)
			return
		}else{
			setDisplayErrorDesc(false)
		}
		if(email.length > 0 && description.length > 0 && username.length > 0 ){
				setBadForm(false)
				if(email.match(EMAIL_REGEX) === null){
					setBadEmail(true)
					return
				}
				setBadEmail(false)
			    let response = await axios.put(`sign_in`, {email, description, name: username});
			    if(response.status === 200){
			    		setSubscribed(true)
			    		setTimeout(() => (window.location.href = '/landing'), 3000);
			    }else{
			    	// let {message} = response.data
			    	// do something
			    }
		}else{
			setBadForm(true)
		}
	}
	let subscribedComp = () => {
		return subscribed ? (<div style={{marginTop: '10px' }}>
			You are all set. We sent you an email.
		</div>) : null
	}

	let genericError = () => {
		if(badEmail) return (<div style={{color: 'red', marginTop: '3px'}}>
			Your email is not correct
		</div>)
		else if(badForm) return (<div style={{color: 'red', marginTop: '3px'}}>
			you need to fill in the form (email, username and the note)
		</div>)
		 else return erroDescComp()
	}

	let erroDescComp = () => {
		return displayErrorDesc ? (<div style={{color: 'red', marginTop: '3px'}}>
			But do answer something <span style={{fontSize: '15px', marginLeft: '3px',marginRight: '3px'}}>&#128591;</span>
		</div>) : null
	}

	let matter = " subscription"
	let question0 = "Some (optional) questions:"
	let question1 = "For what kind of business logic you would like to use Explicit ? (roughly)"
	let question2 = "What is the size of your company/ dev team ?"
	let question4 = "Did you try the live demo ?"

	// add a name input here.
	//<input className={`Input`} style={{width: '250px'}} placeholder="username" id="name_input" type="text"  />
	return (
		<div className={stylesLanding.LandingParent}>
			<div className={stylesLanding.Landing }>
		<div className={stylesLanding.Header} style={{marginTop: '5px'}}>
					<Logo/>
					<div className={styles.Matter}><span style={{fontSize: '25px'}}>&#127881;</span><span style={{marginLeft: '10px',marginRight: '10px'}}>
					<span style={{color: 'purple'}}>Alpha</span>{matter}</span><span style={{fontSize: '25px'}}>&#127881;</span></div>
					<TryDemo newTab={true}/>
		</div>
				<div className={styles.Card}>
						<input className={`Input`} style={{width: '250px'}} placeholder="Professional email (ideally)" id="email_input" type="text"  />
						<input className={`Input`} style={{width: '250px'}} placeholder="username" id="name_input" type="text"  />
						<div> <span style={{fontSize: '15px', marginLeft: '3px',marginRight: '3px'}}>&#128584;</span> We won t send you emails except for app operations like checking identity etc.. </div>
						<div > <span style={{fontSize: '25px', marginLeft: '3px',marginRight: '3px'}}>&#129488;</span> {question0}</div>
						<div className={styles.Question} >{question1}</div>
						<div className={styles.Question} >{question2}</div>
						<div className={styles.Question} >{question4}</div>
						<textarea placeholder="Type here" className={styles.TextArea} id="text_beta_user" rows="20" cols="60"></textarea>
					<div style={{marginTop: '10px' }}> Thank you ! </div>
					<div onClick={sendSignIn} className={`${stylesLogin.GoButton}`} style={{marginTop: '10px' }}>Sign in</div>
					{subscribedComp()}
				</div>
					{genericError()}
			</div>
		</div>
		)
}



export default SignIn;