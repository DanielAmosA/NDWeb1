import "./Styles//Main/App.css";

import audioWeb from "./Assets/Sound/campeones.wav";
import Logo from "./Assets/Pic/Web/Logo2.png";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Card from "react-bootstrap/Card";

import { IAuthContextType } from "./Component/Interfaces/Basic/IAuthContextType";
import {
  RenderWebMenu,
  RenderWebRoutes,
} from "./Component/Structure/RenderNavigation";


// Creating Default values

const AuthContext = createContext<IAuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
  // isAuthenticated: false;
});

// Passing Data Deeply with Context

export const AppAuthData = () => useContext(AuthContext);

const App = () => {

  //#region  Hook and Members

  // Hook to audio
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Hook to user Details
  const [user, setUser] = useState<{ name: string; isAuthenticated: boolean }>({
    name: "",
    isAuthenticated: false,
  });

  //#endregion

  //#region  Methods

  // Play and settings -  Sound to web

  const playSound = () => {
    if (audio) {
      audio.play();
    }
  };

  useEffect(() => {
    setAudio(new Audio(audioWeb));    
  }, []);

  // Connecting and Disconnecting the user

  const login = (userName: string, password: string): Promise<string> => {

    // Make a call to the authentication API to check the username

    return new Promise((resolve, reject) => {
      if (password === "password") {
        setUser({ name: userName, isAuthenticated: true });
        resolve("Success");
      } else {
        reject("Incorrect password");
      }
    });
  };

  const logout = (): void => {
    setUser({ ...user, isAuthenticated: false });
  };

  //#endregion

  return (
    <div className="App">

      {/* Provider for user */}
      <AuthContext.Provider value={{ user, login, logout }}>

        {/* Provider for google */}
        <GoogleOAuthProvider clientId="684666168835-pcj2mhoq49u88hm8qicubifoan3b6i0p.apps.googleusercontent.com">

          {/* Main top title web */}
          <Card className="text-center">
            <Card.Header>
              <Card.Title className="rainbow-text" onClick={() => playSound()} >
                My 365
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Img
                variant="top"
                src={Logo}
                alt="Logo Pic"
              />
              <Card.Text>
                With supporting text below as a natural lead-in to additional
                content.
              </Card.Text>
            </Card.Body>

            {/* Main web menu */}
            <Card.Footer>
              <RenderWebMenu/>
            </Card.Footer>
          </Card>

          {/* Main web data */}
          <RenderWebRoutes />

        </GoogleOAuthProvider>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
