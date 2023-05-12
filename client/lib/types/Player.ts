import {Audio} from "~/lib/types/Audio";

export type PlayableAudio = Audio & {
    manifest: string;
}
