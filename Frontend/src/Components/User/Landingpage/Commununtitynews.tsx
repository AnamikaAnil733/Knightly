import { NewspaperIcon, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllBlogs } from "../../../Service/Api/BlogApi";
import { BlogResponseDTO } from "../../../Types/BlogTypes";
import { Link } from "react-router-dom";

export function CommunityNews() {
  const [blogs, setBlogs] = useState<BlogResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        const data = await getAllBlogs({ limit: 3 });
        setBlogs(data.blogs);
      } catch (error) {
        console.error("Failed to fetch community blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBlogs();
  }, []);
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl font-bold text-center mb-12 text-white"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Community & News
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            // Loading Skeletons
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-[#1C254E]/50 rounded-2xl h-[450px] animate-pulse border border-white/5"
              />
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.slug}`}
                className="bg-[#1C254E]/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#6D5DF6]/50 transition-all hover:-translate-y-2 duration-300 card-glow group flex flex-col h-full"
              >
                <div className="h-52 relative overflow-hidden">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#4F7CFF] to-[#6D5DF6] flex items-center justify-center">
                      <NewspaperIcon className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5 text-[#AAB3D1] text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#4F7CFF] transition-colors font-cinzel line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-[#AAB3D1] text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-[#6D5DF6] text-xs font-bold uppercase tracking-widest group-hover:gap-4 transition-all mt-auto">
                    Read Manuscript <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
              <p className="text-[#AAB3D1] font-cinzel tracking-widest">
                NO RECENT DISPATCHES FROM THE CHRONICLES
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            to="/blogs"
            className="group relative px-10 py-4 bg-navy-card rounded-2xl border border-white/10 hover:border-gold/50 transition-all duration-300 flex items-center gap-3 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 text-white font-cinzel font-bold tracking-widest text-sm group-hover:text-gold transition-colors">
              VIEW THE FULL CHRONICLES
            </span>
            <ChevronRight className="relative z-10 w-5 h-5 text-gold group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
