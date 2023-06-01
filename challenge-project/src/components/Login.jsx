import { GoogleLogin } from "@react-oauth/google";

import jwt_decode from "jwt-decode";

export const Login = ({ setUser, isUserLogged }) => {
  const showUserInformation = (response) => {
    console.log('response :>> ', jwt_decode(response.credential));
    setUser(jwt_decode(response.credential));
    isUserLogged(true);
  };

  return (
    <div className="h-[600px] flex justify-center items-center">
      <GoogleLogin
        onSuccess={showUserInformation}
        onError={() => {
          console.log("Login Failed");
        }}
        shape="pill"
        size="large"
        width="1000"
        logo_alignment="left"
        text="signin_with"
        type="standard"
      />
    </div>
  );
};
