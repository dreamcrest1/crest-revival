import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to top on every route change (instant, before paint). */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
