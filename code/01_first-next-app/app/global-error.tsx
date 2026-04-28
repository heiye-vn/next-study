'use client'
export default function GlobalError({ error, reset }: { error: Error; reset: any}) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}

/*
    global-error：捕获根组件的 error
*/