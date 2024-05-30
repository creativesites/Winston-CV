"use strict";
exports.id = 935;
exports.ids = [935];
exports.modules = {

/***/ 2935:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ layouts_Layout)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
;// CONCATENATED MODULE: ./src/utils.js
function initCursor() {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let cursor = {
        el: document.querySelector(".cursor"),
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        w: 30,
        h: 30,
        update: function() {
            let l = this.x - this.w / 2;
            let t = this.y - this.h / 2;
            this.el.style.transform = "translate3d(" + l + "px," + t + "px, 0)";
        }
    };
    window.addEventListener("mousemove", (e)=>{
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    const link = document.querySelectorAll("a, .swiper-pagination, .swiper-button-prev, .swiper-button-next, button, .button, .btn, .lnk");
    link.forEach((link)=>{
        link.addEventListener("mouseenter", ()=>{
            cursor.el.classList.add("cursor-zoom");
        });
        link.addEventListener("mouseleave", ()=>{
            cursor.el.classList.remove("cursor-zoom");
        });
    });
    setInterval(move, 1000 / 60);
    function move() {
        cursor.x = lerp(cursor.x, mouseX, 0.1);
        cursor.y = lerp(cursor.y, mouseY, 0.1);
        cursor.update();
    }
    function lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }
}
const activeAnimation = ()=>{
    const progress_inner = document.querySelectorAll(".scroll-animate"), triggerBottom = window.innerHeight / 5 * 5 - 20;
    progress_inner.forEach((box)=>{
        const boxTop = box.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
            box.style.visibility = "visible";
            box.classList.add("animate__active");
        }
    });
};
const stickyNav = ()=>{
    let offset = window.scrollY;
    const sticky = document.querySelectorAll(".header");
    sticky.forEach((sticky)=>{
        if (sticky) {
            if (offset > 100) {
                sticky.classList.add("animate-in", "sticky");
            } else {
                sticky.classList.remove("animate-in", "sticky");
            }
        }
    });
};
const toggleMenu = (e)=>{
    e.preventDefault();
    const menu = document.querySelector(".menu-btn");
    if (menu.classList.contains("active")) {
        menu.classList.remove("active");
        menu.classList.add("no-touch");
        document.body.classList.remove("no-scroll");
        document.querySelector(".menu-full-overlay").classList.remove("is-open");
        document.querySelector(".menu-full-overlay").classList.remove("has-scroll");
        document.querySelector(".menu-full-overlay").classList.remove("animate-active");
        setTimeout(function() {
            document.querySelector(".menu-full-overlay").classList.remove("visible");
            menu.classList.remove("no-touch");
        }, 1000);
    } else {
        menu.classList.add("active", "no-touch");
        document.body.classList.add("no-scroll");
        document.querySelector(".menu-full-overlay").classList.add("is-open", "visible");
        setTimeout(function() {
            document.querySelector(".menu-full-overlay").classList.add("has-scroll", "animate-active");
            menu.classList.remove("no-touch");
        }, 1000);
    }
    return false;
};
const linkClick = ()=>{
    const menu = document.querySelector(".menu-btn");
    if (menu.classList.contains("active")) {
        menu.classList.remove("active");
        menu.classList.add("no-touch");
        document.body.classList.remove("no-scroll");
        document.querySelector(".menu-full-overlay").classList.remove("is-open");
        document.querySelector(".menu-full-overlay").classList.remove("has-scroll");
        document.querySelector(".menu-full-overlay").classList.remove("animate-active");
        setTimeout(function() {
            document.querySelector(".menu-full-overlay").classList.remove("visible");
            menu.classList.remove("no-touch");
        }, 1000);
    } else {
        menu.classList.add("active", "no-touch");
        document.body.classList.add("no-scroll");
        document.querySelector(".menu-full-overlay").classList.add("is-open", "visible");
        setTimeout(function() {
            document.querySelector(".menu-full-overlay").classList.add("has-scroll", "animate-active");
            menu.classList.remove("no-touch");
        }, 1000);
    }
    return false;
};
const jarallaxAnimation = ()=>{
    let { jarallax , jarallaxVideo  } = __webpack_require__(409);
    jarallax(document.querySelectorAll(`.js-parallax`), {
        speed: 0.65,
        type: "scroll"
    });
};

