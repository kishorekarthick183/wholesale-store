"use client";

import { useState } from "react";

export default function CheckoutPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log({
            name,
            phone,
        });
    }

    return (
        <main className="mx-auto max-w-lg p-8">
            <h1 className="mb-6 text-3xl font-bold">
                Checkout
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1 block font-medium">
                        Name
                    </label>

                    <input
                        className="w-full rounded border p-2"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block font-medium">
                        Phone
                    </label>

                    <input
                        className="w-full rounded border p-2"
                        type="tel"
                        value={phone}
                        onChange={(event) =>
                            setPhone(event.target.value)
                        }
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded bg-black px-4 py-2 text-white"
                >
                    Continue
                </button>
            </form>
        </main>
    );
}