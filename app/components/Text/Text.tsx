interface Props {
  data: Text
}

import { LoaderFunctionArgs, json } from "@remix-run/node"
import { Await, defer, useLoaderData } from "@remix-run/react"
import { Suspense } from "react"

export default function Text(props: Props) {
  const { data } = props
  console.log("Text component")
  const parsedText = useLoaderData<typeof loader>()
  console.log(parsedText)
  return (
    <Suspense>
      <Await resolve={parsedText}>
        PLop
        <p>{data.text}</p>
      </Await>
    </Suspense>
  )
}

export async function loader({ params }: LoaderFunctionArgs) {
  console.log(params.page)

  return json({ parsedText: "plop" })
}
