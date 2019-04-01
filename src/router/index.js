import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((res) => {
    resolve(res)
  })
}
// import Singer from 'components/singer/singer'
const Singer = (resolve) => {
  import('components/singer/singer').then((res) => {
    resolve(res)
  })
}
// import Rank from 'components/rank/rank'
const Rank = (resolve) => {
  import('components/rank/rank').then((res) => {
    resolve(res)
  })
}
// import Search from 'components/search/search'
const Search = (resolve) => {
  import('components/search/search').then((res) => {
    resolve(res)
  })
}
// import SingerDetail from 'components/singer-details/singer-details'
const SingerDetail = (resolve) => {
  import('components/singer-details/singer-details').then((res) => {
    resolve(res)
  })
}
// import DiscDetail from 'components/disc-details/disc-details'
const DiscDetail = (resolve) => {
  import('components/disc-details/disc-details').then((res) => {
    resolve(res)
  })
}
// import Ranklist from 'components/ranklist/ranklist'
const Ranklist = (resolve) => {
  import('components/ranklist/ranklist').then((res) => {
    resolve(res)
  })
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: DiscDetail,
          props: true
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          name: 'ranklist',
          component: Ranklist,
          props: true
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
})