# a-simbol

This is an [A-Frame](https://aframe.io) component for [Simbol](https://simbol.io) to easily integrate Simbol in declarative 3D sites

## Getting Started

Add it to your dependencies:

```bash
npm install -s a-simbol
```

And then add the tag to your HTML:

```html
<a-simbol hand="right" virtualpersona="{'signIn': true}"></a-simbol>
```

Check it out on glitch: https://glitch.com/edit/#!/a-simbol-example

## Adding interactions

It also provides the component `simbol-selectable`, add it to any entity and it will emit the following events with Simbol's interaction system:

* `Simbol.selected`
* `Simbol.unselected`
* `Simbol.hover`
* `Simbol.unhover`

```html
<a-box simbol-selectable></a-box>
```

```js
document.querySelector('a-box').addEventListener('Simbol.selected', () => {
	console.log('Box clicked');
});
```

## Contributing

Check out the [Contribution guide](https://github.com/wearesimbol/simbol/blob/master/CONTRIBUTING.md)! If you have any questions, join our [community](http://spectrum.chat/simbol)


## License

This program is free software and is distributed under an [MIT License](https://github.com/wearesimbol/a-simbol/blob/master/LICENSE).
