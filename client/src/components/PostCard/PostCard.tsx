import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../reduxHooks";

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
    return (
      <a key={text} href={post.mainPostLinksLinks[index]}>
        {text}
      </a>
    );
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
    <article>
      <h3>{username}</h3>
      {/* {editable ? <button onClick={edit}>edit</button> : null} */}
      {editable ? <button onClick={deletePost}>delete</button> : null}
      <p>{post.mainPostContent}</p>
      <div>{linkArray}</div>
      {post.isSecondaryContent ? (
        <button onClick={handleSecondaryContent}>read more</button>
      ) : null}
      {showSecondaryContent ? displaySecondaryContent : null}
    </article>
  );
}

export default PostCard;
