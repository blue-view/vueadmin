const menuList = [
  {
    label: "平台权限",
    key: "/all",
    children: [
      {
        label: "首页", // 菜单标题名称
        key: "/home", // 对应的path
        icon: "el-icon-s-home", // 图标名称
        isPublic: true // 公开的
      },
      {
        label: "商品",
        key: "/products",
        icon: "el-icon-s-goods",
        children: [
          // 子菜单列表
          {
            label: "品类管理",
            key: "/category",
            icon: "el-icon-picture"
          },
          {
            label: "商品管理",
            key: "/product",
            icon: "el-icon-picture"
          }
        ]
      },

      {
        label: "用户管理",
        key: "/user",
        icon: "el-icon-s-custom"
      },
      {
        label: "角色管理",
        key: "/role",
        icon: "el-icon-user-solid"
      },

      {
        label: "图形图表",
        key: "/charts",
        icon: "el-icon-picture",
        children: [
          {
            label: "柱形图",
            key: "/bar",
            icon: "el-icon-picture"
          },
          {
            label: "折线图",
            key: "/line",
            icon: "el-icon-picture"
          },
          {
            label: "饼图",
            key: "/pie",
            icon: "el-icon-picture"
          }
        ]
      }

      // {
      //   label: "订单管理",
      //   key: "/order",
      //   icon: "el-icon-picture"
      // }
    ]
  }
];

export default menuList;
