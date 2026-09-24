// Local test page for the editor config: `pnpm --filter tf-datocms-editor dev`, open /harness.html
import { Editor as ReactEditor } from '@tinymce/tinymce-react'
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import tinymce from 'tinymce/tinymce'
import 'tinymce/icons/default'
import 'tinymce/models/dom'
import 'tinymce/themes/silver'
import 'tinymce/skins/ui/oxide/skin'
import 'tinymce/skins/content/default/content'
import 'tinymce/plugins/image'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/code'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/table'
import 'tinymce/plugins/autoresize'
import { editorInit, loadConfig, type EditorConfig } from './editorConfig'
;(window as unknown as { tinymce: typeof tinymce }).tinymce = tinymce

function Harness() {
  const [config, setConfig] = useState<EditorConfig | null>(null)
  const [html, setHtml] = useState(
    '<p>donqi Delivery Services<br><strong>Naming, Branding</strong></p><p>CoVid was a sucker.</p>'
  )
  useEffect(() => void loadConfig().then(setConfig), [])
  useEffect(() => {
    document.getElementById('out')!.textContent = html
  }, [html])
  if (!config) return <p>loading…</p>
  return <ReactEditor licenseKey="gpl" init={editorInit(config, false)} value={html} onEditorChange={setHtml} />
}
createRoot(document.getElementById('root')!).render(<Harness />)
