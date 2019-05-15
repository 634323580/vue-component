import Vue from 'vue'
import Component from './func-notification'

const NotificationConstructor = Vue.extend(Component)

// 实例集合
const instances = []
// id
let seed = 1


const removeInstance = (instance) => {
  if (!instance) return
  const len = instances.length
  const index = instances.findIndex(inst => instance.id === inst.id)
  // 删除实例
  instances.splice(index, 1)

  // 删除dom后重新计算位置
  if (len <= 1) return
  const removeHeight = instance.vm.height
  for (let i = index; i < len-1; i++) {
    instances[i].verticalOffset =
      parseInt(instances[i].verticalOffset) - removeHeight - 16
  }
}

const notify = (options) => {
  if (Vue.prototype.$isServer) return
  const { autoClose, ...rest } = options
  const instance = new NotificationConstructor({
    propsData: {
      ...rest
    },
    data: {
      autoClose: autoClose === undefined ? 3000 : autoClose
    }
  })
  const id = `notification_${seed++}`
  instance.id = id
  // 调用挂载获取dom节点
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.visible = true

  // 计算每个实例元素的位置
  let verticalOffset = 0
  instances.forEach(item => {
    verticalOffset += item.vm.$el.offsetHeight + 16
  })
  verticalOffset += 16
  instance.verticalOffset = verticalOffset
  instances.push(instance)

  instance.vm.$on('closed', () => {
    removeInstance(instance)
    document.body.removeChild(instance.vm.$el)
    instance.vm.$destroy()
  })
  instance.vm.$on('close', () => {
    instance.vm.visible = false
  })

  return instance.vm

}

export default notify