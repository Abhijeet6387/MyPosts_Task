// Home.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  createTheme,
  ThemeProvider,
  Container,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Posts from "./Posts";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postAuthor, setPostAuthor] = useState("");
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("login_token");

    if (token) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/users/getUserInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserInfo(response.data.info);
          setLoading(false);
          fetchPostsData();
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
          setLoading(false);
        });
    }
  }, []);
  console.log("APP", process.env.REACT_APP_BACKEND_URL);
  const fetchPostsData = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/posts/getposts`)
      .then((response) => {
        if (response.data) {
          setPosts(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  const handleLogout = () => {
    alert("Logged out!");
    localStorage.removeItem("login_token");
    navigate("/login");
  };

  const handleCreatePost = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPostTitle("");
    setPostContent("");
    setPostAuthor("");
  };

  const handlePostTitleChange = (e) => {
    setPostTitle(e.target.value);
  };

  const handlePostContentChange = (e) => {
    setPostContent(e.target.value);
  };

  const handlePostAuthorChange = (e) => {
    setPostAuthor(e.target.value);
  };

  const handlePostSubmit = () => {
    const newPost = {
      title: postTitle,
      content: postContent,
      author: postAuthor,
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/posts/addpost`, newPost)
      .then((response) => {
        console.log("New Post created:", response.data);
        alert("Post Created!");
        fetchPostsData();
        setOpenDialog(false);
        setPostTitle("");
        setPostContent("");
        setPostAuthor("");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  const theme = createTheme({});

  return (
    <div>
      <div className="profile-section">
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 3,
              justifyContent: "center",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <ThemeProvider theme={theme}>
            <Container>
              <Card variant="outlined" sx={{ mt: 3, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h5" component="div" color="primary">
                    Profile Information
                  </Typography>
                  {userInfo && (
                    <div>
                      <Typography variant="body1" color="secondary">
                        User ID: {userInfo.userId}
                      </Typography>
                      <Typography variant="body1" color="secondary">
                        Name: {userInfo.name}
                      </Typography>
                      <Typography variant="body1" color="secondary">
                        Email: {userInfo.email}
                      </Typography>
                      <Typography variant="body1" color="secondary">
                        Contact: {userInfo.contact}
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Create Post</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Title"
                    fullWidth
                    value={postTitle}
                    onChange={handlePostTitleChange}
                  />
                  <TextField
                    margin="dense"
                    label="Content"
                    fullWidth
                    value={postContent}
                    onChange={handlePostContentChange}
                  />
                  <TextField
                    margin="dense"
                    label="Author"
                    fullWidth
                    value={postAuthor}
                    onChange={handlePostAuthorChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleCloseDialog}
                    color="error"
                    sx={{ textTransform: "unset" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePostSubmit}
                    color="primary"
                    variant="text"
                    sx={{ textTransform: "unset" }}
                  >
                    Post
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                onClick={handleLogout}
                variant="contained"
                color="error"
                sx={{
                  textTransform: "unset",
                  borderRadius: 50,
                  mt: 2,
                  mb: 2,
                  float: "right",
                }}
              >
                Logout
              </Button>
              <Button
                onClick={handleCreatePost}
                variant="contained"
                sx={{
                  textTransform: "unset",
                  borderRadius: 50,
                  mt: 2,
                  mr: 1,
                  mb: 2,
                  float: "right",
                }}
              >
                Create Post
              </Button>

              <Posts userInfo={userInfo} posts={posts} />
            </Container>
          </ThemeProvider>
        )}
      </div>
    </div>
  );
};

export default Home;
