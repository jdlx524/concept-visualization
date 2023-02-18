import json

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django import forms
from .models import Nodes, Edges


class TextForm(forms.Form):
    content = forms.CharField(widget=forms.Textarea)


def admin(request):
    return "Concept Visualization"


def index(request):
    nodelist = Nodes.objects.all()
    nodeText = [x.text for x in nodelist]
    edge = Edges.objects.all()
    edges = [x.edge for x in edge]
    print(edges)
    return render(request, 'index1.html', {
        'nodeText': json.dumps(nodeText),
        'edges': json.dumps(edges)
    })


def save(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        nodes = data.get('nodes')
        edges = data.get('edges')
        print(nodes)
        # 处理数据并返回 JSON 响应
        Nodes.objects.all().delete()
        Edges.objects.all().delete()
        for node in nodes:
            x = Nodes(text=node)
            x.save()
        for edge in edges:
            x = Edges(edge=edge)
            x.save()
        return JsonResponse({'success': True})
    else:
        # 返回渲染后的模板页面
        return "dsbxjp"


def generate_html(V, E):
    # Determine the maximum x and y coordinates to set the SVG canvas size
    max_x = max([v[0] for v in V])
    max_y = max([v[1] for v in V])
    svg_width = max_x + 50  # add some padding to the edges
    svg_height = max_y + 50  # add some padding to the edges

    # Start building the HTML code
    html = "<html><head><style>"
    html += ".node { width: 100px; height: 50px; border: 1px solid black;"
    html += "background-color: lightgray; text-align: center; line-height: 50px; }"
    html += "</style></head><body>\n"

    # Draw the edges as lines between the vertices
    for e in E:
        x1, y1 = V[e[0]]
        x2, y2 = V[e[1]]
        html += f'<svg style="position:absolute; top:0; left:0;" width="{svg_width}" height="{svg_height}">'
        html += f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="black" stroke-width="2"/>'
        html += '</svg>\n'

    # Draw the vertices as DIV elements
    for i, v in enumerate(V):
        x, y = v
        html += f'<div class="node" style="position:absolute; left:{x}px; top:{y}px;">Node {i + 1}</div>\n'

    # Finish building the HTML code
    html += "</body></html>"
    return html
