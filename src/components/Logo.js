import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from "./Logo.module.css";
import '../App.js'
import {
  Link,
  useParams
} from "react-router-dom";

function Logo(props) {


	return (
		<Link className="Link" to="/landing"><div className={styles.Logo}>
					&#931;xplicit
				</div></Link>
	)
}

export default Logo;