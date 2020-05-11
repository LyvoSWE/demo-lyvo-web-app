// https://vuetifyjs.com/en/customization/icons/#install-font-awesome-5-icons
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'fa'
  },
  theme: {
    themes: {
      light: {
        primary: colors.deepOrange.accent3,
        secondary: colors.deepOrange.accent1,
        accent: colors.blueGrey.base
      }
    }
  }
})
