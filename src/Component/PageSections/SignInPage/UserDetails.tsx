import { useGoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Image } from 'react-bootstrap';
import SignInPic from '../../../Assets/Pic/Gif/Web/Sign.gif'

const UserDetails = (
                        { OnValidDetails} : { OnValidDetails: (userName: string, email: string, password: string) => void }
                    ) => {
                        
    // #region Hook and Members 

    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [userNameError, setUserNameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    // #endregion

    //#region Methods 

    // Validating the email, name, and password for correctness.

    const ValidateUserName = (userName: string): boolean => {
        if (userName.trim().length === 0) {
            return false;
        }
        else {
            return true;
        }
    };

    const ValidateEmail = (email: string): boolean => {
        const resCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)?$/;
        return resCheck.test(String(email).toLowerCase());
    };

    const ValidatePassword = (password: string): boolean => {
        if (password.length < 6) {
            return false;
        }
        else {
            return true;
        }
    };

    // Calling Google APIs registration services.

    const GetUserDetails = (access_token: string): void => {
        const url = new URL('https://www.googleapis.com/oauth2/v3/userinfo');
        url.searchParams.set('access_token', access_token);
        var name;
        var email;
        fetch(url)
            .then((response) => response.json())
            .then((resJson) => {
                console.log(resJson);
                name = resJson.name;
                email = resJson.email;
                setUserName(name);
                setEmail(email);
                setPassword(email);
            });
    }

    const SignUpWithGoogle = useGoogleLogin({
        onSuccess: (tokenRes) => {
            console.log(tokenRes);
            GetUserDetails(tokenRes.access_token);
        },
        onError: () => {
            console.log("Sign Up Failed ...");
        }
    })

    // Checking if all the entered data is correct and proceeding to the next step.

    const HandleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        var isValid = true;
        if (!ValidateUserName(userName)) {
            setUserNameError('Username is required');
            isValid = false;
        }
        else {
            userNameError && setUserNameError('');
        }


        if (!ValidateEmail(email)) {
            setEmailError('Invalid email address');
            isValid = false;;
        }
        else {
            emailError && setEmailError('')
        };

        if (!ValidatePassword(password)) {
            setPasswordError('Password must be 6-20 characters long');
            isValid = false;;
        }
        else {
            passwordError && setPasswordError('');
        }


        if (!isValid)
            return

        OnValidDetails(userName, email, password);


    };

    // #endregion

    return (
        <Container className='mainDetailsSignUp'>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center mt-3 titleForm">Time To Enter To Ball World ... </h2>
                    <Form className='signUpForm' onSubmit={HandleSubmit}>

                        <Form.Group controlId="formUserName">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                isInvalid={!!userNameError}
                                required
                                autoComplete="username" 
                            />
                            {
                                userNameError && (
                                    <Alert variant="danger" className="errorAlertCustom">
                                        {userNameError}
                                    </Alert>
                                )}
                        </Form.Group>

                        <br />

                        <Form.Group controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={!!emailError}
                                required
                                autoComplete="email" 
                            />
                            {emailError && (
                                <Alert variant="danger" className="errorAlertCustom">
                                    {emailError}
                                </Alert>
                            )}
                        </Form.Group>

                        <br />

                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!passwordError}
                                required
                                autoComplete="current-password"
                            />
                            {passwordError && (
                                <Alert variant="danger" className="errorAlertCustom">
                                    {passwordError}
                                </Alert>
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3">
                        Sign Up
                        </Button>

                        <Button variant="primary" type="submit" className="w-100 mt-3 btnGoogle"
                            onClick={() => SignUpWithGoogle()}>
                           Sign Up with Google 🌟🚀
                        </Button>
                        <Container className="text-center">
                            <Image src={SignInPic} style={{ width: '8vw', height: '12vh' }} rounded />
                        </Container>

                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default UserDetails;