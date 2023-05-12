import styles from './page.module.scss'
import AudioCard from '~/lib/components/audio-card';
import {API_HOST} from "~/env";

async function getAudioList() {
    return fetch(API_HOST.concat("/audios"));
}

export default async function Home() {
    // const { audiosList } = await audioService.listAudios()


    return (
        <div className={`grid p-8 gap-8 overflow-auto ${styles.grid_audio_cards}`}>
        </div>
    )
}

