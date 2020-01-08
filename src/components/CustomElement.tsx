import React, { useMemo, useState } from 'react'
import {
  createEditor,
  Editor,
  Node,
  Transforms
} from 'slate'

import {
  Editable,
  RenderElementProps,
  Slate,
  withReact
} from 'slate-react'

// Define a React component renderer for our code blocks.
const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>
}

function renderElement(props: RenderElementProps) {
  switch (props.element.type) {
    case 'code':
      return <CodeElement {...props} />
    default:
      return <DefaultElement {...props} />
  }
}

export interface CustomElementProps {
}

const CustomElement: React.FC<CustomElementProps> = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState<Node[]>([
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ])

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        onKeyDown={event => {
          if (event.key === '&') {
            event.preventDefault()
            Editor.insertText(editor, 'and')
          }
          else if (event.key === '`' && event.ctrlKey) {
            event.preventDefault()
            // Determine whether any of the currently selected blocks are code blocks.
            const [match] = Editor.nodes(editor, {
              match: n => n.type === 'code',
            })
            // Toggle the block type depending on whether there's already a match.
            Transforms.setNodes(
              editor,
              { type: match ? 'paragraph' : 'code' },
              { match: n => Editor.isBlock(editor, n) }
            )
          }
        }}
        renderElement={renderElement}
      />
    </Slate>
  )
}

export default CustomElement