import { boot } from 'quasar/wrappers'
import titleMixin from 'src/mixins/titlemixin'

export default boot(({ app }) => {

  app.mixin(titleMixin);
  // Set i18n instance on app
})
