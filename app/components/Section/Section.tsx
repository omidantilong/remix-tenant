interface Props {
  data: Section
}

import Text from "../Text/Text"

export default function Section(props: Props) {
  if (!props) return

  const { title, contentCollection } = props.data

  return (
    <>
      <h2>{title}</h2>
      {contentCollection.items.length &&
        contentCollection.items.map((content: ContentComponent) => {
          console.log(content.type)
          if (content.type === "EditorialCard") return <h3>{content.cardHeading}</h3>
          if (content.type === "Text") return <Text data={content} />
        })}
    </>
  )
}
