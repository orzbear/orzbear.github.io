import type { RouteObject } from "react-router-dom"
import SiteLayout from "./layouts/SiteLayout"
import Home from "./pages/Home"
import About from "./pages/About"
import Projects from "./pages/Projects"
import ProjectDetail from "./pages/ProjectDetail"
import Research from "./pages/Research"
import Writing from "./pages/Writing"
import WritingDetail from "./pages/WritingDetail"

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "projects", element: <Projects /> },
      { path: "projects/:slug", element: <ProjectDetail /> },
      { path: "research", element: <Research /> },
      { path: "writing", element: <Writing /> },
      { path: "writings/:id", element: <WritingDetail /> },
    ]
  }
]
