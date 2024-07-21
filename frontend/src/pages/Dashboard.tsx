import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

interface JwtPayloadInstance extends JwtPayload {
  name: string;
  exp: number;
}

export default function Dashboard() {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [expired, setExpired] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/token");
      setToken(data.accessToken);
      const decodedToken = jwtDecode(data.accessToken) as JwtPayloadInstance;

      setName(decodedToken.name);
      setExpired(decodedToken.exp || 0);
    } catch (error) {
      if (error instanceof AxiosError) {
        navigate("/");
      }
    }
  };

  const axiosJwt = axios.create();

  axiosJwt.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expired * 1000 < currentDate.getTime()) {
        const { data } = await axios.get("http://localhost:5000/token");
        config.headers.Authorization = `Bearer ${data.accessToken}`;
        setToken(data.accessToken);
        const decodedToken = jwtDecode(data.accessToken) as JwtPayloadInstance;

        setName(decodedToken.name);
        setExpired(decodedToken.exp || 0);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getUsers = async () => {
    try {
      const { data } = await axiosJwt.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="container mt-5">
        <h1 className="title">Welcome back: {name} </h1>
        <button className="button is-info" onClick={getUsers}>
          Get Users
        </button>
      </main>
    </>
  );
}
