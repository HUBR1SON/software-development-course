import React from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBars, faHome, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom';
import {useDispatch} from "react-redux";
import {userActions} from "../utils/Rdx";
import {connect} from "react-redux"

import Utils from '../utils/Utils';
import BackendService from '../services/BackendService'

class NavigationBarClass extends React.Component {

    constructor(props) {
        super(props);
        this.goHome = this.goHome.bind(this);
        this.logout = this.logout.bind(this);
    }


    logout() {
        BackendService.logout().then(() => {
            Utils.removeUser();
            this.props.dispatch(userActions.logout())
            this.goHome()
        });
    }



    goHome() {
        this.props.navigate('Home');
    }


render() {
    let uname = Utils.getUserName();
    return (
        <Navbar bg="light" expand="lg">
                           <button type="button"
                                   className="btn btn-outline-secondary ms-3 me-3"
                                   onClick={this.props.toggleSideBar}>
                               <FontAwesomeIcon icon={ faBars} />
                           </button>
                           <Navbar.Brand ><FontAwesomeIcon icon={faHome} />{' '}My RPO</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/home">Home</Nav.Link>
                    <Nav.Link onClick={this.goHome}>Another Home</Nav.Link>
                    <Nav.Link onClick={() =>{ this.props.navigate("\home")}}>Yet Another Home</Nav.Link>
                </Nav>
                <Navbar.Text>{uname}</Navbar.Text>
                { uname &&
                <Nav.Link onClick={this.logout}><FontAwesomeIcon icon={faUser} fixedWidth />{' '}Выход</Nav.Link>
                }
                { !uname &&
                <Nav.Link as={Link} to="/login"><FontAwesomeIcon icon={faUser} fixedWidth />{' '}Вход</Nav.Link>
                }
            </Navbar.Collapse>
        </Navbar>
        );

}



}

const NavigationBar = props => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    return <NavigationBarClass navigate={navigate} dispatch={dispatch} {...props} />
}

const mapStateToProps = state => {
    const { user } = state.authentication;
    return { user };
}

export default connect(mapStateToProps)(NavigationBar);