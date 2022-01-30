import ffprobe, { ProbeFile } from "./ffprobe.ts";

export default class Song extends ProbeFile {
	file!: string;
	duration: number = 0;
	
	constructor(file: string, callback: songCallback) {
		super(undefined);
		new ffprobe(file, probedFile => {
			this.artist = probedFile.artist;
			this.date = probedFile.date;
			this.title = probedFile.title;
			
			this.duration = probedFile.duration || 1000;

			this.file = file;
			callback(this);
		});
	}
}

interface songCallback {
	(song: Song): void;
}
