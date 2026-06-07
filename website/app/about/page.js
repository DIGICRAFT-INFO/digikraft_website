"use client";

import { motion } from "framer-motion";
import CounterUp from "@/components/elements/CounterUp";
import ResizeContainer from "@/components/elements/ResizeContainer";
import VideoPopup from "@/components/elements/VideoPopup";
import Layout from "@/components/layout/Layout";
import NewsSlider from "@/components/slider/NewsSlider";
import CircularTimeline from "../index-8/page";
import Link from "next/link";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.3 } },
};

export default function About() {
  return (
    <>
      <ResizeContainer />
      <Layout
        headerStyle={1}
        footerStyle={1}
        headerCls="header-style-2 header-style-4"
      >
        <div>
          <motion.section
            className="section-box box-about-section-1"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="padding-left-auto">
                    <motion.h2
                      className="display-2 mt-15 mb-25"
                      variants={itemVariants}
                    >
                      Powering Brands with Design, Code & Strategy.
                    </motion.h2>
                    <motion.p className="text-xl mb-45" variants={itemVariants}>
                      We build and boost your brand with a powerful combo of
                      tech, design, and digital marketing.
                    </motion.p>
                    <motion.div
                      className="box-border-left-author"
                      variants={containerVariants}
                    >
                      <motion.p
                        className="text-22-bold"
                        variants={itemVariants}
                      >
                        We build websites, apps, videos, and run ads — all under
                        one expert team.
                      </motion.p>
                      <motion.div
                        className="box-joined"
                        variants={containerVariants}
                      >
                        <div className="box-authors">
                          {["author", "author2", "author3"].map((img, idx) => (
                            <motion.span
                              key={idx}
                              className="item-author"
                              variants={itemVariants}
                            >
                              <img
                                src={`/assets/imgs/page/homepage1/${img}.png`}
                                alt="Nivia"
                              />
                            </motion.span>
                          ))}
                          <motion.span
                            className="item-author"
                            variants={itemVariants}
                          >
                            <span className="text-num-author text-md-bold color-brand-2">
                              +2k
                            </span>
                          </motion.span>
                        </div>
                        <motion.span
                          className="text-lg d-inline-block"
                          variants={itemVariants}
                        >
                          brands trust Digikraft to scale their
                          <br className="d-none d-md-block" />
                          digital presence
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <motion.div
                    className="box-image-rect"
                    variants={imageVariants}
                  >
                    <img
                      src="/assets/imgs/page/about/img-about.png"
                      alt="Nivia"
                    />
                    <VideoPopup />
                  </motion.div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <motion.div
                    className="box-image-rect box-image-rect-both"
                    variants={imageVariants}
                  >
                    <img
                      src="/assets/imgs/page/about/img-about2.png"
                      alt="Nivia"
                    />
                  </motion.div>
                </div>
                <div className="col-lg-6">
                  <div className="padding-right-auto">
                    <div className="box-padding-left-50 box-padding-right-50">
                      <motion.div
                        className="strate-icon"
                        variants={itemVariants}
                      >
                        <span /> Strategies that work
                      </motion.div>
                      <motion.h2
                        className="heading-2 mb-20"
                        variants={itemVariants}
                      >
                        Track Progress, Performance & ROI With Us
                      </motion.h2>
                      <motion.p
                        className="text-lg neutral-700"
                        variants={itemVariants}
                      >
                        From leads to likes, our team keeps you informed every
                        step of the way. You’ll know exactly what’s working and
                        what’s next.
                      </motion.p>
                      <div className="row mt-50">
                        {[
                          {
                            title: "Websites & Apps with a Wow Factor",
                            icon: "discover.svg",
                          },
                          {
                            title: "Experts in Brand Identity & Growth",
                            icon: "keep.svg",
                          },
                        ].map((card, idx) => (
                          <div
                            className="col-xl-6 col-lg-12 col-sm-6"
                            key={idx}
                          >
                            <motion.div
                              className="card-feature-2"
                              variants={itemVariants}
                              whileHover="hover"
                              initial="rest"
                              animate="rest"
                              custom={cardHoverVariants}
                            >
                              <div className="card-image">
                                <img
                                  src={`/assets/imgs/page/homepage3/${card.icon}`}
                                />
                              </div>
                              <div className="card-info">
                                <Link href="#">
                                  <h3 className="text-22-bold">{card.title}</h3>
                                </Link>
                              </div>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="section-box box-prepared-section"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="container">
              <div className="row align-items-end">
                <div className="col-lg-6 mb-30">
                  <motion.h2 className="heading-2" variants={itemVariants}>
                    When you are more prepared, your future will be brighter
                  </motion.h2>
                </div>
                <div className="col-lg-6 mb-30">
                  <motion.h6 className="neutral-800" variants={itemVariants}>
                    Since 2020, we’ve been partnering with businesses to craft
                    powerful digital identities, driving meaningful impact
                    through technology, strategy, and design.
                  </motion.h6>
                </div>
              </div>
              <div className="row mt-45">
                {[
                  {
                    title: "Our Philosophy",
                    icon: "marketing.svg",
                    desc: "At Digikraft Social, we believe that every brand has a unique story. Our approach is rooted in creativity, clarity, and consistency — combining design, marketing, and technology to help businesses stand out and stay ahead in the digital space.",
                  },
                  {
                    title: "Our Mission",
                    icon: "digital.svg",
                    desc: "Since 2020, we’ve been partnering with businesses to craft powerful digital identities, driving meaningful impact through strategy, innovation, and design. Our mission is to empower brands with tools and experiences that inspire growth and long-term success.",
                  },
                  {
                    title: "Our Identity",
                    icon: "product.svg",
                    desc: "What sets us apart is our commitment to personalization and performance. Whether it’s a custom website, an engaging app, or a high-impact ad campaign — our identity lies in delivering work that reflects your brand’s vision while delivering real results.",
                  },
                ].map((card, idx) => (
                  <div className="col-lg-4" key={idx}>
                    <motion.div
                      className="card-feature-2 card-feature-list"
                      variants={itemVariants}
                      whileHover="hover"
                      initial="rest"
                      animate="rest"
                      custom={cardHoverVariants}
                    >
                      <div className="card-image">
                        <img src={`/assets/imgs/page/homepage3/${card.icon}`} />
                      </div>
                      <div className="card-info">
                        <Link href="#">
                          <h3 className="text-22-bold">{card.title}</h3>
                          <p className="text-lg neutral-800">{card.desc}</p>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="section-box box-our-offices"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="container">
              <div className="row align-items-end">
                <div className="col-lg-8">
                  <motion.h2 className="neutral-0" variants={itemVariants}>
                    The Digikraft Story
                  </motion.h2>
                </div>
              </div>
              <motion.div className="box-swiper mt-45" variants={imageVariants}>
                <CircularTimeline />
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            className="section-box box-get-touch-section"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <motion.div
                    className="box-image-get-touch"
                    variants={imageVariants}
                  >
                    <span className="setup">
                      <img
                        src="/assets/imgs/page/about/setup.png"
                        alt="Nivia"
                      />
                    </span>
                    <span className="icon-1">
                      <img src="/assets/imgs/page/about/icon.png" alt="Nivia" />
                    </span>
                    <img
                      src="/assets/imgs/page/about/img-touch.png"
                      alt="Nivia"
                    />
                  </motion.div>
                </div>
                <div className="col-lg-6">
                  <motion.div variants={itemVariants}>
                    <Link className="btn btn-brand-4-sm" href="#">
                      Contact Us
                    </Link>
                  </motion.div>
                  <motion.h2 className="mb-20 mt-20" variants={itemVariants}>
                    Get in Touch
                  </motion.h2>
                  <motion.p
                    className="text-md neutral-700"
                    variants={itemVariants}
                  >
                    Contact us below and we will get back to you shortly.
                  </motion.p>
                  <motion.div
                    className="block-form-contact mt-45"
                    variants={containerVariants}
                  >
                    <form action="#">
                      <div className="form-group">
                        <motion.label
                          htmlFor="fullname"
                          variants={itemVariants}
                        >
                          Your Name *
                        </motion.label>
                        <motion.input
                          className="form-control"
                          type="text"
                          placeholder="Name"
                          variants={itemVariants}
                        />
                      </div>
                      <div className="form-group">
                        <motion.label htmlFor="email" variants={itemVariants}>
                          Your Email *
                        </motion.label>
                        <motion.input
                          className="form-control"
                          type="text"
                          placeholder="email@website.com"
                          variants={itemVariants}
                        />
                      </div>
                      <div className="form-group">
                        <motion.label htmlFor="message" variants={itemVariants}>
                          Message *
                        </motion.label>
                        <motion.textarea
                          className="form-control"
                          rows={7}
                          placeholder="How can we help you?"
                          variants={itemVariants}
                        />
                      </div>
                      <div className="form-group">
                        <motion.button
                          className="btn btn-black btn-rounded"
                          type="submit"
                          variants={itemVariants}
                          whileHover={{ scale: 1.05 }}
                        >
                          Send Message
                          <svg
                            width={22}
                            height={8}
                            viewBox="0 0 22 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 3.99934L18.4791 0.478516V3.30642H0V4.69236H18.4791V7.52031L22 3.99934Z"
                              fill="true"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="section-box box-why-trusted box-why-trusted-black"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="container">
              <div className="row align-items-end">
                <div className="col-lg-4 mb-30">
                  <motion.h2 className="text-32-bold" variants={itemVariants}>
                    See why we are
                    <br className="d-none d-lg-block" /> trusted the world over
                  </motion.h2>
                </div>
                <div className="col-lg-8 mb-30">
                  <motion.div
                    className="box-numbers"
                    variants={containerVariants}
                  >
                    {[
                      { count: 469, unit: "k", label: "Social followers" },
                      { count: 25, unit: "k+", label: "Happy Clients" },
                      { count: 756, unit: "+", label: "Projects Done" },
                      { count: 100, unit: "+", label: "Global branches" },
                    ].map((item, idx) => (
                      <motion.div
                        className="item-number"
                        key={idx}
                        variants={itemVariants}
                      >
                        <h3 className="heading-2">
                          <CounterUp count={item.count} />
                          {item.unit}
                        </h3>
                        <p className="text-xl neutral-700">{item.label}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="section-box box-latest-news box-latest-news-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="container">
              <div className="row align-items-end">
                <div className="col-lg-8 mb-30">
                  <motion.h2
                    className="heading-2 mb-10"
                    variants={itemVariants}
                  >
                    Latest News Stories
                  </motion.h2>
                  <motion.p
                    className="text-lg neutral-700"
                    variants={itemVariants}
                  >
                    Pellentesque at posuere tellus. Ut sed dui justo. Phasellus
                  </motion.p>
                </div>
                <div className="col-lg-4 mb-30">
                  <motion.div
                    className="box-button-slider box-button-slider-team justify-content-end"
                    variants={itemVariants}
                  >
                    <div className="swiper-button-prev swiper-button-prev-testimonials swiper-button-prev-3">
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.66667 3.33398L2 8.00065M2 8.00065L6.66667 12.6673M2 8.00065H14"
                          stroke="true"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="swiper-button-next swiper-button-next-testimonials swiper-button-next-3">
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.33333 3.33398L14 8.00065M14 8.00065L9.33333 12.6673M14 8.00065H2"
                          stroke="true"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </motion.div>
                </div>
              </div>
              <motion.div className="box-swiper mt-30" variants={imageVariants}>
                <NewsSlider />
              </motion.div>
            </div>
          </motion.section>
        </div>
      </Layout>
    </>
  );
}
