import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../reduxHooks";

import CreateMainPost from "../../components/CreateMainPost/CreateMainPost";
import RichTextEditor from "../../components/RichTextEditor/RichTextEditor";
import PostPreview from "../../components/PostPreview/PostPreview";

import styles from "./CreatePost.module.css";

import { addPost } from "../../state/myPosts";

import { SecondaryContentObject } from "../../types/post";

function CreatePost() {
  const user = useAppSelector((state) => state.user.value);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [mainContent, setMainContent] = useState("");
  const [mainContentLengthError, setMainContentLengthError] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkLink, setLinkLink] = useState("");
  const [mainContentLinksText, setMainContentLinksText] = useState<string[]>(
    []
  );
  const [mainContentLinksLinks, setMainContentLinksLinks] = useState<string[]>(
    []
  );
  const [linkQuantityError, setLinkQuantityError] = useState(false);
  const [linkRepeatError, setLinkRepeatError] = useState(false);
  const [secondaryContent, setSecondaryContent] = useState<
    SecondaryContentObject[]
  >([]);

  const [mongoId, setMongoId] = useState("");

  const updateMainContent = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textArea = e.target as HTMLTextAreaElement;
    const text = textArea.value;
    if (text.length < 300) {
      setMainContent(text);
      if (mainContentLengthError) {
        setMainContentLengthError(false);
      }
    } else {
      setMainContentLengthError(true);
    }
  };

  const updateMainContentLinks = ({
    linkText,
    linkLink,
  }: {
    linkText: string;
    linkLink: string;
  }) => {
    if (mainContentLinksText.length < 5) {
      const repeatLink = mainContentLinksLinks.find(
        (link) => link === linkLink
      );
      const repeatText = mainContentLinksText.find((text) => text === linkText);

      if (!repeatLink && !repeatText) {
        const newText = [...mainContentLinksText, linkText];
        setMainContentLinksText(newText);

        const newHyperlink = [...mainContentLinksLinks, linkLink];
        setMainContentLinksLinks(newHyperlink);
        setLinkLink("");
        setLinkText("");
      } else {
        setLinkRepeatError(true);
      }
    } else {
      setLinkQuantityError(true);
    }
  };

  const updateSecondaryContent = (
    secondaryContent: SecondaryContentObject[]
  ) => {
    setSecondaryContent(secondaryContent);
  };

  const saveDraft = async () => {
    console.log("saving draft");
    if (mongoId === "") {
      const uploadContent = {
        user_id: user.uId,
        src: "editorjs",
        main_post_content: mainContent,
        main_post_links_text: mainContentLinksText,
        main_post_links_links: mainContentLinksLinks,
        secondary_content: secondaryContent,
        created_at: Date.now(),
      };
      try {
        const res = await fetch("/api/save-new-post-draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadContent),
        });
        if (res.ok) {
          const data = await res.json();
          setMongoId(data.mongoId);
          alert("Post Successfully Saved!");
        } else {
          const error = await res.json();
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const uploadContent = {
        user_id: user.uId,
        src: "editorjs",
        main_post_content: mainContent,
        main_post_links_text: mainContentLinksText,
        main_post_links_links: mainContentLinksLinks,
        secondary_content: secondaryContent,
      };
      const res = await fetch(`/api/save-existing-post-draft/${mongoId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadContent),
      });
      if (res.ok) {
        alert("Post Successfully Updated!");
      }
    }
  };

  const publishPost = async () => {
    if (mongoId !== "") {
      const uploadContent = {
        user_id: user.uId,
        src: "editorjs",
        main_post_content: mainContent,
        main_post_links_text: mainContentLinksText,
        main_post_links_links: mainContentLinksLinks,
        secondary_content: secondaryContent,
      };
      try {
        const res = await fetch(`/api/publish-post/${mongoId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadContent),
        });
        if (res.ok) {
          alert("Post Successfully Published!");
          const data = await res.json();
          dispatch(addPost(data));
          navigate(`/profile/${user.uId}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <CreateMainPost
        updateMainContentLinks={updateMainContentLinks}
        mainContent={mainContent}
        mainContentLengthError={mainContentLengthError}
        mainContentLinksText={mainContentLinksText}
        mainContentLinksLinks={mainContentLinksLinks}
        linkQuantityError={linkQuantityError}
        linkRepeatError={linkRepeatError}
        updateMainContent={updateMainContent}
      />
      <RichTextEditor updateSecondaryContent={updateSecondaryContent} />
      <section>
        {mongoId !== "" ? (
          <PostPreview
            linkTextArray={mainContentLinksText}
            linkLinkArray={mainContentLinksLinks}
            mainContent={mainContent}
            secondaryContent={secondaryContent}
          />
        ) : null}
        {mongoId === "" ? (
          mainContent === "" ? (
            <button disabled={true}>Save</button>
          ) : (
            <button onClick={saveDraft}>Save</button>
          )
        ) : (
          <button onClick={publishPost}>Publish</button>
        )}
      </section>
    </div>
  );
}

export default CreatePost;
