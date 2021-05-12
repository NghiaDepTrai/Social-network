import axiosInstance from '../axiosInstance';
import { setAlert } from "./alert";
import _ from 'lodash'
import {
  GET_POSTS,
  GET_POST,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from "./types";

/**
 * @description Get posts
 */
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axiosInstance().get("/api/posts");
    const sortedArray = _.orderBy(res.data,
      function (object) {
        return new Date(object.date);
      }, "desc")
    dispatch({
      type: GET_POSTS,
      payload: sortedArray,
    });
  } catch {
  }
};

/**
 * @description add like
 */

export const addLike = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance().put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg:
          err.response.statusText +
          " - UPDATE_LIKES error - addLike" +
          " " +
          (id && id),
        status: err.response.status,
      },
    });
  }
};

/**
 * @description remove like
 */

export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance().put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText + " - UPDATE_LIKES error - removeLike",
        status: err.response.status,
      },
    });
  }
};

/**
 * @description Delete Post
 */

export const deletePost = (id) => async (dispatch) => {
  try {
    await axiosInstance().delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText + " - DELETE_POST error - deletePost",
        status: err.response.status,
      },
    });
  }
};

/**
 * @description Add Post
 */

export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axiosInstance().post(`/api/posts/`, formData, config);
    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert("Please wait for your post to be approved", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText + " - ADD_POST error - addPost",
        status: err.response.status,
      },
    });
  }
};

/**
 * @description Get post
 */
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axiosInstance().get(`/api/posts/${id}`);
    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg:
          err.response.statusText +
          " - GET_POST error - getPost - " +
          "Post Id: " +
          id,
        status: err.response.status,
      },
    });
  }
};

/**
 * @description Add comment
 */

export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axiosInstance().post(
      `/api/posts/comments/${postId}`,
      formData,
      config
    );

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(setAlert("Comment Added", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText + " - ADD_COMMENT error - addComment",
        status: err.response.status,
      },
    });
  }
};

/**
 * @description Remove a comment
 */

export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    await axiosInstance().delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });

    dispatch(setAlert("Comment removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg:
          err.response.statusText + " - REMOVE_COMMENT error - deleteComment",
        status: err.response.status,
      },
    });
  }
};
