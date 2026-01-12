import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Brands from '../views/Brands.vue'
import BrandDetail from '../views/BrandDetail.vue'
import Reviews from '../views/Reviews.vue'
import Diseases from '../views/Diseases.vue'
import DiseaseDetail from '../views/DiseaseDetail.vue'
import Selector from '../views/Selector.vue'
import Tutorials from '../views/Tutorials.vue'
import TutorialDetail from '../views/TutorialDetail.vue'
import Compare from '../views/Compare.vue'
import DoctorCenter from '../views/DoctorCenter.vue'
import PatientCenter from '../views/PatientCenter.vue'
import Encyclopedia from '../views/Encyclopedia.vue'
import Search from '../views/Search.vue'
import AgentCenter from '../views/AgentCenter.vue'
import ManufacturerCenter from '../views/ManufacturerCenter.vue'
import ClinicalLibrary from '../views/ClinicalLibrary.vue'
import ClinicalGuides from '../views/ClinicalGuides.vue'
import ClinicalGuideDetail from '../views/ClinicalGuideDetail.vue'
import UserLibrary from '../views/UserLibrary.vue'
import TopicDetail from '../views/TopicDetail.vue'
import PlatformFamily from '../views/PlatformFamily.vue'
import NotFound from '../views/NotFound.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    name: 'Home'
  },
  {
    path: '/encyclopedia',
    component: Encyclopedia,
    name: 'Encyclopedia'
  },
  {
    path: '/products',
    component: Products,
    name: 'Products'
  },
  {
    path: '/product/:id',
    component: ProductDetail,
    name: 'ProductDetail'
  },
  {
    path: '/brands',
    component: Brands,
    name: 'Brands'
  },
  {
    path: '/brand/:id',
    component: BrandDetail,
    name: 'BrandDetail'
  },
  {
    path: '/reviews',
    component: Reviews,
    name: 'Reviews'
  },
  {
    path: '/compare',
    component: Compare,
    name: 'Compare'
  },
  {
    path: '/diseases',
    component: Diseases,
    name: 'Diseases'
  },
  {
    path: '/disease/:id',
    component: DiseaseDetail,
    name: 'DiseaseDetail'
  },
  {
    path: '/selector',
    component: Selector,
    name: 'Selector'
  },
  {
    path: '/tutorials',
    component: Tutorials,
    name: 'Tutorials'
  },
  {
    path: '/tutorial/:id',
    component: TutorialDetail,
    name: 'TutorialDetail'
  },
  {
    path: '/search',
    component: Search,
    name: 'Search'
  },
  {
    path: '/clinical',
    component: ClinicalLibrary,
    name: 'ClinicalLibrary'
  },
  {
    path: '/clinical/:id',
    component: () => import('@/views/KnowledgeDetail.vue'),
    name: 'ClinicalDetail'
  },
  {
    path: '/clinical-guides',
    component: ClinicalGuides,
    name: 'ClinicalGuides'
  },
  {
    path: '/clinical-guide/:id',
    component: ClinicalGuideDetail,
    name: 'ClinicalGuideDetail'
  },
  {
    path: '/user-knowledge',
    component: UserLibrary,
    name: 'UserLibrary'
  },
  {
    path: '/user-knowledge/:id',
    component: () => import('@/views/KnowledgeDetail.vue'),
    name: 'UserKnowledgeDetail'
  },
  {
    path: '/topic/:id',
    component: TopicDetail,
    name: 'TopicDetail'
  },
  {
    path: '/platform/:id',
    component: PlatformFamily,
    name: 'PlatformFamily'
  },
  {
    path: '/doctor',
    component: DoctorCenter,
    name: 'DoctorCenter'
  },
  {
    path: '/patient',
    component: PatientCenter,
    name: 'PatientCenter'
  },
  {
    path: '/agent',
    component: AgentCenter,
    name: 'AgentCenter'
  },
  {
    path: '/manufacturer',
    component: ManufacturerCenter,
    name: 'ManufacturerCenter'
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    name: 'NotFound'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
