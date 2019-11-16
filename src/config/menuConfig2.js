const menuList = [
  {
    label: "首页", // 菜单标题名称
    key: "/home", // 对应的path
    icon: "iconfont icon-1", // 图标名称
    isPublic: true // 公开的
  },
  {
    label: "商品",
    key: "/products",
    icon: "iconfont icon-shangpin",
    children: [
      // 子菜单列表
      {
        label: "品类管理",
        key: "/category",
        icon: "iconfont icon-pinleiguanli"
      },
      {
        label: "商品管理",
        key: "/product",
        icon: "iconfont icon-shangpinguanli"
      }
    ]
  },

  {
    label: "用户管理",
    key: "/user",
    icon: "iconfont icon-icon-user"
  },
  {
    label: "角色管理",
    key: "/role",
    icon: "iconfont icon-iconfront-"
  },

  {
    label: "图形图表",
    key: "/charts",
    icon: "iconfont icon-tubiao",
    children: [
      {
        label: "柱形图",
        key: "/bar",
        icon: "iconfont icon-shangwutubiao-"
      },
      {
        label: "折线图",
        key: "/line",
        icon: "iconfont icon-zhexiantu"
      },
      {
        label: "饼图",
        key: "/pie",
        icon: "iconfont icon-chartpie"
      }
    ]
  },

  // {
  //   label: "订单管理",
  //   key: "/order",
  //   icon: "el-icon-picture"
  // }
];

export default menuList;
