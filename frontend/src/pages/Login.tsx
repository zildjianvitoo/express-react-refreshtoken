import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        if (error.response) {
          console.log(error.response.data.message);
          setErrorMsg(error.response.data.message);
        }
      }
    }
  };

  return (
    <section className="hero has-background-grey-light is-fullwidth is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4-desktop">
              {errorMsg && (
                <p
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {errorMsg}
                </p>
              )}
              <form onSubmit={handleLogin} className="box">
                <div className="field">
                  <label className="label">Email/Username</label>
                  <div className="controls">
                    <input
                      type="text"
                      className="input"
                      placeholder="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Password</label>
                  <div className="controls">
                    <input
                      type="password"
                      className="input"
                      placeholder="****"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <button className="button is-success is-fullwidth">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
