// @deno-types="https://deno.land/x/servest/types/react/index.d.ts"
import React from "https://dev.jspm.io/react/index.js";
// @deno-types="https://deno.land/x/servest/types/react-dom/server/index.d.ts"
import ReactDOMServer from "https://dev.jspm.io/react-dom/server.js";
import { createApp } from "https://deno.land/x/servest/mod.ts";

const colores = ["black", "white", "gray", "silver", "maroon", "red", "purple", "fushsia", "green", "lime", "olive", "yellow", "navy", "blue", "teal","aqua"]
const selecionados:any = []

const app = createApp();

app.get('/', (req) =>
  req.respond({
    status: 200,
    headers: new Headers({
      'content-type': 'text/html; charset=UTF-8',
    }),
    body: ReactDOMServer.renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>servest</title>
        </head>
        <body>
          <form action="/" method="post">
            <select name="color" id="">
              {colores.map(e=> <option key={e} value={e}>{e}</option> )}
            </select>
            <input type="submit" />
          </form>         
        </body>
      </html>,
    ),
  })
);

app.post('/', async (req) => {
  const select = (await req.formData()).value('color');
  if (select) {
    selecionados.push(select);
  }
  req.respond({
    status: 200,
    headers: new Headers({
      'content-type': 'text/html; charset=UTF-8',
    }),
    body: ReactDOMServer.renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <title>servest</title>
        </head>
        <body>
          <form action="/" method="post">
            <select name="color" id="">
              {colores.map(e=> <option key={e} value={e}>{e}</option> )}
            </select>
            <input type="submit" />
          </form>
          {selecionados && selecionados.map((e:any) => <li style={{backgroundColor: "black", color: e}} key={e}>{e}</li>)}
        </body>
      </html>,      
    ),
  })  
});

app.listen({ port: 8080 });