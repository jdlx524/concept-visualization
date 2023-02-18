from .models import Nodes

# 创建新的节点对象
new_node = Nodes(text="node1")

# 将新节点保存到数据库中
new_node.save()
