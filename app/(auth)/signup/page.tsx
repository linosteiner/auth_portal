"use client"

import {useRouter} from "next/navigation";
import {UserRegisterDTO} from "@/models/user";
import {SignupFormValues} from "@/schemas/signup-schema";
import {SignupForm} from "@/components/auth/forms/signup-form";

export default function SignupPage() {
    const router = useRouter();

    const handleSignup = async (data: SignupFormValues) => {
        // Relative on purpose: the browser hits the api on whatever host served this page,
        // so staging talks to staging and prod to prod without the url being baked into
        // the image. The ingress routes /api to the backend of the same namespace, and it
        // also keeps the call same-origin -- an absolute url meant a visitor on
        // vcs.lennardbernet.ch was calling vcs.linosteiner.ch cross-origin.
        const api_url = "/api/users/register";
        const userRegisterDTO : UserRegisterDTO = (({ confirmPassword, ...dto }) => dto)(data);
        const response = await fetch(api_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userRegisterDTO),
        })

        if (!response.ok) {
            throw new Error("Registration failed")
        }

        router.push("/login")
    }

    return (
        <SignupForm
            onSubmit={handleSignup}
            onCreate={() => router.push("/login")}
        />
    )
}