const instance = jsPlumb.getInstance();
var myDataElement = document.getElementById("node_data");
var nodeText = myDataElement.dataset.nodeTexts.split(',');
var cleanNodeText = [];

for (var i = 0; i < nodeText.length; i++) {
    var cleanText = nodeText[i].replace(/^[^\w]+|[^\w]+$/g, '');
    cleanNodeText.push(cleanText);
}


myDataElement = document.getElementById("edge_data");
var edge = [];
if(myDataElement) {
    edge = myDataElement.dataset.nodeTexts.split(',');
}
var cleanEdge = [];

for (var i = 0; i < edge.length; i++) {
    var cleanText = edge[i].replace(/^[^\w]+|[^\w]+$/g, '');
    cleanEdge.push(cleanText);
}

const input = document.createElement('input');
input.type = "text";
document.body.appendChild(input);
const create = document.createElement('button');
create.textContent = "create";
document.body.appendChild(create);
const save = document.createElement('button');
save.textContent = "save";
document.body.appendChild(save);

for (const nodeId in cleanNodeText) {
  create_node(cleanNodeText[nodeId],false);
}

const nodes = document.querySelectorAll('.node');
console.log(nodes)
let common2 = {
    isSource: true,
    isTarget: true,
    maxConnections: 2,
}
// instance.bind("connection", function(info) {
//   var sourceId = info.sourceId;
//   var targetId = info.targetId;
//
//     var existingConnection = instance.select({
//       source: sourceId,
//       target: targetId
//     }).length > 1;
//
//     if (!existingConnection) {
//       cleanEdge.push(sourceId+'-'+targetId)
//     }
// });
// instance.bind("connectionDetached", function(info) {
//   var sourceId = info.sourceId;
//   var targetId = info.targetId;
//   cleanEdge = cleanEdge.filter(str => !str.match(sourceId+'-'+targetId));
//   console.log(cleanEdge);
// });
// instance.ready(() => {
//   instance.connect({
//     source: 'node1',
//     target: 'node2',
//     endpoint: 'Dot',
//   });
//   instance.connect({
//     source: 'node1',
//     target: 'node3',
//     endpoint: 'Dot'
//   });
//   instance.connect({
//     source: 'node2',
//     target: 'node4',
//     endpoint: 'Dot'
//   });
//   instance.connect({
//     source: 'node3',
//     target: 'node4',
//     endpoint: 'Dot'
//   });
// })
console.log(cleanEdge)
for(const edgeid in cleanEdge){
    const x = cleanEdge[edgeid].split('-');
    const source_nd = x[0]
    const target_nd = x[1]
    instance.connect({
    source: source_nd,
    target: target_nd,
    endpoint: 'Dot',
    });
}

create.addEventListener('click',()=>{
    if(input.value){
        create_node(input.value,true);
        cleanNodeText.push(input.value);
    }
});

save.addEventListener('click',()=>{
    var connections = instance.getAllConnections();
    cleanEdge = []
    for (var i = 0; i < connections.length; i++) {
      var connection = connections[i];
      var sourceEndpoint = connection.source;
      var targetEndpoint = connection.target;
      var sourceId = sourceEndpoint.id;
      var targetId = targetEndpoint.id;
      cleanEdge.push(sourceId + '-' +targetId);
    }
    const data = {
        'nodes': cleanNodeText,
        'edges': cleanEdge
    };
    console.log(data)
    fetch('/save/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.error(error);
    });
})

nodes.forEach(node => {
    // let flag = true;
    instance.addEndpoint(node.id,{
        anchor: 'Top'
    },common2);
    instance.addEndpoint(node.id,{
        anchor: 'Bottom'
    },common2);
    instance.draggable(node, {
        grid: [10, 10]
    });
    const deleteButton = document.querySelector('#'+node.id+' button');
    node.onmousedown = function (ev) {
        // ... existing code to track mouse movement and update node position ...
        instance.draggable(node, {
            grid: [10, 10]
        });
    }
    deleteButton.addEventListener('click', () => {
        instance.remove(node.id)
        cleanNodeText = cleanNodeText.filter(function(value, index, arr) {
            return value !== node.id;
        });
        var num = 0
        for(const x in cleanNodeText){
            if(cleanNodeText[x] === node.id){
                num = x;
                break;
            }
        }
        // cleanEdge = cleanEdge.filter(str => !str.match(new RegExp("\\b" + num + "\\b")))
    });
    // node.addEventListener('click', function(e) {
    //     const button1 = createButton('Button 1');
    //     const button2 = createButton('Button 2');
    //     // 将按钮附加到节点上
    //     node.appendChild(button1);
    //     node.appendChild(button2);
    // });
});

function create_node(name, flag){
    const nodeElement = document.createElement('div');
  nodeElement.classList.add('node');
  nodeElement.id = name;
  nodeElement.style.left = `${600}px`;
  nodeElement.style.top = `${300}px`;
  const dlt = document.createElement('button');
  dlt.textContent="delete";
  nodeElement.appendChild(dlt);
  const textNode = document.createTextNode(name);
  textNode.contentEditable = true;
  nodeElement.appendChild(textNode);
  document.body.appendChild(nodeElement);
  if(flag){
      instance.addEndpoint(name,{
        anchor: 'Top'
    },common2);
    instance.addEndpoint(name,{
        anchor: 'Bottom'
    },common2);
    instance.draggable(nodeElement, {
        grid: [10, 10]
    });
    const deleteButton = document.querySelector('#'+name+' button');
    nodeElement.onmousedown = function (ev) {
        // ... existing code to track mouse movement and update node position ...
        instance.draggable(nodeElement, {
            grid: [10, 10]
        });
    }
    deleteButton.addEventListener('click', () => {
        instance.remove(name)
        cleanNodeText = cleanNodeText.filter(function(value, index, arr) {
            return value !== name;
        });
        var num = 0
        for(const x in cleanNodeText){
            if(cleanNodeText[x] === name){
                num = x;
                break;
            }
        }
        // cleanEdge = cleanEdge.filter(str => !str.match(new RegExp("\\b" + num + "\\b")))
    });
  }
}
