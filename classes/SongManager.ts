import EventEmitter from "https://deno.land/x/events@v1.0.0/mod.ts";

import Song from "./Song.ts";

const config = {
	folder: "./music"
}

export default class SongManager extends EventEmitter {
	songs: Song[];
	currentSong: number;
	timeStarted = Date.now();

	constructor() {
		super();
		this.songs = [];
		this.currentSong = 0;

		[...Deno.readDirSync(config.folder)].forEach(e => new Song(config.folder + "/" + e.name, m => this.songs.push(m)))
	
		setInterval(() => {
			if(this.songs.length == 0) return;
			
			if(this.songs.length <= this.currentSong) {
				this.currentSong = 0;
				this.timeStarted = Date.now();

				this.emit("nextSong");
				return;
			}

			if (this.getPassedTime() >= this.songs[this.currentSong].duration) {
				this.currentSong++;
				this.timeStarted = Date.now();

				this.emit("nextSong");
			}

		})
	}

	getPassedTime() {
		return Date.now() - this.timeStarted;
	}
}