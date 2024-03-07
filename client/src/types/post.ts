export interface SecondaryContentObject {
  nodeName: string;
  nodeText: string | null;
  children: SecondaryContentObject[];
  href?: string | null;
  className?: string | null;
}

export interface MongoPost {
  main_post_content: string;
  main_post_links_links: string[];
  main_post_links_text: string[];
  secondary_content: SecondaryContentObject[];
  src: string;
  user_id: string;
  _id: string;
}

export interface PostContent {
  uId?: string;
  mongoId: string;
  mainPostLinksText: string[];
  mainPostLinksLinks: string[];
  mainPostContent: string;
  isSecondaryContent: boolean;
  secondaryContentFetched: boolean;
  secondaryContent: SecondaryContentObject[];
}

export interface Post {
  post: PostContent;
  username: string;
  userId: string;
}
