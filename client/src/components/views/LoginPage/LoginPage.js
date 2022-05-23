import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_actions";
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onEmailHandler = (e) => {
    setEmail(e.currentTarget.value);
  };
  const onPasswordHandler = (e) => {
    setPassword(e.currentTarget.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault(); // 페이지 refresh를 막기위함
    let body = {
      email: Email,
      password: Password,
    };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        navigate("/");
      } else {
        alert("error");
      }
    });
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSubmitHandler}
        >
          <label>Email</label>
          <input type="email" value={Email} onChange={onEmailHandler} />
          <label>Password</label>
          <input
            type="password"
            value={Password}
            onChange={onPasswordHandler}
          />
          <br />

          <button tpye="submit">Login</button>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
