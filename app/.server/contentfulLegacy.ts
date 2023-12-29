// https://hashinteractive.com/blog/graphql-recursive-query-with-fragments/
// https://github.com/graphql/graphql-spec/issues/929

export async function getPage({ pathname }: { pathname: string }) {
  const redirect = await getRedirect(pathname)

  if (redirect) return { data: { redirect: true, ...redirect } }

  const slug = getSlugFromPath(pathname)

  const query = `
    query PageQuery {
      pageCollection(where: {url: "${slug}"}, limit: 1) { 
        items { 
          type: __typename
          sys {
            id
          }
          title,
          url,
          parentPage {
            ...on Page {
              title,
              url
            }
          }
          modulesCollection(limit: 10) {
            items {
              type: __typename
              ...on Entry {
                sys {
                  id
                }
              }
              ...on Text {
                title
                text
              }
              ...on Section {
                title
                contentCollection(limit: 20) {
                  items {
                    type: __typename
                    ...on EditorialCard {
                      cardHeading,
                      cardLabel,
                      cardBody,
                      image {
                        url,
                        title
                      }
                    }
                  }
                }
              }
            }
          }
        } 
      } 
    }`

  // const data = await fetchData({ query })
  // console.log(JSON.stringify(data, null, 2))
  return await fetchData({ query })
}

export function getSlugFromPath(pathname: string) {
  return pathname.split("/").at(-1)
}

export async function getAsset(id: string) {
  const query = `
    query AssetQuery { 
      asset(id:"${id}") {
        title
        contentType
        width
        height
        sys {
          id
        }
      }
    }`
  return await fetchData({ query })
}

export async function getRedirect(pathname: string) {
  const query = `
    query RedirectQuery {
      redirectCollection(limit: 3000) {
        items {
          from,
          to
        }
      }
    }
  `

  const { data } = await fetchData({ query })

  for (let redirect of data.redirectCollection.items) {
    const exp = `^${redirect.from}`
    if (pathname.match(exp)) {
      console.log("Redirect match")
      return redirect
    }
  }
}

export async function fetchData({ query, preview = false }: { query: string; preview?: boolean }) {
  const token = preview ? process.env.CONTENTFUL_PREVIEW_API : process.env.CONTENTFUL_DELIVERY_API

  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const spaceEnv = process.env.CONTENTFUL_ENV

  return await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${spaceEnv}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    }
  ).then((res) => {
    console.log(`Query complexity: ${res.headers.get("X-Contentful-Graphql-Query-Cost")} / 11000`)
    return res.json()
  })
}

export function getPathSegments(page: ContentfulLegacyPage) {
  const path = [page.url]

  if (page.parentPage) {
    path.push(getPathSegments(page.parentPage))
  }

  return path.reverse().join("/")
}

export function getFullPath(page: ContentfulLegacyPage) {
  return `/${getPathSegments(page)}`
}
