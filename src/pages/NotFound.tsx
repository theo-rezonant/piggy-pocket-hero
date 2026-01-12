import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  // SEO: Set page-specific title and meta description for 404 page
  useEffect(() => {
    document.title = "Page Not Found - Piggy Pocket";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "The page you are looking for could not be found. Return to Piggy Pocket home to continue managing your savings."
      );
    }
  }, []);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
