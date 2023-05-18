import React from "react";
import * as yup from 'yup';

type MakeRequired<T, K extends keyof T> = Record<K, T[K]>;

export function useForm<F>(initialState: F, schema: yup.Schema) {
    type ErrorMessages = Partial<{ [key in keyof F]: Array<String> }>;
    const [messages, setMessages] = React.useState<ErrorMessages>();

    const [state, setState] = React.useReducer<React.Reducer<MakeRequired<F, keyof F>, Partial<F>>>(
        (state, next) => ({...state, ...next}),
        initialState
    );

    function onChange(e: React.FormEvent) {
        if (e.target instanceof HTMLInputElement) {
            const {name: fieldName, value: fieldValue} = e.target;
            setState({[fieldName]: fieldValue} as Partial<{ [key in keyof F]: F[key] }>);
        }
    }

    async function validate(): Promise<boolean> {
        try {
            await schema.validate(state, {abortEarly: false});

            setMessages({});

            return true;
        } catch (e) {
            if (e instanceof yup.ValidationError) {
                const messages: ErrorMessages = {};

                e.inner.forEach((error: yup.ValidationError) => {
                    const errorKey = error.path;
                    const messageUndefined = !messages[errorKey];

                    if (messageUndefined) {
                        messages[errorKey] = []
                    }

                    messages[errorKey].push(error.message);
                });

                setMessages(messages);

                return false;
            }
        }
    }

    return {state, messages, setMessages, onChange, validate}
}
