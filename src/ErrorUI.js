import React, { useState, useEffect, useCallback, useRef } from 'react';
import  styles from './ErrorUI.module.css';

function ErrorUI(props) {

  return <div className= {styles.ErrorUI}>
      <span className={styles.NotifType}><span className="material-icons">error_outline</span></span>
      <span className={styles.Close}>X</span>
      <span className={styles.ContentParent}>
        <span className={styles.Content}>
        What have you done ...

        </span>
      </span>
  </div>
}





export default ErrorUI;


//Phasellus pretium enim metus, sit amet tincidunt ligula semper mattis. Maecenas magna neque, congue ut dignissim consectetur, feugiat vel quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam luctus accumsan metus. Cras mattis laoreet varius. Suspendisse vel tempus ante. Proin risus nulla, ullamcorper at finibus quis, feugiat eu dolor. Nulla placerat sapien ex, in consequat felis ultrices eget.
