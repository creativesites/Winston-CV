import { useState } from "react";

const educationData = [
  {
    id: 1,
    title: "MSc Machine Learning and Artificial Intelligence",
    academy: "Stellenbosch University", 
    dec: "fundamental principles of Artificial Intelligence and Machine Learning.",
    startYear: "2016",
    endYear: "2014",
  },
  {
    id: 2,
    title: "BSc Hons Computer Science",
    academy: "University Of Zimbabwe",
    dec: "- with a stream in Data Science",
    startYear: "2010",
    endYear: "2014",
  },
  {
    id: 3,
    title: "Data Science: R Basics",
    academy: "Harvard X (edX)",
    dec: "Basics on how to wrangle, analyze, and visualize data.",
    startYear: "2018",
    endYear: "2018",
  },
];

const experienceData = [
  {
    id: 1,
    title: "AI Developer (Remote)",
    company: "Myavana (USA)",
    dec: "As an AI Engineer at Myavana, I've been at the forefront of developing cutting-edge artificial intelligence solutions. My role involves crafting and implementing AI algorithms that enhance user experiences and drive innovation in the beauty tech industry. I work closely with cross-functional teams to deliver AI-powered features that delight our users.",
    startYear: "2020",
    endYear: false,
  },
  {
    id: 2,
    title: "Dialogflow Developer (Remote-Part Time)",
    company: "BlueVector AI (USA)",
    dec: "During my tenure at BlueVector AI, I served as a Dialogflow Developer, specializing in creating intelligent chatbot solutions. Working part-time, I collaborated on projects that required advanced natural language understanding and chatbot development skills. My contributions played a pivotal role in enhancing customer interactions and streamlining processes.",
    startYear: "2022",
    endYear: "2021",
  },
  {
    id: 3,
    title: "Zambia Team Manager & Developer (Remote)",
    company: "Propzi (Canada)",
    dec: "At Propzi, I had the privilege of managing the Zambia team while actively contributing as a Swift and React Native Developer. My role demanded strong leadership and technical skills. I oversaw project delivery, mentored team members, and played a key role in developing mobile applications that aligned with the company's mission and goals.",
    startYear: "2020",
    endYear: "2017",
  },
];

const Resume = () => {
  const [educationToggle, setEducationToggle] = useState(1);
  const [experienceToggle, setExperienceToggle] = useState(1);
  return (
    <section className="lui-section lui-gradient-bottom" id="resume-section">
      {/* Heading */}
      <div className="lui-heading">
        <div className="container">
          <div className="m-titles align-center">
            <h2
              className="m-title splitting-text-anim-1 scroll-animate"
              data-splitting="words"
              data-animate="active"
            >
              <span> Resume </span>
            </h2>
            <div
              className="m-subtitle splitting-text-anim-1 scroll-animate"
              data-splitting="words"
              data-animate="active"
            >
              <span>
                {" "}
                my <b>Story</b>
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* History */}
      <div className="v-line v-line-left">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <h5
                className="history-title scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <span> Education </span>
              </h5>
              <div className="history-items">
                {educationData.map((education, i) => (
                  <div
                    key={education.id}
                    className={`history-item lui-collapse-item scroll-animate ${
                      educationToggle === education.id ? "opened" : ""
                    }`}
                    data-animate="active"
                  >
                    <h6
                      className={`name lui-collapse-btn ${
                        educationToggle == education.id ? "active" : ""
                      }`}
                      onClick={() =>
                        setEducationToggle(
                          educationToggle == education.id ? null : education.id
                        )
                      }
                    >
                      <span> {education.academy} </span>
                    </h6>
                    <div className="history-content">
                      <div className="subname">
                        <span> {education.title} </span>
                      </div>
                      <div className="date lui-subtitle">
                        <span>
                          {" "}
                          {education.startYear} - {education.endYear}{" "}
                        </span>
                      </div>
                      <div className="text">
                        <div>
                          <p>{education.dec}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <h5
                className="history-title scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                <span> Experience </span>
              </h5>
              <div className="history-items">
                {experienceData.map((experience) => (
                  <div
                    className={`history-item lui-collapse-item scroll-animate ${
                      experience.id == experienceToggle ? "opened" : ""
                    }`}
                    data-animate="active"
                    key={experience.id}
                  >
                    <h6
                      className={`name lui-collapse-btn ${
                        experienceToggle == experience.id ? " active" : ""
                      }`}
                      onClick={() => setExperienceToggle(experience.id)}
                    >
                      <span> {experience.title} </span>
                    </h6>
                    <div className="history-content">
                      <div className="subname">
                        <span> {experience.company} </span>
                      </div>
                      <div className="date lui-subtitle">
                        <span>
                          {" "}
                          {experience.startYear} -{" "}
                          {experience.endYear ? (
                            experience.endYear
                          ) : (
                            <b>Present</b>
                          )}
                        </span>
                      </div>
                      <div className="text">
                        <div>
                          <p>{experience.dec}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lui-bgtitle">
            <span> History </span>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Resume;
