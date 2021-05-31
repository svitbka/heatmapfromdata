heatmapfromdata
===============

A JavaScript library for drawing heatmaps with Canvas.

Demo: https://svitbka.github.io/heatmapfromdata/

```js
heatmapfromdata('canvas').grad(gradient).data(data).draw(X, minValue);
```

## Reference

#### Constructor

```js
var heat = simpleheat('canvas');
```

#### Data

```js
// set data of [[value1, value2, ... value10], ..., [value91, value92, ... value100]] format
heat.data(data);
```

#### Appearance

```js
// set data of [[r1, g1, b1], [r2, g2, b2], ...] format
heat.gradient(grad);
```

#### Rendering

```js
// draw a heat map using the required parameters, the variable X is calculated as follows: X = (The number of colors in the gradient) / (the sum of the modules of the maximum and minimum values in the data array), and the variable MinValue - the minimum values in the array data 
heat.draw(X, minValue);
```