;// CONCATENATED MODULE: ./src/layouts/Footer.js

const Footer = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: "footer",
        children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
            className: "footer__builder",
            children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "container",
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "row",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "col-xs-12 col-sm-12 col-md-4 col-lg-4",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "social-links scrolla-element-anim-1 scroll-animate",
                                "data-animate": "active",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                        target: "_blank",
                                        rel: "nofollow",
                                        href: "https://github.com/creativesites",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("i", {
                                            "aria-hidden": "true",
                                            className: "fab fa-github"
                                        })
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                        target: "_blank",
                                        rel: "nofollow",
                                        href: "https://www.youtube.com/channel/UCzT3j_bJn13BaDcNxW2Ljeg",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx("i", {
                                            "aria-hidden": "true",
                                            className: "fab fa-youtube"
                                        })
                                    })
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "col-xs-12 col-sm-12 col-md-4 col-lg-4",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "copyright-text align-center scrolla-element-anim-1 scroll-animate",
                                "data-animate": "active",
                                children: [
                                    "\xa9 2023 ",
                                    /*#__PURE__*/ jsx_runtime_.jsx("strong", {
                                        children: "Winston Zulu"
                                    }),
                                    ". All rights reserved"
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "col-xs-12 col-sm-12 col-md-4 col-lg-4",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: "copyright-text align-right scrolla-element-anim-1 scroll-animate",
                                "data-animate": "active",
                                children: [
                                    "Developed by ",
                                    /*#__PURE__*/ jsx_runtime_.jsx("strong", {
                                        children: "Winston Zulu"
                                    })
                                ]
                            })
                        })
                    ]
                })
            })
        })
    });
};
/* harmony default export */ const layouts_Footer = (Footer);

// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./src/layouts/Header.js




