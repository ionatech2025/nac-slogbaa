import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import EditorJS from '@editorjs/editorjs'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Header from '@editorjs/header'
import ImageTool from '@editorjs/image'
import Embed from '@editorjs/embed'
import Quote from '@editorjs/quote'
import Delimiter from '@editorjs/delimiter'
import Warning from '@editorjs/warning'
import Table from '@editorjs/table'
import CodeTool from '@editorjs/code'

/**
 * Editor.js wrapper for module content. Saves only when the parent calls save() (e.g. via Save button).
 * Exposes save() via ref so the parent can trigger save.
 * Uses static imports so the editor initializes quickly without async import delays.
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

    const init = () => {
      const holderEl = document.getElementById(holderId)
      if (!holderEl || !isMounted) return

      let data = parseData()
      if (data?.blocks) {
        data = {
          ...data,
          blocks: data.blocks.map((b, i) => ({
            ...b,
            id: b.id || `block-${Date.now()}-${i}`,
          })),
        }
      }
      const hasBlocks = data && Array.isArray(data?.blocks) && data.blocks.length > 0

      editor = new EditorJS({
        holder: holderId,
        readOnly,
        data: hasBlocks ? data : undefined,
        logLevel: 'ERROR',
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
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: "Quote's author",
            },
          },
          delimiter: Delimiter,
          warning: {
            class: Warning,
            inlineToolbar: true,
            config: {
              titlePlaceholder: 'Title',
              messagePlaceholder: 'Message',
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
              withHeadings: true,
            },
          },
          code: {
            class: CodeTool,
            config: {
              placeholder: 'Enter code',
            },
          },
        },
      })

      const finish = async () => {
        await editor.isReady
        if (!isMounted) {
          try { editor.destroy?.() } catch (_) {}
          return
        }
        if (!isMounted) return
        editorRef.current = editor
        const onReadyFn = onReadyRef.current
        if (typeof onReadyFn === 'function') onReadyFn()
      }
      finish().catch((err) => {
        if (isMounted) console.warn('Editor.js init failed', err)
      })
    }

    const id = setTimeout(init, 0)
    return () => {
      clearTimeout(id)
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
        width: '100%',
        fontSize: '0.9375rem',
        lineHeight: 1.6,
      }}
      data-editor-holder
    />
  )
})
