"use client";
import Signin from "@/components/Auth/SignIn";
import { Metadata } from "next";



const SigninPage = () => {
    return (
        <>
            <section className="pt-44!">
                <div className="p-16 container mx-auto max-w-540 py-5 rounded-2xl shadow-auth dark:shadow-dark-auth">
                    <Signin signInOpen={false} />
                </div>
            </section>
        </>
    );
};

export default SigninPage;
