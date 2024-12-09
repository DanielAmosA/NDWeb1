import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppAuthData } from "../../App";
import { useGoogleLogin } from "@react-oauth/google";
import { IUser } from "../Interfaces/Basic/IUser";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import LogInPic from "../../Assets/Pic/Gif/Web/Login.gif";
import '../../Styles/Main/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = AppAuthData();
  const [formData, setFormData] = useReducer(
    (formData: IUser, newItem: IUser) => {
      return { ...formData, ...newItem };
    },
    { userName: "", password: "" }
  );

  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const doLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(formData.userName, formData.password);
      navigate("/account");
    } catch (err) {
      const errorString =
        err instanceof Error ? err.message :
         typeof err ===  "string" ? err :  "An unknown error has occurred.";
      setErrorMessage(errorString);
    }
  };

  const getUserDetails = (access_token: any) => {
    const url = new URL("https://www.googleapis.com/oauth2/v3/userinfo");
    url.searchParams.set("access_token", access_token);
    var name;
    var email;
    fetch(url)
      .then((response) => response.json())
      .then((resJson) => {
        console.log(resJson);
        name = resJson.name;
        email = resJson.email;
        setFormData({ userName: name, password: email });
      });
  };

  const LoginWithGoogle = useGoogleLogin({
    onSuccess: (tokenRes) => {
      getUserDetails(tokenRes.access_token);
    },
    onError: () => {
      console.log("Login Failed ...");
    },
  });

  return (
    <div className="page">
      <br />
      <Container className="mainDetailsLogIn">
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <h2 className="text-center mt-3 titleForm">
            Your field & crowd, your time to shine!
            </h2>
            <Form className="logInForm" onSubmit={doLogin}>
              <Form.Group controlId="formUserName">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  required
                  autoComplete="username" 
                />
              </Form.Group>

              <br />

              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  autoComplete="current-password"
                />
              </Form.Group>
              {errorMessage ? (
                <Alert variant="danger" className="errorAlertCustom">
                  {errorMessage}
                </Alert>
              ) : null}

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Log in
              </Button>

              <Button
                variant="primary"
                type="button"
                className="w-100 mt-3 btnGoogle"
                onClick={() => LoginWithGoogle()}
              >
                Log in with Google 🌟🚀
              </Button>
              <Container className="text-center">
                <Image
                  src={LogInPic}
                  style={{ width: "8vw", height: "12vh" }}
                  rounded
                />
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
