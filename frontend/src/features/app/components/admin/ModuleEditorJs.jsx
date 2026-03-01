import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

/**
 * Editor.js wrapper for module content. Saves only when the parent calls save() (e.g. via Save button).
 * Exposes save() via ref so the parent can trigger save.
 */
export const ModuleEditorJs = forwardRef(function ModuleEditorJs({
  initialData,
  onSave,
  onReady,
  readOnly = false,
  holderId = 'module-editor-js',
  minHeight = 280,
}, ref) {
  const editorRef = useRef(null)
  const holderRef = useRef(null)
  const onSaveRef = useRef(onSave)
  const onReadyRef = useRef(onReady)
  onSaveRef.current = onSave
  onReadyRef.current = onReady

  useImperativeHandle(ref, () => ({
    async save() {
      if (!editorRef.current) {
        const msg = 'Editor is not ready yet. Wait a moment and try again.'
        console.warn(msg)
        throw new Error(msg)
      }
      try {
        const output = await editorRef.current.save()
        if (!output || typeof output !== 'object') {
          const msg = 'Editor returned no data to save. Try adding content and save again.'
          throw new Error(msg)
        }
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
    if (typeof window === 'undefined') return

    let isMounted = true
    let editor = null

    const parseData = () => {
      if (!initialData) return null
      if (typeof initialData === 'string') {
        try {
          const parsed = JSON.parse(initialData)
          return parsed && typeof parsed === 'object' ? parsed : null
        } catch (_) {
          return null
        }
      }
      return initialData && typeof initialData === 'object' ? initialData : null
    }

    const init = async () => {
      const holderEl = document.getElementById(holderId)
      if (!holderEl || !isMounted) return

      const EditorJS = (await import('@editorjs/editorjs')).default
      const Paragraph = (await import('@editorjs/paragraph')).default
      const List = (await import('@editorjs/list')).default
      const Header = (await import('@editorjs/header')).default
      const ImageTool = (await import('@editorjs/image')).default
      const Embed = (await import('@editorjs/embed')).default

      const data = parseData()
      const dataForInit = data && Array.isArray(data?.blocks) && data.blocks.length > 0 ? data : undefined

      editor = new EditorJS({
        holder: holderId,
        readOnly,
        data: dataForInit,
        placeholder: readOnly ? '' : 'Start writing or add a block...',
        onChange: undefined,
        autofocus: false,
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
      if (!isMounted) {
        try { editor.destroy?.() } catch (_) {}
        return
      }
      if (data && typeof editor.render === 'function') {
        try {
          await editor.render(data)
        } catch (_) {}
      }
      if (!isMounted) return
      editorRef.current = editor
      const onReadyFn = onReadyRef.current
      if (typeof onReadyFn === 'function') onReadyFn()
    }

    const t = setTimeout(() => {
      init().catch((err) => {
        if (isMounted) console.warn('Editor.js init failed', err)
      })
    }, 50)
    return () => {
      clearTimeout(t)
      isMounted = false
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy()
        editorRef.current = null
      }
    }
  }, [holderId, readOnly, initialData])

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
