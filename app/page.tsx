import ProjectList from '@/components/ProjectList';
const projects = [
  {
    title: 'CARECONNECT API',
    description: 'A Node.js API for identifying and managing user profiles in health fields.',
    technologies: ['ExpressJS', 'NodeJS', 'MongoDB', 'Github Actions', 'Render'],
    link: 'https://careconnect-api-a8af.onrender.com/'
  },
  {
    title: 'ByteHaven Identification API',
    description: 'A Node.js API for identifying user profiles.',
    technologies: ['ExpressJS', 'NodeJS', 'MongoDB', 'Github Actions', 'Render'],
    link: 'https://bytehaven-identification-api.onrender.com/'
  }
];

export default function Home() { 
  
  return (
    
    <main className="container mx-auto px-4 py-12">
      
      <section className="text-center py-12">
        
        <h1 className="text-4xl font-bold mb-4">My Portfolio</h1>
        
        <p className="text-lg text-white-700">
          
          I am a full-stack developer learning Next.js and React. Here are some of my recent projects.
          
        </p>
        
      </section>
      
      <ProjectList projects={projects} />
      
    </main>
    
  );
  
}