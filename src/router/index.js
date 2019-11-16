import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const Index = () => import("../views/Index.vue");
const Login = () => import("../views/Login.vue");
const NotFound = () => import("../views/404.vue");

const Products = () => import("../views/Products.vue");
const Category = () => import("../views/Category.vue");
const Product = () => import("../views/Product.vue");
const ProductDetail = () => import("../views/ProductDetail.vue");//AddOrUpdateProduct
const AddOrUpdateProduct = () => import("../views/AddOrUpdateProduct.vue")

const User = () => import("../views/User.vue");
const Role = () => import("../views/Role.vue");

const Charts = () => import("../views/Charts.vue");
const Bar = () => import("../views/Bar.vue");
const Line = () => import("../views/NLine.vue");
const Pie = () => import("../views/Pie.vue");

const Order = () => import("../views/Order.vue");
const Home = () => import("../views/Home.vue");

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: Home
      },
      {
        path: "/products",
        name: "products",
        component: Products,
        redirect: "/category",
        children: [
          {
            path: "/category",
            name: "category",
            component: Category
          },
          {
            path: "/product",
            name: "product",
            component: Product
          },
          {
            path: "/detail",
            name: "detail",
            component: ProductDetail
          },
          {
            path:"/addOrUpdate",
            name:'addOrUpdate',
            component:AddOrUpdateProduct
          }
        ]
      },
      {
        path: "/user",
        name: "user",
        component: User
      },
      {
        path: "/role",
        name: "role",
        component: Role
      },
      {
        path: "/charts",
        name: "charts",
        component: Charts,
        redirect: "/bar",
        children: [
          {
            path: "/bar",
            name: "bar",
            component: Bar
          },
          {
            path: "/line",
            name: "line",
            component: Line
          },
          {
            path: "/pie",
            name: "pie",
            component: Pie
          }
        ]
      },
      {
        path: "/order",
        name: "order",
        component: Order
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },

  {
    path: "*",
    name: "notFound",
    component: NotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: '/vueAdmin/',
  routes
});

export default router;
