import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {NavLink} from "react-router-dom";
import {LOGIN_ROUTE, MAIN_ROUTE, ADMIN_ROUTE, PROFILE_ROUTE} from "../utils/consts";
import { fetchAllItems } from '../http/collectionItemAPI';
import { fetchCollections } from '../http/collectionAPI';
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import ThemeSelector from './ThemeSelector';
import { COLLECTION_ITEM_ROUTE, COLLECTION_ROUTE } from '../utils/consts';
import { ThemeContext, themes } from '../themes/ThemeContext';
import jwtDecode from 'jwt-decode';
import "../styles/navBar.css";

const NavBar = observer(() => {

    const history = useNavigate();

    const {user} = useContext(Context);

    const [isUser, setIsUser] = useState(true);
    const [itemsToSearch, setItemsToSearch] = useState([]);

    const token = localStorage.getItem('token') ? jwtDecode(localStorage.getItem("token")) : null;

    useEffect(() => {

        if(token && token.role === "USER") {
            setIsUser(true);
        } else {
            setIsUser(false);
        }

    }, [token]);

    useEffect(() => {
        setItemsToSearch([]);
        fetchAllItems().then(data => {
            data.map((item) => {
                setItemsToSearch((state) => ([...state, item]))
            })
        });
        fetchCollections().then(data => {
            data.map((item) => {
                setItemsToSearch((state) => ([...state, item]))
            })
        });
    }, []);

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
    };

    const formatResult = (item) => {
        return (
          <>
            <span style={{ display: 'block', textAlign: 'left', cursor: "pointer"}}>{item.name}</span>
          </>
        )
    };

    const handleOnSelect = (item) => {
        if(item.name.includes("collection")) {
            history(COLLECTION_ROUTE + "/" + item.id)
        } else {
            history(COLLECTION_ITEM_ROUTE + '/' + item.id)
        }
    };

    return (
        <Navbar className="navbar">
            <div style={{flexWrap: "nowrap", display: "flex"}}>
                <NavLink style={{color:'white', fontSize: "30px", marginLeft: "12.5vw", marginTop: "0px", display: "inline-block"}} to={MAIN_ROUTE}>Main</NavLink>
                <ReactSearchAutocomplete
                    items={itemsToSearch}
                    formatResult={formatResult}
                    onSelect={handleOnSelect}
                    placeholder='Enter item name...'
                    fuseOptions={{ keys: ["title", "description", "integerField1", "integerField2", "integerField3", "textField1", "textField2", "textFied3", "stringField1", "stringField2", "stringField3", "dateField1", "dateField2", "dateField3", "boolField2", "boolField2", "boolField3"] }}
                />
                <ThemeContext.Consumer>
                    {({ theme, setTheme }) => (
                    <ThemeSelector
                        onChange={() => {
                        if (theme === themes.light) setTheme(themes.dark)
                        if (theme === themes.dark) setTheme(themes.light)
                        }}
                        value={theme === themes.dark}
                    />
                    )}
                </ThemeContext.Consumer>
                {user.isAuth ?
                    <Nav style={{color: 'black', fontSize: "20px", marginLeft: "16vw", width: "15vw"}}>
                        <Button style={{fontSize: "20px", color: 'white'}} variant={"outline-dark"} onClick={() => logOut()} className="ml-2">
                            Log out
                        </Button>
                        <Button className={isUser === true ? "d-none" : "admin"} style={{fontSize: "20px", color: 'white', marginLeft: "1vw"}} variant={"outline-dark"} onClick={() => history(ADMIN_ROUTE)}>
                            Admin
                        </Button>
                        <Button className="ml-2" style={{fontSize: "20px", color: 'white', marginLeft: "1vw"}} variant={"outline-dark"} onClick={() => history(PROFILE_ROUTE)}>
                            Profile
                        </Button>
                    </Nav>
                    :
                    <Nav style={{color: 'white'}}>
                        <Button style={{fontSize: "20px", color: 'white', marginLeft: "20vw"}} variant={"outline-dark"} onClick={() => history(LOGIN_ROUTE)}>Authorization</Button>
                    </Nav>
                }
            </div>
        </Navbar>
    );
});

export default NavBar;
