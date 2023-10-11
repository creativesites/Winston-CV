import Isotope from "isotope-layout";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import YouTubeFrame from "./Video"
const PortfolioIsotope = ({ noViewMore }) => {
  // Isotope
  const isotope = useRef();
  const [filterKey, setFilterKey] = useState("*");
  useEffect(() => {
    isotope.current = new Isotope(".works-items", {
      itemSelector: ".works-col",
      //    layoutMode: "fitRows",
      percentPosition: true,
      masonry: {
        columnWidth: ".works-col",
      },
      animationOptions: {
        duration: 750,
        easing: "linear",
        queue: false,
      },
    });
    return () => isotope.current.destroy();
  });
  useEffect(() => {
    if (isotope.current) {
      filterKey === "*"
        ? isotope.current.arrange({ filter: `*` })
        : isotope.current.arrange({ filter: `.${filterKey}` });
    }
  }, [filterKey]);
  const handleFilterKeyChange = (key) => () => {
    setFilterKey(key);
  };
  const activeBtn = (value) => (value === filterKey ? "active" : "");
  return ( 
    <Fragment>
      <div className="works-box">
        <div
          className="filter-links scrolla-element-anim-1 scroll-animate"
          data-animate="active"
        >
          <a
            className={`c-pointer lui-subtitle ${activeBtn("*")}`}
            onClick={handleFilterKeyChange("*")}
            data-href=".works-col"
          >
            All
          </a>
          <a
            className={`c-pointer lui-subtitle ${activeBtn(
              "sorting-ui-ux-design"
            )}`}
            onClick={handleFilterKeyChange("sorting-ui-ux-design")}
            data-href=".sorting-ui-ux-design"
          >
            Web Development 
          </a>
          <a
            className={`c-pointer lui-subtitle ${activeBtn("sorting-photo")}`}
            onClick={handleFilterKeyChange("sorting-photo")}
            data-href=".sorting-photo"
          >
            Mobile App Development 
          </a>
          <a
            className={`c-pointer lui-subtitle ${activeBtn(
              "sorting-development"
            )}`}
            onClick={handleFilterKeyChange("sorting-development")}
            data-href=".sorting-development"
          >
            Backend Development
          </a>
          <a
            className={`c-pointer lui-subtitle ${activeBtn(
              "sorting-branding"
            )}`}
            onClick={handleFilterKeyChange("sorting-branding")}
            data-href=".sorting-branding"
          >
            AI Development
          </a>
        </div>
        <div className="works-items works-masonry-items row">
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12 sorting-photo sorting-branding sorting-development sorting-ui-ux-design">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/myavana.png"
                        alt="Myavana"
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <span className="category"> Web, AI Development, Mobile App Development </span>
                
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>Myavana</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                  As a Full-Stack Developer on the Myavana team, primarily working on the CVM Worldwide side, my focus was predominantly on web development initiatives. One of my significant contributions was the development of AI for the mobile app's chatbot. This feature was aimed at enhancing user engagement and delivering personalized recommendations in the beauty tech sector. My work in this capacity added a layer of sophistication to the app, driving user satisfaction and enriching the overall experience.
                  </p>
                </div>
                <Link legacyBehavior href="https://www.myavana.com/">
                  <a className="lnk">Visit Site</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12 sorting-development sorting-ui-ux-design ">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <iframe width="480" height="240" src="https://www.youtube.com/embed/ySbATgmd01E" title="WhatsApp Classifieds Chatbot on ZTV Science and Tech feature" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                      {/* <YouTubeFrame video="0Qp1z7wX2K8" width="100%" height="100%" thumbnailQuality="maxresdefault" /> */}
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <span className="category"> AI Development, Backend Development </span>
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>ChatLearn</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                  At ChatLearn, I developed a chatbot-based e-learning system specifically tailored for Zimbabwean high school students. Understanding that internet access is a challenge in Zimbabwe, I designed the system to operate via WhatsApp, making it accessible for students who could only afford WhatsApp data bundles. The platform offers educational content, quizzes, and real-time assistance, reaching thousands of students. By providing a low-cost, high-impact solution, ChatLearn has fundamentally altered the educational landscape, allowing more students to engage in meaningful learning experiences.
                  </p>
                </div>
                <Link legacyBehavior href="https://www.empireoneconsulting.com/">
                  <a className="lnk" target="_blank" rel="noopener noreferrer">Visit Website
                </a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12 sorting-development sorting-branding sorting-photo">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/propzi.png"
                        alt="Explore"
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <span className="category"> Mobile App Development, Backend Development, AI Development </span>
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>Propzi</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                  At Propzi, I played a pivotal role in developing a Dialogflow chatbot to enhance communication and user interactions. I also crafted a robust home evaluation algorithm for property assessments. Furthermore, I assumed the lead developer position for the Propzi mobile app, aligning it with the company's objectives. This multifaceted role showcased my versatility and expertise in delivering innovative solutions to the real estate industry.
                  </p>
                </div>
                <Link legacyBehavior href="https://www.propzi.com/">
                  <a className="lnk" target="_blank" rel="noopener noreferrer">Visit Website</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12 sorting-branding ">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/bluevector.png"
                        alt="Bluevector"
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <span className="category"> AI Development, Backend Development, Fitbit App Development </span>
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>Bluevector AI</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                  At BlueVector, I served as the lead developer for the Medtronic Fitbit app, responsible for designing and implementing Dialogflow agents tailored to U.S. government-related departments. My role involved intricate collaboration and a deep understanding of compliance and security standards, contributing to the successful integration of healthcare solutions within the Fitbit platform. This experience highlighted my technical expertise and ability to navigate complex regulatory environments while delivering high-quality solutions.
                  </p>
                </div>
                <Link legacyBehavior href="https://bluevector.ai/">
                <a className="lnk" target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12 sorting-photo ">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/auto.png"
                        alt="Stay Fit"
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <span className="category"> AI Development </span>
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>AutoService AI</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                  At AutoService AI, I spearheaded the development of backend systems to manage hundreds of Dialogflow agents. Utilizing Node.js and Express.js, I created a bulk update mechanism for intents, entities, and contexts, streamlining agent management. I also implemented automated daily tests via cron jobs to ensure agent quality. Additionally, I built a data scraping and analysis tool, logging into Dialogflow to collect call histories and using Google Apps Script for performance analysis. My work was key in automating and optimizing our customer support capabilities.
                  </p>
                </div>
                <Link legacyBehavior href="https://www.autoservice.ai">
                  <a className="lnk" target="_blank" rel="noopener noreferrer">Visit Site</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
          <div className="works-col col-xs-12 col-sm-12 col-md-12 col-lg-12 sorting-ui-ux-design ">
            <div
              className="works-item scrolla-element-anim-1 scroll-animate"
              data-animate="active"
            >
              <div className="image">
                <div className="img">
                  <Link legacyBehavior href="/work-single">
                    <a>
                      <img
                        decoding="async"
                        src="assets/images/mitch.png"
                        alt="Kana"
                      />
                      <span className="overlay" />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="desc">
                <span className="category"> AI Development</span>
                <h5 className="name">
                  <Link legacyBehavior href="/work-single">
                    <a>Michigan State Health & Human Services</a>
                  </Link>
                </h5>
                <div className="text">
                  <p>
                  For Michigan State Health & Human Services Vital Records, I developed Dialogflow chatbots for both telephone and website interactions. In collaboration with a Cisco team, we integrated advanced call routing features for the telephony bot. These chatbots managed complex queries related to vital records, answered FAQs, and facilitated service requests. By reducing the operational load on human staff and offering 24/7 assistance, the chatbots improved user experience and allowed the department to concentrate on other essential tasks more efficiently.
                  </p>
                </div>
                <Link legacyBehavior href="https://www.michigan.gov/mdhhs/doing-business/vitalrecords">
                <a className="lnk" target="_blank" rel="noopener noreferrer">Visit Website</a>
                </Link>
              </div>
              <div
                className="bg-img"
                style={{
                  backgroundImage: "url(assets/images/pat-2.png)",
                }}
              />
            </div>
          </div>
        </div>
        {!noViewMore && (
          <div className="load-more-link">
            <Link legacyBehavior href="/works">
              <a
                className="btn scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <span>View More</span>
              </a>
            </Link>
          </div>
        )}
      </div>
    </Fragment>
  );
};
export default PortfolioIsotope;
