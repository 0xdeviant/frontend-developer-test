import React, { useEffect, useState } from "react";
import { Main, DeviceView, ControlNav } from "../components/PanelComponents";
import { Button, Notification } from "../components/Components";
import { Redirect } from 'react-router-dom'
import axios from "axios";

export default function PanelContainer({ history }) {
  const [number, setNumber] = useState(0);
  const [notify, setNotify] = useState(false);
  const session = localStorage.getItem("meldcx_token");
  const url = "http://35.201.2.209:8000";
  const user_info = {
    name: "Jose Elmer Macalla",
    email: "macszoner94@gmail.com",
    repoUrl: "https://github.com/0xdeviant/frontend-developer-test",
    message: "When I realized the full potential of React, I instantly got hooked to it."
  }

  function getData() {
    axios.get(`${url}/devices`).then((res) => {
      const devices = res.data.devices.length;
      setNumber(devices);
    }).catch((e) => console.log(e));
  }

  function onNotify() {
    axios.post(`${url}/notify`, user_info, {
      headers: {
        Authorization: `Bearer ${session}`
      }
    }).then((res) => {
      setNotify(true);
    }).catch((e) => console.log(e))
  }

  function onLogout() {
    localStorage.clear();
    history.push('/')
  }

  useEffect(() => {
    // initial setup; re renders the component and prevents memory leak when not rendered.
    if (session !== null && number === 0) {
      getData();
    }

    const pollTime = setInterval(() => {
      getData();
    }, 5000);

    return () => clearInterval(pollTime);
  }, [number])

  // Conditional Rendering - Dependent on session token
  if (session !== null) {
    return (
      <div style={styles.container}>
        <Main>
          <DeviceView number={number} />
        </Main>

        {notify && <Notification message="Notification sent!" delay={2000}/>}
        <div style={styles.navController}>
          <ControlNav>
            <Button onClick={onNotify} buttonLabel="NOTIFY" style={styles.notifyButton} />
            <Button onClick={onLogout} buttonLabel="LOG OUT" style={styles.logoutButton} />
          </ControlNav>
        </div>
      </div>
    );
  }

  return(
    <Redirect from="/panel" to="/" />
  )

}

const styles = {
  navController: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  container: {
    position: "relative",
    height: "95vh",
    overflowY: "hidden",
    margin: 0,
    paddingTop: "20px",
    backgroundColor: "#F06D40"
  },

  notifyButton: {
    borderRadius: 10,
    margin: "0 10px",
    border: 0,
    color: "#2a2b2a",
    fontWeight: 600,
    fontSize: 18,
    position: "relative",
    width: 200
  },

  logoutButton: {
    borderRadius: 10,
    margin: "0 10px",
    border: 0,
    color: "#fff",
    fontWeight: 600,
    fontSize: 18,
    backgroundColor: "#37474F",
    position: "relative",
    width: 200
  }
};