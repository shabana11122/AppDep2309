import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import {Link,useNavigate } from 'react-router-dom';

function Login() {
   let dispatch = useDispatch();
    let navigate = useNavigate();
    let emailInputRef = useRef();
    let passwordInputRef = useRef();
   
    useEffect(() => {
        //emailInputRef.current.value = localStorage.getItem("email");
        //passwordInputRef.current.value = localStorage.getItem("password");

        if (localStorage.getItem("token")) {
            validateLoginonLoad();
        }
        
    }, []);



    let validateLoginonLoad = async () => {
        let dataToSend = new FormData();
       
        dataToSend.append("token", localStorage.getItem("token"));
        // dataToSend.append("password", localStorage.getItem("password"));
        

       

        // let myHeader = new Headers();
        // myHeader.append("content-type", "application/x-www-form-urlencoded");
        let reqOptions = {
            method: "POST",
            body: dataToSend,
            
            // headers: myHeader,
        };
        let JSONData = await fetch("http://localhost:4567/validateToken", reqOptions);

        let JSOData = await JSONData.json();
        console.log(JSOData);

        if (JSOData.status == "failure") {
            alert(JSOData.msg);
        } else {
            // localStorage.setItem("email", emailInputRef.current.value);
            // localStorage.setItem("password", passwordInputRef.current.value);

            dispatch({ type: "login", data: JSOData.data });
            navigate("/home");
        }
};

  let sendLoginDataToServerThruFD = async () => {
        let dataToSend = new FormData();
       
        dataToSend.append("email", emailInputRef.current.value);
        dataToSend.append("password", passwordInputRef.current.value);
        

       

        // let myHeader = new Headers();
        // myHeader.append("content-type", "application/x-www-form-urlencoded");
        let reqOptions = {
            method: "POST",
            body: dataToSend,
            
            // headers: myHeader,
        };
        let JSONData = await fetch("http://localhost:4567/login", reqOptions);

        let JSOData = await JSONData.json();
        console.log(JSOData);

        if (JSOData.status == "failure") {
            alert(JSOData.msg);
        } else {
            // localStorage.setItem("email", emailInputRef.current.value);
            // localStorage.setItem("password", passwordInputRef.current.value);

            localStorage.setItem("token", JSOData.data.token);  

            dispatch({ type: "login", data: JSOData.data });
            
            navigate("/home");
        }
    };
    

    let validateLogin = () => {
        return async () => {
            


            let dataToSend = new FormData();
       
            dataToSend.append("email", emailInputRef.current.value);
            dataToSend.append("password", passwordInputRef.current.value);
            
    
           
    
            // let myHeader = new Headers();
            // myHeader.append("content-type", "application/x-www-form-urlencoded");
            let reqOptions = {
                method: "POST",
                body: dataToSend,
                
                // headers: myHeader,
            };
            let JSONData = await fetch("http://localhost:4567/login", reqOptions);
    
            let JSOData = await JSONData.json();
            console.log(JSOData);
    
            if (JSOData.status == "failure") {
                alert(JSOData.msg);
            } else {
                // localStorage.setItem("email", emailInputRef.current.value);
                // localStorage.setItem("password", passwordInputRef.current.value);
    
                localStorage.setItem("token", JSOData.data.token);  
    
                dispatch({ type: "login", data: JSOData.data });
                
                navigate("/home");
            }
        }
    }

 return (
    <div className='App'>
          <form>
              <h2>Login</h2>
             
              <div>
                  <label>Email</label>
                  <input ref={emailInputRef}></input>
              </div>
              <div>
                  <label>Password</label>
                  <input ref={passwordInputRef}></input>
              </div>
            
            


              <div>
                 
                  <button type="button" onClick={() => {
                     //sendLoginDataToServerThruFD();
                     dispatch(validateLogin());
                  }}>Login</button>
              </div>
             
          </form>
          <div>
              <Link to="/signup">Sign Up</Link>
          </div>
    </div>
  )
}

export default Login
