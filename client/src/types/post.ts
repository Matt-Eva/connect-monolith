export interface SecondaryContentObject {
  nodeName: string;
  nodeText: string | null;
  children: SecondaryContentObject[];
  href?: string | null;
  className?: string | null;
}

export interface Neo4jPost {
  uId: string;
  mongoId: string;
  mainPostLinksText: string[];
  mainPostLinksLinks: string[];
  mainPostContent: string;
  isSecondaryContent: boolean;
  secondaryContent: SecondaryContentObject[];
}

export interface Post {
  post: Neo4jPost;
  username: string;
  userId: string;
}
