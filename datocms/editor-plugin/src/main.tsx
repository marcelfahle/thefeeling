import { connect } from 'datocms-plugin-sdk'
import FieldExtension from './entrypoints/FieldExtension'
import { render } from './utils/render'
import 'datocms-react-ui/styles.css'

connect({
  manualFieldExtensions() {
    return [{ id: 'tf-editor', name: 'THE FEELING text editor', type: 'editor', fieldTypes: ['text'] }]
  },
  renderFieldExtension(_id, ctx) {
    render(<FieldExtension ctx={ctx} />)
  },
})
