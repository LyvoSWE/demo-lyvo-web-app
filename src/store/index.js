import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

import {
  SUBMIT_REQUEST,
  SUBMIT_SUCCESS,
  SUBMIT_FAILURE,
  RESET_ALERT
} from './mutation-types'

import { constants } from '@/utils/constants'

const RETRIEVE_REQUEST = 'RETRIEVE_REQUEST'
const RETRIEVE_SUCCESS = 'RETRIEVE_SUCCESS'
const RETRIEVE_FAILURE = 'RETRIEVE_FAILURE'

const url = 'https://us-central1-lyvo-4c9fa.cloudfunctions.net/app'

export default new Vuex.Store({
  state: {
    loading: false,
    alertMsg: '',
    alertType: '',
    applicants: [],
    data: []
  },
  mutations: {
    [SUBMIT_REQUEST](state) {
      state.loading = true
    },
    [SUBMIT_SUCCESS](state) {
      state.alertMsg = 'Submission Successfull'
      state.loading = false
      state.alertType = 'success'
    },
    [SUBMIT_FAILURE](state) {
      state.alertMsg = 'Submission failed'
      state.loading = false
      state.alertType = 'error'
    },
    [RESET_ALERT](state) {
      state.alertMsg = ''
      state.alertType = ''
    },
    [RETRIEVE_REQUEST](state) {},
    [RETRIEVE_SUCCESS](state, payload) {
      state.applicants = payload.apps
      state.data = createGraphData(state.applicants)
    },
    [RETRIEVE_FAILURE](state) {}
  },
  actions: {
    async submitApplication({ commit }, postData) {
      commit(SUBMIT_REQUEST)
      try {
        const payload = await httpPost(`${url}/application`, postData)
        commit(SUBMIT_SUCCESS)
      } catch (e) {
        console.log(e)
        commit(SUBMIT_FAILURE)
      } finally {
        setTimeout(() => commit(RESET_ALERT), 5000)
      }
    },
    async getApplicantCollection({ commit }) {
      commit(RETRIEVE_REQUEST)
      try {
        const payload = await httpGet(`${url}/application`)
        commit(RETRIEVE_SUCCESS, payload)
      } catch (e) {
        console.log(e)
        commit(RETRIEVE_FAILURE)
      }
    }
  },
  modules: {}
})

const httpPost = async (apiEndpoint, postData) => {
  await axios({
    method: 'POST',
    url: apiEndpoint,
    data: postData,
    config: { headers: { 'Content-Type': 'application/json' } }
  })
}

const httpGet = async (apiEndpoint, params) => {
  const resp = await axios.get(apiEndpoint, {
    params
  })
  return resp.data
}

const createGraphData = applicants => {
  return constants.ADMIN.pieCharts.reduce((acc, chartLabel) => {
    const itemCounts = itemsByCount(applicants, chartLabel)
    return { ...acc, [chartLabel]: countsToArray(itemCounts) }
  }, {})
}

const countsToArray = itemCounts => {
  return Object.keys(itemCounts).reduce((acc, item) => {
    acc.push({ name: item, y: itemCounts[item] })
    return acc
  }, [])
}

const itemsByCount = (applicants, field) => {
  return applicants.reduce((acc, applicant) => {
    acc[applicant[field]] = acc[applicant[field]] + 1
    return acc
  }, itemsInApplicationField(field))
}

const itemsInApplicationField = field => {
  return constants.APPLICATION_FIELDS.filter(
    f => f.name === field
  )[0].items.reduce((acc, i) => ({ ...acc, [i]: 0 }), {})
}
