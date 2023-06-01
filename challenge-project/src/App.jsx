import { useEffect, useState } from "react";
import { Login } from "./components/Login";
import { Navbar } from "./components/Nabvar";
import Bluetooth from "./components/Bluetooth";

const App = () => {
  const [user, setUser] = useState();
  const [userLogged, isUserLogged] = useState(false);

  return (
    <div className="">
      <div id="signInDiv">
        {userLogged == false ? (
          <Login setUser={setUser} isUserLogged={isUserLogged} />
        ) : null}
      </div>

      <div>{userLogged == true ? <Navbar credential={user} /> : null}</div>


      <div className="flex justify-center" >{userLogged == true ?  <Bluetooth /> : null}</div>

    
    </div>
  );
};

export default App;
