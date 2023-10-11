const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__builder">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div
                className="social-links scrolla-element-anim-1 scroll-animate"
                data-animate="active" 
              >
                {/* <a target="_blank" rel="nofollow" href="http://twitter.com">
                  <i aria-hidden="true" className="fab fa-twitter" />
                </a> */}
                <a target="_blank" rel="nofollow" href="https://github.com/creativesites">
                  <i aria-hidden="true" className="fab fa-github" />
                </a>
                <a target="_blank" rel="nofollow" href="https://www.youtube.com/channel/UCzT3j_bJn13BaDcNxW2Ljeg">
                  <i aria-hidden="true" className="fab fa-youtube" />
                </a>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div
                className="copyright-text align-center scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                © 2023 <strong>Winston Zulu</strong>. All rights reserved
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div
                className="copyright-text align-right scrolla-element-anim-1 scroll-animate"
                data-animate="active"
              >
                Developed by <strong>Winston Zulu</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
