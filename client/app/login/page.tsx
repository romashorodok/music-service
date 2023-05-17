'use client'

import * as Form from "@radix-ui/react-form";
import React from "react";
import {API_HOST} from "~/env";
import axios from "axios";
import useAuth from "~/lib/hooks/useAuth";

type LoginDataForm = {
    email: string;
    password: string;
};

export default function Page() {

    const [formState, setFormState] = React.useReducer<React.Reducer<LoginDataForm, Partial<LoginDataForm>>>(
        (state, next) => ({...state, ...next}),
        {email: null, password: null}
    );

    const {setAccessToken} = useAuth();

    function onChange(e: React.FormEvent) {
        if (e.target instanceof HTMLInputElement) {
            const {name: fieldName, value: fieldValue} = e.target;
            setFormState({[fieldName]: fieldValue});
        }
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            const {data: {token}} = await axios.post(`${API_HOST}/auth/login`, formState);

            setAccessToken(token);

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="flex h-full">
            <Form.Root className="m-auto w-[340px]" autoComplete="off" onSubmit={onSubmit} onChange={onChange}>

                <FormField title={"Email"} name={"email"} type={"email"}/>
                <FormField title={"Password"} name={"password"} type={"password"}/>

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

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    name: string;

    title: string;
    message: string;
};

const FormField = React.forwardRef<
    HTMLInputElement,
    Partial<FormFieldProps>
>(
    ({title, message, ...props}: FormFieldProps, ref: React.Ref<HTMLInputElement>) => {

        return (
            <>
                <Form.Field className="grid mb-[10px]" {...props} ref={ref}>
                    <div className="flex items-baseline justify-between">
                        <Form.Label className="text-xl font-medium leading-[35px] text-white">
                            {title}
                        </Form.Label>
                        <Form.Message className="text-lg text-white opacity-[0.8]" match="valueMissing">
                            {message}
                        </Form.Message>
                    </div>
                    <Form.Control asChild>
                        <input
                            className="box-border w-full bg-white text-black shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-lg leading-none shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_cornflowerblue] focus:shadow-[0_0_0_1px_cornflowerblue] selection:color-white selection:bg-blackA9"
                            required/>
                    </Form.Control>
                </Form.Field>
            </>
        );
    },
)
