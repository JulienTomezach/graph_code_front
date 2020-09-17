import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './Login.module.css';


function Login(props) {

	return <div className={styles.Login}>

		<div className={styles.Header}>
				<div className={styles.HeaderTitle}>
					&#931;xplicit
				</div>
				<div className={styles.Button} styles={{width: '80px', marginRight: '1.5em'}}>Try Demo</div>
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
			  <div className={styles.FeatureTitle}>
			  		<span className={styles.ActualFeatureTitle}>Simple</span>
			  </div>
			  <div className={styles.FeatureContent}>
			   	No Production Code constraints like performance, security or Front-Back communication. <br/>The business logic is as simple as it can be.
			   </div>
			</div>
			<div className={styles.Feature}>
			  <div className={styles.FeatureTitle}>
			  		<span className={styles.ActualFeatureTitle}>Still Code</span>
			  </div>
			  <div className={styles.FeatureContent}>
               So computer can run it, check consistency, properties of the system and more.
			   </div>
			</div>
			
              
		</div>
		<div className={styles.Features}>
		<div className={styles.Feature}>
			  <div className={styles.FeatureTitle}>
			  		<span className={styles.ActualFeatureTitle}>Flexible</span>
			  </div>
			  <div className={styles.FeatureContent}>
               	Go in as much or as little detail you want. <br/> The code always runs and gives you valuable feedbacks.
			   </div>
			</div>
		</div>
	</div>
}


export default Login;



