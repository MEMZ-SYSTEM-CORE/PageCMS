import { getAllPosts } from "@/lib/content-server";
import { siteConfig } from "@/lib/config/site";
import { PostsList } from "@/components/posts-list";

export default function PostsPage() {
  const posts = getAllPosts();
  return <PostsList posts={posts} siteConfig={siteConfig} />;
}
