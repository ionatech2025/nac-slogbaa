import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'

/**
 * Editor.js wrapper for module content. Saves only when the parent calls save() (e.g. via Save button).
 * Exposes save() via ref so the parent can trigger save.
 */
export const ModuleEditorJs = forwardRef(function ModuleEditorJs({
  initialData,
  onSave,
  readOnly = false,
  holderId = 'module-editor-js',
  minHeight = 280,
}, ref) {
  const editorRef = useRef(null)
  const holderRef = useRef(null)
  const onSaveRef = useRef(onSave)
  onSaveRef.current = onSave

  useImperativeHandle(ref, () => ({
    async save() {
      if (!editorRef.current) {
        console.warn('Editor.js not ready yet')
        return null
      }
      try {
        const output = await editorRef.current.save()
        if (!output) return null
        const onSaveFn = onSaveRef.current
        if (typeof onSaveFn === 'function') {
          await Promise.resolve(onSaveFn(JSON.stringify(output)))
        }
        return output
      } catch (err) {
        console.warn('Editor.js save failed', err)
        throw err
      }
    },
  }), [])

  useEffect(() => {
    if (!holderRef.current || typeof window === 'undefined') return

    let editor = null
    const init = async () => {
      const EditorJS = (await import('@editorjs/editorjs')).default
      const Paragraph = (await import('@editorjs/paragraph')).default
      const List = (await import('@editorjs/list')).default
      const Header = (await import('@editorjs/header')).default
      const ImageTool = (await import('@editorjs/image')).default
      const Embed = (await import('@editorjs/embed')).default

      let data = null
      if (initialData && typeof initialData === 'string') {
        try {
          data = JSON.parse(initialData)
          if (!data || typeof data !== 'object') data = null
        } catch (_) {
          data = null
        }
      } else if (initialData && typeof initialData === 'object') {
        data = initialData
      }

      editor = new EditorJS({
        holder: holderRef.current,
        readOnly,
        data: data || undefined,
        placeholder: readOnly ? '' : 'Start writing or add a block...',
        onChange: undefined,
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a heading',
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered',
            },
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: null,
                byUrl: null,
              },
              field: 'file',
              types: 'image/jpeg, image/png, image/gif, image/webp',
              captionPlaceholder: 'Caption (optional)',
              buttonContent: 'Select image',
              uploader: {
                uploadByFile(file) {
                  return new Promise((resolve) => {
                    const reader = new FileReader()
                    reader.onload = () => resolve({ success: 1, file: { url: reader.result } })
                    reader.readAsDataURL(file)
                  })
                },
              },
            },
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                vimeo: true,
                twitter: true,
                instagram: true,
                codepen: true,
              },
            },
          },
        },
      })

      await editor.isReady
      editorRef.current = editor
    }

    init().catch((err) => console.warn('Editor.js init failed', err))
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [holderId, readOnly])

  return (
    <div
      id={holderId}
      ref={holderRef}
      style={{
        minHeight: readOnly ? undefined : minHeight,
        fontSize: '0.9375rem',
        lineHeight: 1.6,
      }}
    />
  )
})
