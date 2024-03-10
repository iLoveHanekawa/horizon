'use client'

type ErrorType = {
    error: Error & { digest?: string }
    reset: () => void
}

export default function Error({ error, reset }: ErrorType) {
    return <div>
        <p>{error.message}</p>
        <button onClick={reset}></button>
    </div>
}