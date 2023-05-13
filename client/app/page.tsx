import styles from './page.module.scss'
import AudioCard from "~/lib/components/audio-card";

function getAudioList() {
    return fetch(`${process.env.NEXT_PUBLIC_API}/audios`, {
        cache: 'no-cache'
    }).then(r => r.json());
}

export default async function Home() {
    const audioList = await getAudioList();

    return (
        <div className={`grid p-8 gap-8 overflow-auto ${styles.grid_audio_cards}`}>
            {audioList.map((audio, idx) => <AudioCard audio={audio} key={idx}/>)}
        </div>
    )
}

