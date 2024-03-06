import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./PostCard.module.css";

import { Post } from "../../pages/Feed/Feed";
import { recursivelyRenderSecondaryPostContent } from "../../utils/recursivelyRenderSecondaryPostContent";

type SecondaryContent = Array<ReactNode>;

function PostCard({
  userId,
  post,
  username,
  editable,
}: {
  userId: string;
  post: Post;
  username: string;
  editable: boolean;
}) {
  const [secondaryContent, setSecondaryContent] = useState<SecondaryContent>(
    []
  );
  const [showSecondaryContent, setShowSecondaryContent] = useState(false);

  const navigate = useNavigate();

  const linkArray = post.mainPostLinksText.map((text, index) => {
    return (
      <a key={text} href={post.mainPostLinksLinks[index]}>
        {text}
      </a>
    );
  });

  const displaySecondaryContent = async () => {
    if (secondaryContent.length === 0) {
      try {
        const res = await fetch(`/api/secondary-post/${post.mongoId}`);
        const data = await res.json();
        const secondaryContent = recursivelyRenderSecondaryPostContent(data);
        setSecondaryContent(secondaryContent);
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

  return (
    <article>
      <h3>{username}</h3>
      {/* {editable ? <button onClick={edit}>edit</button> : null} */}
      {editable ? <button onClick={deletePost}>delete</button> : null}
      <p>{post.mainPostContent}</p>
      <div>{linkArray}</div>
      {post.secondaryContent ? <button>read more</button> : null}
      <button onClick={displaySecondaryContent}>read more</button>
      {showSecondaryContent ? secondaryContent : null}
    </article>
  );
}

export default PostCard;
