import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

const Posts = ({ userInfo, posts }) => {
  const [postsData, setPostsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchComments();
  }, [posts]);

  const fetchCommentsForPost = async (postId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/posts/getposts/${postId}/comments`
      );
      return response.data.map(({ author, text }) => ({ author, text }));
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return [];
    }
  };

  const fetchComments = async () => {
    try {
      const updatedPostsData = await Promise.all(
        posts.map(async (post) => {
          const comments = await fetchCommentsForPost(post._id);
          return { ...post, comments, commentText: "" };
        })
      );
      setPostsData(updatedPostsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const addComment = async (postId, commentText) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/posts/getposts/${postId}/comments`,
        {
          text: commentText,
          author: userInfo.name,
        }
      );

      const updatedPosts = postsData.map((post) => {
        if (post._id === postId) {
          const newComment = {
            author: userInfo.name,
            text: commentText,
          };
          const updatedComments = post.comments.concat(newComment);
          return { ...post, comments: updatedComments, commentText: "" };
        }
        return post;
      });

      setPostsData(updatedPosts);
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredPosts = posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm)
    );

    if (filteredPosts.length === 0) {
      setPostsData([]);
    } else {
      setPostsData(filteredPosts);
    }
  };

  const resetSearch = () => {
    setSearchTerm("");
    fetchComments();
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <TextField
          variant="standard"
          placeholder="Search posts"
          sx={{ float: "left" }}
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: searchTerm && (
              <Button variant="text" onClick={resetSearch}>
                Clear
              </Button>
            ),
          }}
        />
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <CircularProgress color="primary" />
        </div>
      ) : (
        <Grid container spacing={2}>
          {postsData.length === 0 ? (
            <Typography variant="body2" sx={{ margin: "20px" }}>
              No results found
            </Typography>
          ) : (
            postsData.map((post) => (
              <Grid item key={post._id} xs={12} sm={6} md={4} lg={3}>
                <Card variant="outlined" sx={{ height: "100%", boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>

                    <Typography variant="body2">{post.content}</Typography>
                    <Typography variant="caption">
                      Author - {post.author}
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <Typography variant="h6">Comments:</Typography>
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment, index) => (
                        <div key={index}>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>{comment.author}: </strong>
                            {comment.text}
                          </Typography>
                        </div>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        No comments
                      </Typography>
                    )}
                    <Divider style={{ margin: "10px 0" }} />
                    <div>
                      <TextField
                        fullWidth
                        placeholder="Add a comment"
                        variant="outlined"
                        size="small"
                        value={post.commentText}
                        onChange={(e) =>
                          setPostsData((prevPosts) =>
                            prevPosts.map((p) =>
                              p._id === post._id
                                ? { ...p, commentText: e.target.value }
                                : p
                            )
                          )
                        }
                        style={{ marginBottom: "8px" }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ textTransform: "unset" }}
                        onClick={() => addComment(post._id, post.commentText)}
                      >
                        Add Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </div>
  );
};

export default Posts;
