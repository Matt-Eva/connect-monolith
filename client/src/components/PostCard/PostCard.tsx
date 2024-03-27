import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../reduxHooks";

import CardImageIcon from "../CardImageIcon/CardImageIcon";

import styles from "./PostCard.module.css";

import { PostContent, SecondaryContentObject } from "../../types/post";

import { updatePostSecondaryContent } from "../../state/posts";
import { removePost } from "../../state/myPosts";

import { recursivelyRenderSecondaryPostContent } from "../../utils/recursivelyRenderSecondaryPostContent";

function PostCard({
  userId,
  post,
  username,
  editable,
}: {
  userId: string;
  post: PostContent;
  username: string;
  editable: boolean;
}) {
  const [secondaryContent, setSecondaryContent] = useState<
    SecondaryContentObject[]
  >(post.secondaryContent);
  const [showSecondaryContent, setShowSecondaryContent] = useState(false);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const linkArray = post.mainPostLinksText.map((text, index) => {
    const href = post.mainPostLinksLinks[index];
    if (
      post.mainPostLinksText.length === 1 ||
      index === post.mainPostLinksText.length - 1
    ) {
      return (
        <a href={href} key={href}>
          {text}
        </a>
      );
    } else {
      return (
        <>
          <a href={href} key={href}>
            {text}
          </a>
          <span>|</span>
        </>
      );
    }
  });

  const handleSecondaryContent = async () => {
    if (secondaryContent.length === 0) {
      try {
        const res = await fetch(`/api/secondary-post/${post.mongoId}`);
        const data: SecondaryContentObject[] = await res.json();
        setSecondaryContent(data);
        setShowSecondaryContent(true);
        dispatch(
          updatePostSecondaryContent({
            secondaryContent: data,
            mongoId: post.mongoId,
          })
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      setShowSecondaryContent(!showSecondaryContent);
    }
  };

  const deletePost = async () => {
    try {
      const res = await fetch(`/api/posts/${post.mongoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("post deleted");
        dispatch(removePost(post.mongoId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displaySecondaryContent =
    recursivelyRenderSecondaryPostContent(secondaryContent);

  return (
    <article className={styles.card}>
      <section className={styles.userInfo}>
        <CardImageIcon
          users={[{ name: username, uId: userId, profileImg: "" }]}
        />
        <h3 className={styles.username}>{username}</h3>
        {editable ? (
          <button onClick={deletePost} className={styles.deleteButton}>
            delete
          </button>
        ) : null}
      </section>
      <p className={styles.mainPost}>{post.mainPostContent}</p>
      {linkArray.length !== 0 ? (
        <section className={styles.postLinks}>{linkArray}</section>
      ) : null}
      {post.isSecondaryContent ? (
        <div className={styles.readMoreButtonContainer}>
          {showSecondaryContent ? (
            <button
              onClick={handleSecondaryContent}
              className={styles.readMore}
            >
              hide
            </button>
          ) : (
            <button
              onClick={handleSecondaryContent}
              className={styles.readMore}
            >
              read more
            </button>
          )}
        </div>
      ) : null}
      {showSecondaryContent ? <div>{displaySecondaryContent}</div> : null}
    </article>
  );
}

export default PostCard;
