import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './Login.module.css';


function Login(props) {

	return (
	<div className={styles.LoginParent}>
	<div className={styles.Login}>

		<div className={styles.Header}>
				<div className={styles.Logo}>
					&#931;xplicit
				</div>
				<div className={styles.UpperButton}>Try Demo</div>
		</div>
		<div className={styles.HeaderSpace}>
		</div>
		
		<div className={styles.MainPart}>
			<div className={styles.SubTitleParent}>
				<div className={styles.SubTitle}>
                    The place for your Business
                 </div>   
                 <div className={styles.SubTitle}>
                     and Product Logic 
                 </div>   
                 </div>   
              
		<div className={styles.LoginPart}>
			<div className={styles.Button}>Sign In</div>
		</div>
			
		</div>


		<div className={styles.Features}>
			<div className={styles.Feature}>
			<span className={`material-icons ${styles.Icon}`}>beach_access</span>
			<div className={styles.FeatureText}>
				  <div className={styles.FeatureTitle}>
				  		<span className={styles.ActualFeatureTitle}>Simple</span>
				  </div>
				  <div className={styles.FeatureContent}>
				   	No production code constraints like performance, security or Front-Back communication. <br/>Only the business logic, as simple as it can be.
				   </div>
				</div>
			</div>

			<div className={styles.Feature}>
			<span className={`material-icons ${styles.Icon}`}>code</span>
			<div className={styles.FeatureText}>
				  <div className={styles.FeatureTitle}>
				  		<span className={styles.ActualFeatureTitle}>Still Code</span>
				  </div>
				  <div className={styles.FeatureContent}>
	               So computers can run it, check consistency, properties of the system and more.
				   </div>
				</div>
			</div>
			
              
		</div>
		<div className={`${styles.Features} ${styles.ParentCenter}`}>
		<div className={styles.Feature}>
		<span className={`material-icons ${styles.Icon}`}>polymer</span>
			<div className={styles.FeatureText}>
				  <div className={styles.FeatureTitle}>
				  		<span className={styles.ActualFeatureTitle}>Flexible</span>
				  </div>
				  <div className={styles.FeatureContent}>
	               	Write as much or as little details you want. <br/> The code always runs and gives you valuable feedbacks.
				   </div>
				</div>
			</div>
		</div>
	</div>
	</div>)
}


export default Login;



