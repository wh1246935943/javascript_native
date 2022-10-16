function buildTree(data = [], props = {}) {
  const {
    pId = 'parentCode', // 数据的父节点字段，
    id = 'code', // 数据的自身唯一标识
    keepChildren = false, // 该菜单下如果不存在子菜单，是否创建子菜单的集合，也就是children参数
    children = 'children', // 返回的树结构中创建的子菜单的字段名
  } = props;
  /**
   * 深拷贝数据，避免更改原始数据
   * 并筛选出根节点
   */
  const deepCopy = JSON.parse(JSON.stringify(data));
  const treeRoot = deepCopy.filter((node) => {
    if (!node?.[pId]) {
      node.treeCode = node[id];
      return true;
    }
  });

  // 递归生成节点及子节点数据
  const findChildren = (tree) => {
    tree.forEach((node) => {
      /**
       * 从原始数据中筛选其子元素
       */
      node[children] = deepCopy.filter((cNode) => {
        if (cNode[pId] === node[id]) {
          cNode.treeCode = `${node.treeCode}-${cNode[id]}`;
          return true;
        }
      });

      /**
       * 如果子元素集合存在且有内容，
       * 则递归继续查找其子元素是否还包含有子元素
       */
      if (node?.[children]?.length) {
        findChildren(node[children]);
        /**
         * 如果该元素下没有子元素是否保留其子元素的集合
         */
      } else if (!keepChildren) {
        delete node[children];
      }
    });
  };

  findChildren(treeRoot);

  return treeRoot;
}