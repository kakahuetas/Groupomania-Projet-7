import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getComments } from "../../actions/comment.actions";
import { getLikes } from "../../actions/likes.actions";
import { updatePost } from "../../actions/post.actions";
import { getUsers } from "../../actions/users.actions";
import { UidContext } from "../App.Context";
import { DateParser, isEmpty } from "../utils/Utils";
import CardComments from "./CardComments";
import DeleteCard from "./DeleteCard";
import Like from "./Like";

const Card = ({ post }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [textUpdate, setTextUpdate] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const { id } = useParams();
  const uid = useContext(UidContext);
  const [isAdmin, setIsAdmin] = useState(false);

  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const commentsData = useSelector((state) => state.commentReducer);
  const dispatch = useDispatch();

  const updateItem = () => {
    if (textUpdate) {
      dispatch(updatePost(post.id, textUpdate));
    }
    setIsUpdated(false);
  };

  useEffect(() => {
    dispatch(getComments());
    dispatch(getUsers());
    dispatch(getLikes());

    !isEmpty(usersData[0]) && setIsLoading(false);
  }, [userData]);

  // Check admin
  useEffect(() => {
    const checkAdmin = () => {
      if (uid === userData.id && userData.isAdmin) {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [uid]);

  const commDuPost = Object.values(commentsData).filter((comment) => {
    return comment.postId === post.id;
  });

  const numbComm = commDuPost.length;

  return (
    <div className="card-container" key={post.id}>
      {isLoading ? (
        <div className="chargement">
          <i className="fas fa-spinner fa-spin"></i>
          <span>CHARGEMENT</span>
        </div>
      ) : (
        <>
          <div className="cardHeader">
            <div className="cardheader-img">
              <Link
                to={
                  !isEmpty(usersData[0]) &&
                  usersData

                    .map((user) => {
                      if (user.id === post.author)
                        return `/userprofil/${user.id}`;
                      else return null;
                    })
                    .join("")
                }
              >
                <img
                  src={
                    !isEmpty(usersData[0]) &&
                    usersData

                      .map((user) => {
                        if (user.id === post.author) return user.media;
                        else return null;
                      })
                      .join("")
                  }
                  alt="photo_profil"
                />
              </Link>
            </div>
            <div className="carheader-name">
              <span className="name">
                {!isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user.id === post.author)
                        return user.firstname + " " + user.name;
                      else return null;
                    })
                    .join("")}
              </span>
              <span className="service">
                {!isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user.id === post.author) return user.service;
                      else return null;
                    })
                    .join("")}
              </span>
              <span className="date">{DateParser(post.createdAt)}</span>
            </div>
            <div className="button-container-edit">
              {isAdmin || userData.id === post.author ? (
                <div className="cardheader-container-edit">
                  <div
                    className="cardheader-edit"
                    onClick={() => setIsUpdated(!isUpdated)}
                  >
                    <i className="far fa-edit"></i>
                  </div>
                </div>
              ) : null}

              <div className="cardheader-container-delete">
                {isAdmin || userData.id === post.author ? (
                  <div className="cardheader-container-edit">
                    <div
                      className="cardheader-edit"
                      onClick={() => setIsUpdated(!isUpdated)}
                    >
                      <DeleteCard id={post.id} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="postContent">
            <div className="postContent-post">
              {isUpdated === false && <p>{post.texte}</p>}
              {isUpdated && (
                <div className="update-post">
                  <textarea
                    defaultValue={post.texte}
                    onChange={(e) => setTextUpdate(e.target.value)}
                    rows="5"
                  />
                  <div className="button-container">
                    <button className="btn" onClick={updateItem}>
                      Valider modification
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="postContent-image">
              {post.media && (
                <img src={post.media} alt="post_image" className="card-img" />
              )}
            </div>
            <div className="postContent-video">
              {post.video && (
                <iframe
                  width="100%"
                  height="300"
                  src={post.video}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={post.id}
                ></iframe>
              )}
            </div>
          </div>
          <div className="carFooter">
            <div className="cardfooter-like">
              <Like post={post} />
            </div>
            <div
              className="cardfooter-comment"
              onClick={() => setShowComments(!showComments)}
            >
              <i className="far fa-comment-alt"></i>
              <span>{numbComm} Commentaires</span>
            </div>
          </div>
          {showComments && <CardComments post={post} />}
        </>
      )}
    </div>
  );
};

export default Card;
