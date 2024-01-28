import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom'

function TopNavigation() {
    let navigate = useNavigate();
    let storeObj = useSelector((store) => {
        return store;
    });

    useEffect(() => { 
        if (storeObj && storeObj.loginReducer.loginDetails && storeObj.loginReducer.loginDetails.email) {
            
        } else {
            navigate("/");
        }
    }, []);

    let highlightActiveLink = (obj) => {
        if (obj.isActive == true) {
            return {
                backgroundColor: "darkgreen",
                color: "white"
            };
        }
    };

    let deleteProfile = async () => {

        let reqOptions = {
            method: "DELETE",
        };
        let url = `http://localhost:4567/deleteProfile?
        email=${storeObj.loginReducer.loginDetails.email}`;
        let JSONData = await fetch(url, reqOptions);

        let JSOData = await JSONData.json();
        if (JSOData.status == "success") {
            alert(JSOData.msg);
            navigate("/");
        }

    };

    return (
        <nav>
            <NavLink to="/home"
                style={(obj) => {
               
                    return highlightActiveLink(obj);  
                            
            }}>Home</NavLink>
            <NavLink to="/tasks"
                style={(obj) => {
               
                    return highlightActiveLink(obj);
                }}>Tasks</NavLink>
            <NavLink to="/requests"
                style={(obj) => {
               
                    return highlightActiveLink(obj);
                }}  >Requests</NavLink>
            <NavLink to="/leaves"
                style={(obj) => {
               
                    return highlightActiveLink(obj);
                }}  >Leaves</NavLink>
            

            <NavLink to="/EditProfile"
                style={(obj) => {
               
                    return highlightActiveLink(obj);
                }}  >Edit Profile</NavLink>
            

            <NavLink to="/leaves"
                style={(obj) => {
               
                    return highlightActiveLink(obj);
                }}
                onClick={() => {
                    deleteProfile();
            }}
            
            >Delete</NavLink>
            
            
            
            <NavLink to="/" onClick={() => {
                localStorage.clear();
            }}>Logout</NavLink>
        </nav>
    );
}

export default TopNavigation
