// Composants de base
import Aura from '@primevue/themes/aura'
import { DatePicker, Drawer, Listbox, MultiSelect, Select, SelectButton } from 'primevue'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Column from 'primevue/column'
import PrimeVue from 'primevue/config'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Paginator from 'primevue/paginator'
import Panel from 'primevue/panel'
import ProgressBar from 'primevue/progressbar'
import RadioButton from 'primevue/radiobutton'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Toolbar from 'primevue/toolbar'
import Tooltip from 'primevue/tooltip'
import type { App } from 'vue'

export default {
  install(app: App) {
    app.use(PrimeVue, {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        }
      },
    })
    app.use(ToastService) // service global pour Toast
    app.directive('tooltip', Tooltip) // directive pour les tooltips

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
    app.component('Drawer', Drawer)
    app.component('MultiSelect', MultiSelect)
    app.component('Select', Select)
  },
}
