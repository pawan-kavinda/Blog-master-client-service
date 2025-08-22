import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postService } from "../services/authService";
import PostCard from "../components/blog/PostCard";
import { Search, Filter, Users, BookOpen, MessageSquare } from "lucide-react";

interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  author: { id: number; username: string; avatar: string };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  featuredImage?: string;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts({
        page: currentPage,
        limit: 6,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTag && { tag: selectedTag }),
      });

      const mappedPosts: Post[] = response.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        excerpt:
          item.content?.slice(0, 120) +
          (item.content?.length > 120 ? "..." : ""),
        author: {
          id: item.author_id,
          username: item.author_id || "Unknown Author",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            item.author_id || "User"
          )}`,
        },
        createdAt: item.created_at,
        tags: [],
        featuredImage: undefined,
      }));

      setPosts(mappedPosts);
      setTotalPages(Math.ceil(response.total / 6));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchTerm, selectedTag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTag("");
    setCurrentPage(1);
  };

  const getAllTags = () => [...new Set(posts.flatMap((p) => p.tags))];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-800 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500">
            The Content Forge
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Explore cutting-edge articles, connect with top-tier authors, and
            share your insights in a high-impact community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/register"
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Join Now
            </Link>
            <Link
              to="/create"
              className="border-2 border-gray-100 hover:bg-gray-100 hover:text-gray-900 px-8 py-3 rounded-xl font-semibold text-lg transition-all shadow-lg"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <Users className="h-8 w-8 text-yellow-400" />,
              title: "Community",
              desc: "Engage with thousands of active authors",
            },
            {
              icon: <BookOpen className="h-8 w-8 text-pink-400" />,
              title: "Content",
              desc: "High-quality, insightful articles",
            },
            {
              icon: <MessageSquare className="h-8 w-8 text-indigo-400" />,
              title: "Engagement",
              desc: "Comment, react, and network with peers",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-700 p-8 rounded-xl shadow-xl transform transition-all hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex items-center justify-center mb-4 w-16 h-16 bg-gray-900 rounded-full mx-auto">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{stat.title}</h3>
              <p className="text-gray-400">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search & Filter */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12">
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-md relative group"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </form>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              >
                <option value="">All Topics</option>
                {getAllTags().map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm || selectedTag) && (
              <button
                onClick={clearFilters}
                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-52 bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded mb-3"></div>
                  <div className="h-3 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-xl transition-colors ${
                      currentPage === i + 1
                        ? "bg-yellow-500 text-gray-900"
                        : "border border-gray-700 hover:bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-700 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No posts found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || selectedTag
                ? "Try adjusting your search criteria."
                : "Be the first to share your insights!"}
            </p>
            <Link
              to="/create"
              className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-medium transition-all shadow-lg"
            >
              Create First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
