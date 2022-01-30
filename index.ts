import { opine, serveStatic} from "https://deno.land/x/opine@2.1.1/mod.ts";
import WebsocketManager from "./classes/WebsocketManager.ts";

const app = opine();

const wsm = new WebsocketManager();

app.use("/music", serveStatic("./music"));

app.get("/ws", async (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Expose-Headers", "Upgrade,sec-websocket-accept,connection");

	if (req.headers.get("upgrade") === "websocket") wsm.attach(req.upgrade()); else res.end();
});


app.listen({port: 3000, hostname: "127.0.0.1"}, () => {
	console.log("Opine listening on port 3000.");
});


