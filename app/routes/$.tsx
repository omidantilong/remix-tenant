import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { getFullPath, getPage } from "../.server/contentfulLegacy"
import { useLoaderData } from "@remix-run/react"
import { redirect } from "@remix-run/node"
export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }]
}

export default function Page() {
  const { page } = useLoaderData() as { page: ContentfulLegacyPage }

  console.log(page)

  return <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>{page.title}</div>
}

export async function loader({ params }: LoaderFunctionArgs) {
  const pathname = "/" + params["*"]!

  const { data } = await getPage({ pathname })

  if (data.redirect) return redirect(data.to)

  const page = data.pageCollection.items[0]

  if (!page) throw pageNotFound()

  const path = getFullPath(page)

  if (path !== pathname) throw pageNotFound()

  return { page }
}

function pageNotFound() {
  return new Response(null, {
    status: 404,
    statusText: "Not Found",
  })
}
