import { Route, Routes, NavLink } from "react-router-dom";
import { NavWeb } from "./Navigation";
import { AppAuthData } from "../../App";
import { INavigationPart } from "../Interfaces/Basic/INavigationPart";

// Create the web routes

export const RenderWebRoutes = () => {
  // Call to user details
  const { user } = AppAuthData();

  return (
    <Routes>
      {NavWeb.map((item: INavigationPart, ind: number) : JSX.Element | null => {

         // Get only basic roots 
          if (!item.isPrivate) {
            return <Route key={ind} path={item.path} element={item.element} />;
          } 

        else {
            // Check user exists
            if (user) {
                // Get more roots for user authenticated
                if (item.isPrivate && user.isAuthenticated) {
                  return <Route key={ind} path={item.path} element={item.element} />;
                } 
          }
        }
        return null;
      })}
    </Routes>
  );
};

// Create the web links

export const RenderWebMenu = () => {
  // Call to user details and logout
  const { user, logout } = AppAuthData();

  // create NavLink according to item
  const MenuItem = ({ item }: { item: INavigationPart } , ind : number): JSX.Element => {
    return (
      <div key={item.path} className="menuItem">
        <NavLink to={item.path}>{item.name}</NavLink>
      </div>
    );
  };

  // create Nav links  with MenuItem according to NavWeb item properties

  return (
    <div className="menu">
      {NavWeb.map((navElem: INavigationPart, ind: number) => {
        if (!navElem.isPrivate && navElem.isMenu) {
          return <MenuItem key={ind} item={navElem} />;
        } else if (user?.isAuthenticated && navElem.isMenu) {
          return <MenuItem key={ind} item={navElem} />;
        } else {
          return false;
        }
      })}
      {user?.isAuthenticated ? (
        <div key={'./LogOut'}  className="menuItem">
          <NavLink key={'LogOut'} to={"#"} onClick={logout}>
            Log out
          </NavLink>
        </div>
      ) : (
        [
          <div  key={'./LogIn'} className="menuItem">
            <NavLink key={'LogIn'} to={"logIn"}>Log in</NavLink>
          </div>,
          
          <div  key={'./SignIn'} className="menuItem">
            <NavLink key={'SignIn'} to={"signIn"}>Sign in</NavLink>
          </div>,
        ]
      )}
    </div>
  );
};
