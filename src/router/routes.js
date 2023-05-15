
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/case1', component: () => import('pages/page1.vue') },
      {path:'/shop', component:()=>import('pages/ShoppingList.vue')},
      {path:'/todo', component:()=>import('pages/Todo.vue')},
      {path:'/dbtodo', component:()=>import('pages/DbTodo.vue')},
      {path:'/mydbtodo', component:()=>import('pages/MyDBTodo.vue')}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
