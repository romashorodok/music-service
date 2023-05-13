'use client'

import React from "react"
import {NEXT_HOST} from "~/env";
import * as Form from '@radix-ui/react-form';

function useUpload() {
    const [file, setFile] = React.useState<File>();
    const [message, setMessage] = React.useState<string>();

    function selectFile({target: {files}}: React.ChangeEvent<HTMLInputElement>) {
        setFile(files[0]);
    }

    function submit(event: React.FormEvent, audioMetaData: AudioMetaDataForm) {
        event.preventDefault();

        const url = `${NEXT_HOST}/api/audio`

        const formData = new FormData();
        formData.set("file", file)
        formData.set("audio_metadata", JSON.stringify(audioMetaData))

        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(resp => resp.json())
            .then(setMessage);
    }

    return {
        selectFile,
        submit,
        message
    }
}


type AudioMetaDataForm = {
    title: string
}

export default function Upload() {
    const {selectFile, submit, message} = useUpload()

    const [formState, setFormState] = React.useReducer<React.Reducer<AudioMetaDataForm, Partial<AudioMetaDataForm>>>(
        (state, next) => ({...state, ...next}),
        {title: null}
    );

    function onChange(e: React.FormEvent) {
        if (e.target instanceof HTMLInputElement && e.target?.name != "file") {
            const {name, value} = e.target;
            setFormState({[name]: value});
        }
    }

    return (
        <div className="flex h-full">
            <Form.Root className="m-auto w-[340px]" autoComplete="off"
                       onSubmit={(e: React.FormEvent) => submit(e, formState)} onChange={onChange}>
                <Form.Field className="grid mb-[10px]" name="title">
                    <div className="flex items-baseline justify-between">
                        <Form.Label className="text-xl font-medium leading-[35px] text-white">Title</Form.Label>
                        <Form.Message className="text-lg text-white opacity-[0.8]" match="valueMissing">
                            Please enter your audio title
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input
                            className="box-border w-full bg-white text-black shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-lg leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_cornflowerblue] focus:shadow-[0_0_0_1px_cornflowerblue] selection:color-white selection:bg-blackA9"
                            required/>
                    </Form.Control>
                </Form.Field>
                <Form.Field name="file">
                    <div className="flex items-baseline justify-between">
                        <Form.Label className="text-xl font-medium leading-[35px] text-white">File</Form.Label>
                        <Form.Message className="text-lg text-white opacity-[0.8]" match="valueMissing">
                            Please select audio
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input name="file" type="file" onChange={selectFile} accept="audio/*" required/>
                    </Form.Control>
                </Form.Field>
                <Form.Submit asChild>
                    <button type="submit"
                            className="box-border w-full text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]">
                        Post question
                    </button>
                </Form.Submit>

                {message
                    ? <h3 className="text-xl text-red-400">
                        {JSON.stringify(message)}
                    </h3>
                    : null}
            </Form.Root>
        </div>
    )
}

