import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../Helpers/Validation";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Grid,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [passType, setPassType] = useState("password");
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const togglePassword = () => {
    setPassType((prevType) => (prevType === "password" ? "text" : "password"));
    setShowPassword((prevShow) => !prevShow);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert("Please enter a valid Email!");
    } else if (key.trim() === "") {
      alert("Password can't be empty!");
    } else {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, {
          email: email,
          password: key,
        })
        .then((res) => {
          alert(res.data.message);
          localStorage.setItem("login_token", res.data.token);
          navigate("/home");
        })
        .catch((err) => {
          alert("Something went wrong, Please try again!");
          console.log(err);
        });
      setEmail("");
      setKey("");
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, padding: 2, boxShadow: 4 }}>
        <CardHeader title="Sign In" />
        <CardContent>
          <form autoComplete="off" onSubmit={handleLogin}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  variant="outlined"
                  type={passType}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={togglePassword} edge="end">
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
          <Typography
            variant="body2"
            sx={{ marginTop: 2 }}
            className="forgot-password"
          >
            New User? <Link to="/register">Register</Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
