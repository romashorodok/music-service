'use client'

import * as Form from "@radix-ui/react-form";
import React from "react";
import useAuth from "~/lib/hooks/useAuth";
import {FormField} from "~/lib/components/Form/FormField";
import {useForm} from "~/lib/hooks/useForm";
import * as yup from 'yup';
import {useRouter} from "next/navigation";

const schema = yup.object({
    email: yup.string()
        .required("Email required")
        .email('Invalid email format'),
    password: yup.string()
        .required("Password is required")
        .matches(/[a-zA-Z]/, "Password can contain only Latin latter's")
        .min(8, "Password required at least 8 chars"),
});

export default function Page() {
    const {state, onChange, messages, setMessages, validate} = useForm({
        email: null,
        password: null,
    }, schema);

    const {login} = useAuth();
    const {push} = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (await validate()) {
            login(state)
                .then(_ => push('/'))
                .catch(err => setMessages(err.response.data.errors));
        }
    }

    return (
        <div className="flex h-full">
            <Form.Root className="m-auto w-[340px]" autoComplete="off" onSubmit={onSubmit} onChange={onChange}>

                <FormField title={"Email"} name={"email"} type={"email"} messages={messages}/>
                <FormField title={"Password"} name={"password"} type={"password"} messages={messages}/>

                <Form.Submit asChild>
                    <button type="submit"
                            className="box-border w-full text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]">
                        Log In
                    </button>
                </Form.Submit>
            </Form.Root>
        </div>
    )
}


