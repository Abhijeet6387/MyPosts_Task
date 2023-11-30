import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  IconButton,
  Container,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Register() {
  const [passType, setPassType] = useState("password");
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setPassType((prevType) => (prevType === "password" ? "text" : "password"));
    setShowPassword((prevShow) => !prevShow);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      key.trim() === "" ||
      contact.trim() === ""
    ) {
      alert("Please fill all the details");
    } else {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/users/register`, {
          name: name,
          email: email,
          password: key,
          contact: contact,
        })
        .then((res) => {
          alert("Registered successfully");
          navigate("/login");
        })
        .catch((err) => {
          alert("Something went wrong :(");
          console.log(err);
        });
      setName("");
      setEmail("");
      setKey("");
      setContact("");
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
        <CardHeader title="Sign up" />
        <CardContent>
          <Box
            component="form"
            autoComplete="off"
            onSubmit={handleRegister}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
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
            <TextField
              label="Contact"
              variant="outlined"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Already Registered? <Link to="/login">Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
