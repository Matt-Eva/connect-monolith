import styles from "./PostCard.module.css";

import { Post } from "../../pages/Feed/Feed";

function PostCard({
  userId,
  post,
  username,
}: {
  userId: string;
  post: Post;
  username: string;
}) {
  const linkArray = post.mainPostLinksText.map((text, index) => {
    return (
      <a key={text} href={post.mainPostLinksLinks[index]}>
        {text}
      </a>
    );
  });

  console.log(post);
  return (
    <article>
      <h3>{username}</h3>
      <p>{post.mainPostContent}</p>
      <div>{linkArray}</div>
    </article>
  );
}

export default PostCard;
