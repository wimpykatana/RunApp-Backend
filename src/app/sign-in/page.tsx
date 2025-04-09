"use client";
import CardSign from "@/components/cardSign";

const SignIn = () => {

    const SignInFunc = (email:string, password:string) => {
        console.log(email, password)
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <CardSign submintFormFunc={SignInFunc} />
        </div>
    );
}

export default SignIn;