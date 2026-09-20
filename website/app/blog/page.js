// import BlogPost from "@/components/blog/BlogPost";
// import BlogPosts from "@/components/blog/BlogPosts";
// import Layout from "@/components/layout/Layout";
// import blogData from "../../public/blog";

// export default function Blog() {
//   return (
//     <Layout
//       headerStyle={1}
//       footerStyle={1}
//       headerCls="header-style-2 header-style-4"
//     >
//       <section className="section-box box-content-blog">
//         <div className="container">
//           <div className="text-center blog-head">
//             <span className="icon-1 shape-1" />
//             <span className="icon-2 shape-2" />
//             <span className="icon-3 shape-3" />
//             <span className="btn btn-brand-4-sm">Our Inside</span>
//             <h2 className="heading-2 mb-20 mt-15">Blog Resources</h2>
//             <p className="text-lg">
//               Explore our blog and resources for valuable insights, expert
//               opinions, and up-to-
//               <br className="d-none d-lg-block" />
//               date information on the latest trends in the industry.
//             </p>
//           </div>

//           <div className="box-list-news mt-100">
//             <div className="row">
//               <BlogPosts posts={blogData} showItem={6} />
//             </div>
//           </div>
//         </div>
//       </section>
//     </Layout>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogPosts from "@/components/blog/BlogPosts";
import Layout from "@/components/layout/Layout";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Aapki posts API backend endpoint
        const res = await axios.get("https://backend.digikraftsocial.com/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Layout
      headerStyle={1}
      footerStyle={1}
      headerCls="header-style-2 header-style-4"
    >
      <section className="section-box box-content-blog">
        <div className="container">
          <div className="text-center blog-head">
            <span className="icon-1 shape-1" />
            <span className="icon-2 shape-2" />
            <span className="icon-3 shape-3" />
            <span className="btn btn-brand-4-sm">Our Inside</span>
            <h2 className="heading-2 mb-20 mt-15">Blog Resources</h2>
            <p className="text-lg">
              Explore our blog and resources for valuable insights, expert
              opinions, and up-to-
              <br className="d-none d-lg-block" />
              date information on the latest trends in the industry.
            </p>
          </div>

          <div className="box-list-news mt-100">
            <div className="row">
              {loading ? (
                <div className="text-center w-100 py-5">
                  <h4>Loading Awesome Posts...</h4>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center w-100 py-5">
                  <h4>No posts found.</h4>
                </div>
              ) : (
                /* Dynamic posts pass ho rahi hain yahan */
                <BlogPosts posts={posts} showItem={6} />
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}