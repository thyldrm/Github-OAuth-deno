import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [projects,setProjects]=useState(null)
  const [projectsDownload,setProjectsDownload]=useState(null)
  const [repoName,setRepoName]=useState("")

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get(
      "access_token"
    );
    
    const asyncFunc = async () => {
      const res = await axios.get("http://localhost:5000/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);

    const resProject = await axios.get(`http://localhost:5000/projects`,{
        headers:{
          username:res.data.login,
        }
      })
      setIsLoading(false)
      setProjects(resProject.data)
      setLoggedIn(true)
    }

    if(token){
      setIsLoading(true)
      asyncFunc();
    }
  }, []);

  useEffect(() => {
    if (projects) { 
      axios
        .get(`http://localhost:5000/project/${repoName}`, {
          headers: { username: user.login },
        })
        .then(({ data }) => {
          setProjectsDownload(data)
        })
        .catch(console.error);
    }
  }, [repoName]);

  const downloadRepo = (e) => {
    setRepoName(e.target.innerText)
  }

  return (
    <>
      {isloading && <h1>LOADING</h1>}
      {!isloading && 
    <div className="App text-center container-fluid">
      {!loggedIn ? (
        <>
          <img
            className="mb-4"
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            width="150"
            alt="..."
          ></img>
          <h1 className="h3 mb-3 font-weight-normal">Sign in with GitHub</h1>
          <Button
            type="primary"
            className="btn"
            size="lg"
            href="https://github.com/login/oauth/authorize?client_id=<CLIENT_ID>&redirect_uri=http://localhost:5000/auth/github/callback"
          >
            Sign in
          </Button>
        </>
      ) : (
        <>
            {[...Array(1)].map((e, i) => (
              <Card style={{ maxWidth: "25%", margin: "auto" }}>
                <Card.Img variant="top" src={user.avatar_url} />
                <Card.Body>
                  <Card.Title>{user.name}</Card.Title>
                  <Card.Text>{user.bio}</Card.Text>
                  <Button
                    variant="primary"
                    target="_blank"
                    href={user.html_url}
                  >
                    GitHub Profile
                  </Button>
                </Card.Body>
              </Card>
            ))}
            <ul>
              {projects.map(project=>(
                <li>
                  <a onClick={(e)=>downloadRepo(e)} href={projectsDownload} style={{cursor:"pointer"}}>{project.name}</a>
                </li>
              ))}
            </ul>
            
        </>
      )}
    </div>
    }
    </>
  );
}

export default App;