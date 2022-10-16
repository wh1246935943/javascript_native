const data =[
  {name: "一年级", code: "firstGrade"},
  {name: "王浩", code: "wanghao", parentCode: "firstGrade"},
  {name: "张辉", code: "zhanghui", parentCode: "firstGrade"},
  {name: "张云雷", code: "zhangyunlei", parentCode: "firstGrade"},
  {name: "二年级", code: "secondGrade", parentCode: ""},
  {name: "一班", code: "secondGradeClassOne", parentCode: "secondGrade"},
  {name: "田涛", code: "tiantao", parentCode: "secondGradeClassOne"},
  {name: "学霸组", code: "scholarLord", parentCode: "secondGradeClassOne"},
  {name: "张智超", code: "zhangzhichao", parentCode: "secondGrade"},
  {name: "高雨晴", code: "gaoyuqing", parentCode: "secondGradeClassOne"},
  {name: "陈康", code: "chenkang", parentCode: "scholarLord"}
];

const treeData = buildTree(data);

const container = document.querySelector('.tree-list');
container.addEventListener('click', onClickItem, false)
console.dir(container)

function creatTreeDom(list) {
  /**
   * 存放创建的dom节点，等创建完成后一次插入到页面中
   */
  const cacheNodes = document.createDocumentFragment();
  /**
   * 递归创建树结构的dom元素列表
   */
  function loop(ls, p) {
    ls.forEach(dataItem => {
      const nodeItem = document.createElement('div');
      nodeItem.className = 'tree-list-row';

      nodeItem.appendChild(creatItem(dataItem));
      
      if (dataItem?.children?.length) {
        /**
         * 如果存在子节点，则创建子节点列表的容器
         */
        const nodeItemChildrenList = document.createElement('div');
        nodeItemChildrenList.className = 'tree-list-row-item-childrenlist';
        
        nodeItem.appendChild(nodeItemChildrenList);

        loop(dataItem.children, nodeItemChildrenList)
      };

      p.appendChild(nodeItem);
    });
  };

  loop(list, cacheNodes);

  container.appendChild(cacheNodes)

};

function creatItem(item) {
  const nodeItemParent = document.createElement('div');
  nodeItemParent.setAttribute('data-treecode', item.treeCode)
  nodeItemParent.className = 'tree-list-row-item';
  nodeItemParent.innerText = item.name;

  if (item?.children?.length) {
    nodeItemParent.classList.add('tree-list-row-item_parent');
    nodeItemParent.innerText = `》${item.name}`;
  };

  return nodeItemParent
};

creatTreeDom(treeData);

function onClickItem(e) {

  const event = e || window.event;

  const target = event.target || event.srcElement;

  if (!target?.dataset?.treecode) return

  const {classList, className} = target?.parentNode?.lastChild;

  let state = undefined;

  if (target.className.includes('tree-list-row-item_parent')) {
    if (className.includes('tree-list-row-item-childrenlist_hide')) {
      state = 'close';
    } else {
      state = 'open'
    }
    classList.toggle('tree-list-row-item-childrenlist_hide');
  };

  const code = target.dataset.treecode.split('-').pop();
  /**
   * 这里不能删除
   * eval可以执行一段代码字符串
   */
  const targetData = data.find((item) => item.code === code);

  console.log(container.getAttribute('t-click'));

  const fn = container.getAttribute('t-click');

  eval(`${fn}(targetData, target.dataset.treecode, state)`)
}