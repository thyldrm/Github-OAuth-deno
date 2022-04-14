import { opine,json } from "https://deno.land/x/opine@2.1.5/mod.ts";
import { opineCors } from "https://deno.land/x/cors/mod.ts"
import axiod from "https://deno.land/x/axiod/mod.ts";

const app = opine();
app.use(opineCors())
app.use(json());

app.get("/auth/github/callback", (req:any, res:any) => {
  axiod({
    method: "POST",
    url: `http://github.com/login/oauth/access_token?client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET_ID>&code=${req.query.code}`,
    headers: {
      Accept: "application/json",
    },
  }).then((response:any) => {
    res.redirect(
      `http://localhost:3000?access_token=${response.data.access_token}`
    );
  }).catch(e=>console.log(e))
});

app.get("/user",async (req,res)=>{
      const token = req.headers.get('Authorization')
      const userResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `${token}`,
        },
      });
      const userResponseJ = await userResponse.json();
      res.send(userResponseJ)
})

app.get("/projects",async (req,res)=>{
      const username = (req.headers.get('username'))
      const userProjects = await fetch(`https://api.github.com/users/${username}/repos`);
      const userProjectsJ = await userProjects.json();
      res.send(userProjectsJ)
})

app.get("/project/:id",async (req,res)=>{
  const username = (req.headers.get('username'))
  res.send(`https://api.github.com/repos/${username}/${req.params.id}/zipball`)
})

app.listen(
  5000,
  () => console.log("server has started on 5000 🚀"),
);