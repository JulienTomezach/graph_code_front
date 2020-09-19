import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from "./Logo.module.css";
import '../App.css'
import {
  Link,
  useParams
} from "react-router-dom";

function Logo(props) {
	let to = props.to || "/landing"

	return (
		<Link className="Link" to={to}>
			<div className={styles.Logo} style= {props.styleCust}>
					&#931;xplicit
			</div>
		</Link>
	)
}

export default Logo;





