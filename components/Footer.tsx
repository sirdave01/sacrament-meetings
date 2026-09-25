// Render the shared footer used by every route in the root layout.
export default function Footer() {

  // Keep the copyright year current without maintaining it manually.
  return (

    <footer className="bg-gray-800 text-white py-4 mt-12">

      <div className="container mx-auto text-center">

        {/* Compute the year at render time so the footer does not go stale. */}
        <p>Copyright &copy; {new Date().getFullYear()} | Osigwe Uchechukwu DavidCaleb | All rights reserved</p>
        
        {/* Identify the primary technologies used to build the site. */}
        <p>Built with Next.js and Tailwind CSS</p>
        
      </div>
      
    </footer>
    
  );
  
}