import SongManager from "./SongManager.ts";

export default class WebsocketManager {
	sockets: WebSocket[];
	songManager: SongManager;

	constructor() {	
		this.sockets = [];
		this.songManager = new SongManager();

		setInterval(() => {
			this.sendPacketToAll({
				type: "timeUpdate",
				playingFor: this.songManager.getPassedTime()
			})
		}, 1000)

		this.songManager.on("nextSong", () => {
			this.sendPacketToAll({
				type: "song",
				song: this.songManager.songs[this.songManager.currentSong],
				playingFor: 0
			});
		})
	}

	attach(ws: WebSocket) {
		ws.addEventListener("open", () => {
			this.sockets.push(ws);

			ws.send("// Version 3");
			
			this.sendPacket({
				type: "song",
				song: this.songManager.songs[this.songManager.currentSong],
				playingFor: this.songManager.getPassedTime()
			}, ws);

			this.sendPacketToAll({
				type: "listeners",
				count: this.sockets.length
			});
		})

		ws.addEventListener("close", () => {
			this.sockets = this.sockets.filter(s => s !== ws);
			
			this.sendPacketToAll({
				type: "listeners",
				count: this.sockets.length
			});
		})
	}

	sendPacket(packet: any, ws: WebSocket) {
		ws.send(JSON.stringify(packet));
	}

	sendPacketToAll(packet: any) {
		this.sockets.forEach(v => {
			this.sendPacket(packet, v);
		})
	}
}