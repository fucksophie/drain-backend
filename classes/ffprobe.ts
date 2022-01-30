import { which } from "https://deno.land/x/which@0.1.1/mod.ts";

const probeFile = await which("ffprobe");

if(!probeFile) throw new Error("ffprobe not found");

export default class ffprobe {
	constructor(file: string, callback: ffprobeCallback) {
		const cmdArguments = "-hide_banner -loglevel fatal -show_error -show_format -show_streams -show_programs -show_chapters -show_private_data -print_format json";
		const fileProbe = Deno.run({
			cmd: [probeFile || "", ...cmdArguments.split(" "), file],
			stdout: "piped"
		})
		
		fileProbe.output().then(data => callback(new ProbeFile(JSON.parse(new TextDecoder().decode(data)).format)))
	}
}

interface ffprobeCallback {
	(file: ProbeFile): void;
}

export class ProbeFile {
	duration!: number;
	title!: string;
	artist!: string;
	date!: string;
	album: string|undefined;
	
	constructor(file: any) {
		if(!file) return;

		this.duration = (+file.duration) * 1000;
		this.title = file.tags.title;
		this.artist = file.tags.artist;
		this.date = file.tags.date;
		this.album = file.tags?.album;
	}
}