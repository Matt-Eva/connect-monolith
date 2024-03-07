import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./PostCard.module.css";

import { Neo4jPost, SecondaryContentObject } from "../../types/post";
import { recursivelyRenderSecondaryPostContent } from "../../utils/recursivelyRenderSecondaryPostContent";

function PostCard({
  userId,
  post,
  username,
  editable,
}: {
  userId: string;
  post: Neo4jPost;
  username: string;
  editable: boolean;
}) {
  const [secondaryContent, setSecondaryContent] = useState<
    SecondaryContentObject[]
  >([]);
  const [showSecondaryContent, setShowSecondaryContent] = useState(false);

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
        const data = await res.json();
        setSecondaryContent(data);
        setShowSecondaryContent(true);
      } catch (error) {
        console.error(error);
      }
    } else {
      setShowSecondaryContent(!showSecondaryContent);
    }
  };

  const edit = () => {
    navigate("/posts/new");
  };

  const deletePost = async () => {
    try {
      const res = await fetch(`/api/posts/${post.mongoId}`, {
        method: "DELETE",
      });
      if (res.ok) {
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
      {post.secondaryContent ? <button>read more</button> : null}
      <button onClick={handleSecondaryContent}>read more</button>
      {showSecondaryContent ? displaySecondaryContent : null}
    </article>
  );
}

export default PostCard;
