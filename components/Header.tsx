// example header of a NextJS app

// importing the reusable NavLinks component that will be used in the Header component. This makes the code more modular and easier to maintain.

import NavLinks from "@/components/NavLinks";

// defining a reusable component that can be imported.

export default function Header() {
    
    return (

        // className applies Tailwind CSS utility classes for color, spacing, alignment, and sizing
        
        <header className="bg-gray-800 text-white p-4 shadow-md">
            
            <div id="header-title" className="text-2xl font-bold">Osigwe Uchechukwu DavidCaleb</div>
            
            <nav className="max-w-4xl mx-auto mt-4 flex justify-between items-center">

                <NavLinks />

            </nav>
        
        </header>

    );

}