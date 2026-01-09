
// Composants de base
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import RadioButton from 'primevue/radiobutton'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import Panel from 'primevue/panel'
import Card from 'primevue/card'
import Toolbar from 'primevue/toolbar'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Paginator from 'primevue/paginator'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ProgressBar from 'primevue/progressbar'
import Badge from 'primevue/badge'
import type { App } from 'vue'
import { DatePicker } from 'primevue'



export default {
  install(app: App) {
    
    app.use(ToastService) // service global pour Toast

    // Enregistrement global des composants de base
    app.component('Button', Button)
    app.component('InputText', InputText)
    app.component('Textarea', Textarea)
    app.component('Checkbox', Checkbox)
    app.component('RadioButton', RadioButton)
    app.component('InputNumber', InputNumber)
    app.component('DatePicker', DatePicker)
    app.component('Dialog', Dialog)
    app.component('Panel', Panel)
    app.component('Card', Card)
    app.component('Toolbar', Toolbar)
    app.component('DataTable', DataTable)
    app.component('Column', Column)
    app.component('Paginator', Paginator)
    app.component('Toast', Toast)
    app.component('ProgressBar', ProgressBar)
    app.component('Badge', Badge)
  }
}
