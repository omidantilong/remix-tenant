import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { getFullPath, getPage } from "../.server/contentfulLegacy"
import { useLoaderData } from "@remix-run/react"
//import { redirect } from "@remix-run/node"

import Section from "../components/Section/Section"
import Text from "../components/Text/Text"

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }]
}

export default function Page() {
  const { page } = useLoaderData() as { page: ContentfulLegacyPage }

  //console.log(page)

  const modules: ContentComponent[] = page.modulesCollection.items

  return (
    <div>
      <h1>{page.title}</h1>
      {modules &&
        modules.map((module) => {
          //console.log(module)
          if (module.type === "Section") return <Section data={module} />
          if (module.type === "Text") return <Text data={module} />
        })}
    </div>
  )
}

export async function loader({ params }: LoaderFunctionArgs) {
  const pathname = "/" + params["*"]!

  const { data } = await getPage({ pathname })

  //if (data.redirect) return redirect(data.to)
  //console.log(data)
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