const Header = ()=>{
    const [day, setDay] = (0,external_react_.useState)(true);
    (0,external_react_.useEffect)(()=>{
        if (day) {
            // document.querySelector("body").classList.add("light-skin");
            // document.querySelector("body").classList.remove("dark-skin");
            document.querySelector("body").classList.add("dark-skin");
        } else {
            document.querySelector("body").classList.add("dark-skin");
        }
    }, [
        day
    ]);
    const [pageToggle, setPageToggle] = (0,external_react_.useState)(false);
    return /*#__PURE__*/ jsx_runtime_.jsx(external_react_.Fragment, {
        children: /*#__PURE__*/ jsx_runtime_.jsx("header", {
            className: "header",
            children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "header__builder",
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: "row",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: "col-xs-4 col-sm-4 col-md-4 col-lg-4"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "col-xs-8 col-sm-8 col-md-8 col-lg-8 align-right",
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("a", {
                                    href: "#",
                                    className: `switcher-btn ${day ? "" : "active"}`,
                                    onClick: (e)=>{
                                        e.preventDefault();
                                        setDay(!day);
                                    },
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                            className: "sw-before",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                width: 23,
                                                height: 23,
                                                viewBox: "0 0 23 23",
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                                    id: "Dark_Theme",
                                                    "data-name": "Dark Theme",
                                                    fill: "#000",
                                                    d: "M1759.46,111.076a0.819,0.819,0,0,0-.68.147,8.553,8.553,0,0,1-2.62,1.537,8.167,8.167,0,0,1-2.96.531,8.655,8.655,0,0,1-8.65-8.682,9.247,9.247,0,0,1,.47-2.864,8.038,8.038,0,0,1,1.42-2.54,0.764,0.764,0,0,0-.12-1.063,0.813,0.813,0,0,0-.68-0.148,11.856,11.856,0,0,0-6.23,4.193,11.724,11.724,0,0,0,1,15.387,11.63,11.63,0,0,0,19.55-5.553A0.707,0.707,0,0,0,1759.46,111.076Zm-4.5,6.172a10.137,10.137,0,0,1-14.29-14.145,10.245,10.245,0,0,1,3.38-2.836c-0.14.327-.29,0.651-0.41,1.006a9.908,9.908,0,0,0-.56,3.365,10.162,10.162,0,0,0,10.15,10.189,9.776,9.776,0,0,0,3.49-.62,11.659,11.659,0,0,0,1.12-.473A10.858,10.858,0,0,1,1754.96,117.248Z",
                                                    transform: "translate(-1737 -98)"
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                            className: "sw-after",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                                                xmlns: "http://www.w3.org/2000/svg",
                                                width: "22.22",
                                                height: "22.313",
                                                viewBox: "0 0 22.22 22.313",
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                                                    id: "Light_Theme",
                                                    "data-name": "Light Theme",
                                                    fill: "#fff",
                                                    d: "M1752.49,105.511a5.589,5.589,0,0,0-3.94-1.655,5.466,5.466,0,0,0-3.94,1.655,5.61,5.61,0,0,0,3.94,9.566,5.473,5.473,0,0,0,3.94-1.653,5.643,5.643,0,0,0,1.65-3.957A5.516,5.516,0,0,0,1752.49,105.511Zm-1.06,6.85a4.1,4.1,0,0,1-5.76,0,4.164,4.164,0,0,1,0-5.788A4.083,4.083,0,0,1,1751.43,112.361Zm7.47-3.662h-2.27a0.768,0.768,0,0,0,0,1.536h2.27A0.768,0.768,0,0,0,1758.9,108.7Zm-10.35,8.12a0.777,0.777,0,0,0-.76.769v2.274a0.777,0.777,0,0,0,.76.767,0.786,0.786,0,0,0,.77-0.767v-2.274A0.786,0.786,0,0,0,1748.55,116.819Zm7.85-.531-1.62-1.624a0.745,0.745,0,0,0-1.06,0,0.758,0.758,0,0,0,0,1.063l1.62,1.625a0.747,0.747,0,0,0,1.06,0A0.759,0.759,0,0,0,1756.4,116.288ZM1748.55,98.3a0.777,0.777,0,0,0-.76.768v2.273a0.778,0.778,0,0,0,.76.768,0.787,0.787,0,0,0,.77-0.768V99.073A0.786,0.786,0,0,0,1748.55,98.3Zm7.88,3.278a0.744,0.744,0,0,0-1.06,0l-1.62,1.624a0.758,0.758,0,0,0,0,1.063,0.745,0.745,0,0,0,1.06,0l1.62-1.624A0.758,0.758,0,0,0,1756.43,101.583Zm-15.96,7.116h-2.26a0.78,0.78,0,0,0-.77.768,0.76,0.76,0,0,0,.77.768h2.26A0.768,0.768,0,0,0,1740.47,108.7Zm2.88,5.965a0.745,0.745,0,0,0-1.06,0l-1.62,1.624a0.759,0.759,0,0,0,0,1.064,0.747,0.747,0,0,0,1.06,0l1.62-1.625A0.758,0.758,0,0,0,1743.35,114.664Zm0-11.457-1.62-1.624a0.744,0.744,0,0,0-1.06,0,0.758,0.758,0,0,0,0,1.063l1.62,1.624a0.745,0.745,0,0,0,1.06,0A0.758,0.758,0,0,0,1743.35,103.207Z",
                                                    transform: "translate(-1737.44 -98.313)"
                                                })
                                            })
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("a", {
                                    href: "#",
                                    className: "menu-btn",
                                    onClick: (e)=>toggleMenu(e),
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("span", {}),
                                        /*#__PURE__*/ jsx_runtime_.jsx("span", {})
                                    ]
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: "menu-full-overlay",
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "menu-full-container",
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                className: "container",
                                                children: /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                    className: "row",
                                                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                        className: "col-xs-12 col-sm-12 col-md-12 col-lg-12",
                                                        children: [
                                                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                                className: "menu-full",
                                                                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
                                                                    className: "menu-full",
                                                                    children: [
                                                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                            className: "menu-item",
                                                                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                                                legacyBehavior: true,
                                                                                href: "/",
                                                                                children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                                                    className: "splitting-text-anim-2",
                                                                                    "data-splitting": "chars",
                                                                                    children: "Home"
                                                                                })
                                                                            })
                                                                        }),
                                                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                            className: "menu-item",
                                                                            children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                                                className: "splitting-text-anim-2",
                                                                                "data-splitting": "chars",
                                                                                href: "/#services-section",
                                                                                onClick: ()=>linkClick(),
                                                                                children: "Services"
                                                                            })
                                                                        }),
                                                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                            className: "menu-item",
                                                                            children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                                                className: "splitting-text-anim-2",
                                                                                "data-splitting": "chars",
                                                                                href: "/#skills-section",
                                                                                onClick: ()=>linkClick(),
                                                                                children: "Skills"
                                                                            })
                                                                        }),
                                                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                            className: "menu-item",
                                                                            children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                                                className: "splitting-text-anim-2",
                                                                                "data-splitting": "chars",
                                                                                href: "/#works-section",
                                                                                onClick: ()=>linkClick(),
                                                                                children: "Works"
                                                                            })
                                                                        }),
                                                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                            className: "menu-item",
                                                                            children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                                                className: "splitting-text-anim-2",
                                                                                "data-splitting": "chars",
                                                                                href: "/#resume-section",
                                                                                onClick: ()=>linkClick(),
                                                                                children: "Resume"
                                                                            })
                                                                        }),
                                                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                            className: "menu-item",
                                                                            children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                                                className: "splitting-text-anim-2",
                                                                                "data-splitting": "chars",
                                                                                href: "/#blog-section",
                                                                                onClick: ()=>linkClick(),
                                                                                children: "Blog"
                                                                            })
                                                                        }),
                                                                        /*#__PURE__*/ jsx_runtime_.jsx("li", {
                                                                            className: "menu-item",
                                                                            children: /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                                                className: "splitting-text-anim-2",
                                                                                "data-splitting": "chars",
                                                                                href: "/#contact-section",
                                                                                onClick: ()=>linkClick(),
                                                                                children: "Contact"
                                                                            })
                                                                        })
                                                                    ]
                                                                })
                                                            }),
                                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                                                className: "menu-social-links",
                                                                children: [
                                                                    /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                                        target: "_blank",
                                                                        rel: "nofollow",
                                                                        href: "https://github.com/creativesites",
                                                                        children: /*#__PURE__*/ jsx_runtime_.jsx("i", {
                                                                            "aria-hidden": "true",
                                                                            className: "fab fa-github"
                                                                        })
                                                                    }),
                                                                    /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                                        target: "_blank",
                                                                        rel: "nofollow",
                                                                        href: "https://www.youtube.com/channel/UCzT3j_bJn13BaDcNxW2Ljeg",
                                                                        children: /*#__PURE__*/ jsx_runtime_.jsx("i", {
                                                                            "aria-hidden": "true",
                                                                            className: "fab fa-youtube"
                                                                        })
                                                                    })
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                                className: "v-line-block",
                                                                children: /*#__PURE__*/ jsx_runtime_.jsx("span", {})
                                                            })
                                                        ]
                                                    })
                                                })
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: "menu-overlay"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            })
        })
    });
};
/* harmony default export */ const layouts_Header = (Header);

;// CONCATENATED MODULE: ./src/layouts/Layout.js





const Layout = ({ children , pageClassName  })=>{
    (0,external_react_.useEffect)(()=>{
        activeAnimation();
        initCursor();
        window.addEventListener("scroll", activeAnimation);
        window.addEventListener("scroll", stickyNav);
    }, []);
    (0,external_react_.useEffect)(()=>{
        if (false) {}
        Splitting();
        jarallaxAnimation();
        document.querySelector("body").className = pageClassName ? pageClassName : "";
    });
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(external_react_.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: "container-page",
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(layouts_Header, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: "wrapper",
                        children: children
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(layouts_Footer, {})
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "cursor"
            })
        ]
    });
};
/* harmony default export */ const layouts_Layout = (Layout);


/***/ })

};
;