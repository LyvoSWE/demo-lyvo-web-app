import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import storeConfig from '../utils/store-config'
import { cloneDeep } from 'lodash'

import axios from 'axios'
import { urlPrefix } from '@/utils/api'

import applicantsResponse from '../utils/applicantsResponse'
import testApplicant from '../utils/testApplicant'

const localVue = createLocalVue()
localVue.use(Vuex)

const config = {
  headers: { 'Content-Type': 'application/json' }
}

describe('submitApplication', () => {
  const stubBody = { config, data: testApplicant }
  let axiosStub
  let store
  before(() => {
    axiosStub = sinon
      .stub(axios, 'post')
      .withArgs(`${urlPrefix}/application`, stubBody)
  })

  beforeEach(() => {
    store = new Vuex.Store(cloneDeep(storeConfig))
  })

  it('posts an applicant using axios', async () => {
    const data = 'Successfull Post Request'
    axiosStub.resolves({ status: 200, data: { data } })
    expect(store.state.submitRequestLoading).to.be.false

    await store.dispatch('submitApplication', testApplicant)

    expect(store.state.alertMsg).to.equal('Submission successful')
  })
})
