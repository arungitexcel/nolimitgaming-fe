import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTopController() {
  const { pathname, search } = useLocation();
  console.log(pathname);

  useEffect(() => {
    const contentContainer = document.querySelector(".main-content");
    if (contentContainer) {
      contentContainer.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [pathname, search]);

  return null;
}
