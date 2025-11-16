import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa"

export default function About() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Left column – Photo + Socials */}
      <div className="flex flex-col items-center">
        <img
          src={`${import.meta.env.BASE_URL}images/profile.jpg`}
          alt="Cho-Han Hsiung portrait"
          className="rounded-2xl w-90 h-75 object-cover shadow-lg mb-6"
        />

        <div className="flex space-x-6 text-2xl text-gray-600">
          <a href="https://linkedin.com/in/YOURUSERNAME" target="_blank" rel="noreferrer" className="hover:text-blue-600">
            <FaLinkedin />
          </a>
          <a href="https://github.com/YOURUSERNAME" target="_blank" rel="noreferrer" className="hover:text-black">
            <FaGithub />
          </a>
          <a href="https://instagram.com/YOURUSERNAME" target="_blank" rel="noreferrer" className="hover:text-pink-500">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Right column – Bio, Education, Experience */}
      <div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">About Me</h1>
        <p className="text-gray-700 mb-8 leading-relaxed">
          I’m Cho-Han Hsiung — a software engineer with a background bridging computer science, AI, and political science.  
          I enjoy creating intelligent systems and data-driven products that connect technology with real human needs.
        </p>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Major Experience</h2>
        <ul className="list-disc pl-5 text-gray-700 mb-6">
          <li>Software Engineer – Full Stack projects with React, Node.js, and Docker</li>
          <li>Data Science & AI projects: NLP, ML model development, and visualization</li>
          <li>Research in technology policy and digital governance</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Education</h2>
        <ul className="list-disc pl-5 text-gray-700 mb-6">
          <li>M.C.S., University of Sydney – Computer Science</li>
          <li>M.A., Georgetown University – Political Science</li>
          <li>B.A., National Chengchi University – Political Science</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Other Major Experiences</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Volunteer developer at Vets for Compassion (wildlife rescue app)</li>
          <li>Founder of several AI-assisted civic technology projects</li>
          <li>Passionate about generative design, data ethics, and interdisciplinary innovation</li>
        </ul>
      </div>
    </section>
  )
}
